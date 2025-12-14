export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
  dueDate: string;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail: string;
  dueDate: string;
}

export interface Comment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

// Update Task Interface to include comments
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeEmail: string;
  dueDate: string;
  comments?: Comment[]; // <--- New optional field
}