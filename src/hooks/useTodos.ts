import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, Category } from '../types';

// Default categories
const defaultCategories: Category[] = [
  { id: 'personal', name: 'Personal', color: '#3B82F6' }, // blue
  { id: 'work', name: 'Work', color: '#EC4899' }, // pink
  { id: 'shopping', name: 'Shopping', color: '#10B981' }, // green
];

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos, (key, value) =>
          key === 'createdAt' ? new Date(value) : value
        );
      } catch (e) {
        console.error('Error parsing todos from localStorage', e);
        return [];
      }
    }
    return [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      try {
        return JSON.parse(savedCategories);
      } catch (e) {
        console.error('Error parsing categories from localStorage', e);
        return defaultCategories;
      }
    }
    return defaultCategories;
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // const addTodo = (
  //   text: string,
  //   categoryId: string,
  //   priority: 'low' | 'medium' | 'high' = 'medium'
  // ) => {
  //   const newTodo: Todo = {
  //     id: uuidv4(),
  //     text,
  //     completed: false,
  //     createdAt: new Date(),
  //     priority,
  //     categoryId,
  //   };
  //   setTodos([...todos, newTodo]);
  // };
  const addTodo = (
    text: string,
    categoryId: string,
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    const newTodo: Todo = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
      categoryId,
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodo = (
    id: string,
    updates: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      color,
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    // Only delete if it's not the last category
    if (categories.length <= 1) return;

    // Move todos from this category to the first available category
    const firstCategoryId = categories.find((cat) => cat.id !== id)?.id || '';

    setTodos(
      todos.map((todo) =>
        todo.categoryId === id ? { ...todo, categoryId: firstCategoryId } : todo
      )
    );

    setCategories(categories.filter((category) => category.id !== id));
  };

  const updateCategory = (
    id: string,
    updates: Partial<Omit<Category, 'id'>>
  ) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  return {
    todos,
    categories,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    addCategory,
    deleteCategory,
    updateCategory,
  };
};
