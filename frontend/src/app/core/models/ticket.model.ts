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
