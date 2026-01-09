export interface Task {
  category: string;
  description: string;
  passes: boolean;
  steps: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Reserved for future config options
export interface ChiefConfig {}

export interface WorktreeInfo {
  createdAt: Date;
  name: string;
  path: string;
  taskProgress?: {
    completed: number;
    total: number;
  };
}
