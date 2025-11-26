// components/types.ts

export interface Task {
  id: string;
  title: string;
  body: string;
  status: string;
}

export type TaskInput = Omit<Task, "id">;
