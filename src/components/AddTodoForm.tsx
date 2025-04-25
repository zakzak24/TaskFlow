import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '../types';

interface AddTodoFormProps {
  categories: Category[];
  selectedCategoryId: string;
  onAddTodo: (
    text: string,
    categoryId: string,
    priority: 'low' | 'medium' | 'high'
  ) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({
  categories,
  selectedCategoryId,
  onAddTodo,
}) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const [localCategoryId, setLocalCategoryId] = useState(selectedCategoryId);

  useEffect(() => {
    setLocalCategoryId(selectedCategoryId);
  }, [selectedCategoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text, localCategoryId, priority);
      setText('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      layout
      className="mb-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center">
          <Plus size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Priority
              </label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p as 'low' | 'medium' | 'high')}
                    className={`px-3 py-1 text-sm rounded-full ${
                      priority === p
                        ? p === 'low'
                          ? 'bg-blue-100 text-blue-700'
                          : p === 'medium'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Category:</label>
                <select
                  value={localCategoryId}
                  className="text-sm border border-gray-200 rounded px-2 py-1"
                  onChange={(e) => setLocalCategoryId(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <motion.button
                  role="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Task
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
};

export default AddTodoForm;
