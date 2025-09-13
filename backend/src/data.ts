import { User, Task } from './models';

export const users: User[] = [
  { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
  { id: 2, name: 'Bob Jones', email: 'bob@example.com' }
];

export const tasks: Task[] = [
  { id: 1, title: 'Buy groceries', priority: 'medium' },
  { id: 2, title: 'Write article', description: 'Draft the blog post', priority: 'high' }
];

// Map of userId to array of assigned taskIds
export const userTasks: Record<number, number[]> = {
  1: [1],
  2: [2]
};
