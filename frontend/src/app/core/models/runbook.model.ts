export interface Runbook {
  id: number;
  title: string;
  description: string;
  steps: string;
  authorId: number;
  createdAt: string;
}

export interface RunbookRequest {
  title: string;
  description: string;
  steps: string;
}
