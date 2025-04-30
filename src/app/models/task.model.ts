export interface Task {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    isCompleted: boolean;
    timeSpentInSeconds?: number;
    createdAt: Date;
    updatedAt: Date;
}
  