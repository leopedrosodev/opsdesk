export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  creatorId: number;
  assigneeId: number | null;
  createdAt: string;
  closedAt: string | null;
  assetIds: number[];
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface UpdateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
}

export interface TicketComment {
  id: number;
  ticketId: number;
  authorId: number;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface PageResult<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface AddCommentRequest {
  content: string;
}
