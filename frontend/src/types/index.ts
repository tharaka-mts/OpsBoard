export type WorkItemStatus = 'OPEN' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE';
export type WorkItemPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type WorkItemEnvironment = 'DEV' | 'STAGING' | 'PROD';

export interface WorkItem {
  id: number;
  title: string;
  description: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  ownerName: string;
  environment: WorkItemEnvironment;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
