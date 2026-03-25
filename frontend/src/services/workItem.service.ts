import api from './api';
import type { WorkItem } from '../types';

export const workItemService = {
  getAll: async (): Promise<WorkItem[]> => {
    const response = await api.get<WorkItem[]>('/work-items');
    return response.data;
  },
  
  create: async (item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkItem> => {
    const response = await api.post<WorkItem>('/work-items', item);
    return response.data;
  },

  update: async (id: number, item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkItem> => {
    const response = await api.put<WorkItem>(`/work-items/${id}`, item);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/work-items/${id}`);
  }
};
