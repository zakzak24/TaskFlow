import React, { useState } from 'react';
import { Plus, Pencil, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: (name: string, color: string) => void;
  onUpdateCategory: (id: string, updates: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

const ColorOptions = [
  '#3B82F6', // blue
  '#EC4899', // pink
  '#10B981', // green
  '#8B5CF6', // purple
  '#F97316', // orange
  '#6366F1', // indigo
];

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(ColorOptions[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName, newCategoryColor);
      setNewCategoryName('');
      setNewCategoryColor(ColorOptions[0]);
      setIsAdding(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateCategory(id, { name: editName });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingId(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {editingId === category.id ? (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => saveEdit(category.id))
                    }
                    className="px-3 py-2 w-full focus:outline-none text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(category.id)}
                    className="p-2 text-green-600 hover:text-green-800"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => onSelectCategory(category.id)}
                  className={`group flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                    selectedCategoryId === category.id
                      ? 'bg-gray-100 shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-800">{category.name}</span>

                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(category);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-500 rounded-full"
                    >
                      <Pencil size={14} />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCategory(category.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {isAdding && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col p-3 border border-gray-200 rounded-lg space-y-2"
            >
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleAddCategory)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />

              <div className="flex flex-wrap gap-2">
                {ColorOptions.map((color) => (
                  <div
                    key={color}
                    onClick={() => setNewCategoryColor(color)}
                    className={`w-6 h-6 rounded-full cursor-pointer ${
                      newCategoryColor === color
                        ? 'ring-2 ring-offset-2 ring-gray-400'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isAdding && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            <Plus size={18} className="mr-1" />
            <span>New Category</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
