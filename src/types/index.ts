export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}