import React, { useState } from 'react';
import { CheckCircle, Circle, Pencil, Trash2, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Todo, Category } from '../types';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  categories, 
  onToggle, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategoryId, setEditCategoryId] = useState(todo.categoryId);

  const category = categories.find(cat => cat.id === todo.categoryId) || categories[0];

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { 
        text: editText, 
        priority: editPriority, 
        categoryId: editCategoryId 
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
      setEditPriority(todo.priority);
      setEditCategoryId(todo.categoryId);
    }
  };

  const priorityClasses = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group p-4 mb-3 rounded-lg shadow-sm border border-gray-100 
        ${todo.completed ? 'bg-gray-50' : 'bg-white'}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={editPriority} 
              onChange={(e) => setEditPriority(e.target.value as Todo['priority'])}
              className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select 
              value={editCategoryId} 
              onChange={(e) => setEditCategoryId(e.target.value)}
              className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(false);
                setEditText(todo.text);
                setEditPriority(todo.priority);
                setEditCategoryId(todo.categoryId);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full"
            >
              <X size={18} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="p-2 text-blue-600 hover:text-blue-800 rounded-full"
            >
              <Save size={18} />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex items-start">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`mt-0.5 flex-shrink-0 mr-3 text-gray-400 hover:text-blue-500 
              ${todo.completed ? 'text-green-500 hover:text-green-700' : ''}`}
          >
            {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
          </motion.button>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span 
                className={`text-sm px-2 py-0.5 rounded-full ${priorityClasses[todo.priority]}`}
              >
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              
              <span 
                className="text-sm px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                {category.name}
              </span>
            </div>
            
            <p className={`text-gray-800 break-words ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </p>
            
            <p className="text-xs text-gray-400 mt-1">
              {new Date(todo.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex-shrink-0 flex ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-blue-500 rounded-full"
            >
              <Pencil size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todo.id)}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TodoItem;