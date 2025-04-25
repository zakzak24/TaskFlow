import React, { useState } from 'react';
import { Search, List, Grid, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '../types';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  selectedCategoryId: string;
  categories: any[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

type ViewMode = 'list' | 'grid';
type SortOption = 'createdAt' | 'priority';
type SortDirection = 'asc' | 'desc';
type FilterOption = 'all' | 'active' | 'completed';

const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedCategoryId,
  categories,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter todos by selected category
  const filteredTodos = todos
    .filter((todo) => selectedCategoryId === 'all' || todo.categoryId === selectedCategoryId)
    .filter((todo) => {
      // Filter by status
      if (filterStatus === 'active') return !todo.completed;
      if (filterStatus === 'completed') return todo.completed;
      return true;
    })
    .filter((todo) => 
      // Filter by search term
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort todos
      if (sortBy === 'createdAt') {
        return sortDirection === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityValue = { low: 1, medium: 2, high: 3 };
        return sortDirection === 'asc'
          ? priorityValue[a.priority] - priorityValue[b.priority]
          : priorityValue[b.priority] - priorityValue[a.priority];
      }
      return 0;
    });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-md ${
              showFilters ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
                <div className="flex space-x-2">
                  {['all', 'active', 'completed'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setFilterStatus(option as FilterOption)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        filterStatus === option
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Sort by</h4>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-md"
                  >
                    <option value="createdAt">Date</option>
                    <option value="priority">Priority</option>
                  </select>
                  <button
                    onClick={toggleSortDirection}
                    className="p-1 text-gray-600 hover:text-gray-800 bg-gray-100 rounded-md"
                  >
                    <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'rotate-180' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredTodos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}>
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categories={categories}
                onToggle={onToggle}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default TodoList;