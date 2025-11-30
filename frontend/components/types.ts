// components/types.ts

export interface Task {
  id: string;
  title: string;
  body: string;
  status: string;
  date: string;
  category: string;
  volunteerID: string;

  address?: string;
  startTime?: string;
  endTime?: string;
  elderName?: string;
}

export type TaskInput = Task;
