import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Menu, X } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import CategoryList from './components/CategoryList';

function App() {
  const {
    todos,
    categories,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useTodos();

  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [exampleTodosAdded, setExampleTodosAdded] = useState(false);

  // useEffect(() => {
  //   if (!exampleTodosAdded) {
  //     addTodo('Buy groceries', 'shopping', 'medium');
  //     addTodo('Finish project report', 'work', 'high');
  //     addTodo('Call mom', 'personal', 'low');
  //     setExampleTodosAdded(true);
  //   }
  // }, [addTodo, exampleTodosAdded]);

  const displayCategories = [
    { id: 'all', name: 'All Tasks', color: '#6B7280' },
    ...categories,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <CheckSquare className="text-blue-500 mr-2" size={24} />
            <h1 className="text-xl font-semibold text-gray-800">TaskFlow</h1>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Sidebar */}
          <motion.aside
            className={`md:w-64 md:block md:flex-shrink-0 ${
              isMobileMenuOpen ? 'block' : 'hidden'
            }`}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryList
              categories={displayCategories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
            />
          </motion.aside>

          {/* Main content */}
          <main className="flex-1">
            <motion.h2
              layout
              className="text-2xl font-semibold mb-4 text-gray-800"
            >
              {selectedCategoryId === 'all'
                ? 'All Tasks'
                : categories.find((cat) => cat.id === selectedCategoryId)
                    ?.name || 'Tasks'}
            </motion.h2>

            <AddTodoForm
              categories={categories}
              selectedCategoryId={
                selectedCategoryId === 'all'
                  ? categories[0].id
                  : selectedCategoryId
              }
              onAddTodo={addTodo}
            />

            <TodoList
              todos={todos}
              selectedCategoryId={selectedCategoryId}
              categories={categories}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
