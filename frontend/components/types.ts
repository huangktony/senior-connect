// components/types.ts

export interface Task {
  id: string;
  title: string;
  body: string;
  status: string;
  date: string;
  volunteerID: string;
}

export type TaskInput = Task;
