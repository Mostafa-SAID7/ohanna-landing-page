/**
 * Contact queries
 * Data access layer for contact messages
 */

import { db, contactsTable } from "../index";
import { eq, desc } from "drizzle-orm";
import type { InsertContact, Contact } from "../schema";
import { generateId } from "../../lib/id-generator";

export const contactQueries = {
  /**
   * Get all contacts
   */
  async getAll(): Promise<Contact[]> {
    return db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  },

  /**
   * Get contact by ID
   */
  async getById(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contactsTable).where(eq(contactsTable.id, id));
    return result[0];
  },

  /**
   * Get contacts by email
   */
  async getByEmail(email: string): Promise<Contact[]> {
    return db
      .select()
      .from(contactsTable)
      .where(eq(contactsTable.email, email))
      .orderBy(desc(contactsTable.createdAt));
  },

  /**
   * Create contact
   */
  async create(data: InsertContact): Promise<Contact> {
    const result = await db.insert(contactsTable).values({
      id: generateId(),
      ...data,
    }).returning();
    return result[0];
  },

  /**
   * Delete contact
   */
  async delete(id: string): Promise<boolean> {
    const result = await db.delete(contactsTable).where(eq(contactsTable.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Get recent contacts
   */
  async getRecent(limit: number = 10): Promise<Contact[]> {
    return db
      .select()
      .from(contactsTable)
      .orderBy(desc(contactsTable.createdAt))
      .limit(limit);
  },
};
