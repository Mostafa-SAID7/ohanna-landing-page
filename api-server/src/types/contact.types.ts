/**
 * Contact-related type definitions
 */

import type { BaseEntity } from './shared.types';

/**
 * Contact priority levels
 */
export type ContactPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Contact status
 */
export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'closed';

/**
 * Contact category
 */
export type ContactCategory = 
  | 'general_inquiry'
  | 'product_question'
  | 'order_support'
  | 'technical_issue'
  | 'complaint'
  | 'suggestion'
  | 'partnership'
  | 'media_inquiry';

/**
 * Contact request structure
 */
export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category?: ContactCategory;
  priority?: ContactPriority;
  orderId?: string; // If related to an order
}

/**
 * Contact response
 */
export interface ContactResponse {
  success: boolean;
  message: string;
  ticketId?: string;
  estimatedResponse?: string; // e.g., "within 24 hours"
}

/**
 * Contact details (internal)
 */
export interface ContactDetails extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category: ContactCategory;
  priority: ContactPriority;
  status: ContactStatus;
  orderId?: string;
  assignedTo?: string; // Staff member ID
  internalNotes?: string;
  responseCount: number;
  lastResponseAt?: Date;
  resolvedAt?: Date;
}

/**
 * Contact summary for lists
 */
export interface ContactSummary {
  id: string;
  name: string;
  email: string;
  subject?: string;
  category: ContactCategory;
  priority: ContactPriority;
  status: ContactStatus;
  createdAt: Date;
  lastResponseAt?: Date;
}

/**
 * Contact filters for admin
 */
export interface ContactFilters {
  status?: ContactStatus[];
  category?: ContactCategory[];
  priority?: ContactPriority[];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasResponse?: boolean;
}

/**
 * Contact statistics
 */
export interface ContactStats {
  totalContacts: number;
  newContacts: number;
  resolvedContacts: number;
  averageResponseTime: number; // in hours
  categoryBreakdown: Record<ContactCategory, number>;
  priorityBreakdown: Record<ContactPriority, number>;
}