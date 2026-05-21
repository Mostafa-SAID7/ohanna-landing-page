import { contactQueries } from "../db/queries";
import { inMemoryContacts } from "../lib/in-memory-store";
import { generateId } from "../lib/id-generator";
import { validateEmail, validateText, normalizeText } from "../lib/string-utils";
import { logger } from "../lib/logger";
import type { ContactRequest, ContactResponse } from "../types";

export const contactService = {
  async submit(data: ContactRequest): Promise<ContactResponse> {
    const { name, email, subject, message } = data;

    // Validate and normalize all fields using centralized utilities
    const validatedName = validateText(name, "Name", 1, 255);
    const validatedEmail = validateEmail(email);
    const validatedMessage = validateText(message, "Message", 1, 5000);
    const normalizedSubject = subject ? normalizeText(subject) : null;

    const contactData = {
      id: generateId(),
      name: validatedName,
      email: validatedEmail,
      subject: normalizedSubject,
      message: validatedMessage,
    };

    try {
      await contactQueries.create(contactData);
    } catch {
      logger.warn("Database unavailable, storing contact in memory");
      inMemoryContacts.push({ ...contactData, createdAt: new Date() });
    }

    return { 
      success: true, 
      message: "Message received. We'll reply within 24 hours.",
      ticketId: contactData.id,
    };
  },
};
