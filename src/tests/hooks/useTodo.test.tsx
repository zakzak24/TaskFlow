import { render, act, screen } from '@testing-library/react';
import { useTodos } from '../../hooks/useTodos';
import { vi } from 'vitest';

// Composant de test pour utiliser le hook
const TestComponent = () => {
  const {
    todos,
    categories,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    addCategory,
    deleteCategory,
    updateCategory,
  } = useTodos();

  return (
    <div>
      <button onClick={() => addTodo('New Task', 'personal', 'high')}>
        Add Todo
      </button>
      <button onClick={() => addCategory('New Category', '#FF5733')}>
        Add Category
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => toggleTodo(todo.id)}>Toggle</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => deleteCategory(category.id)}>
              Delete Category
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

test('should add a new todo and category', async () => {
  const { container } = render(<TestComponent />);

  // Vérifier l'absence initiale des éléments
  expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  expect(screen.queryByText('New Category')).not.toBeInTheDocument();

  // Simuler l'ajout d'une tâche
  act(() => {
    const addTodoButton = screen.getByText('Add Todo');
    addTodoButton.click();
  });

  // Vérifier que la tâche a été ajoutée
  expect(screen.getByText('New Task')).toBeInTheDocument();

  // Simuler l'ajout d'une catégorie
  act(() => {
    const addCategoryButton = screen.getByText('Add Category');
    addCategoryButton.click();
  });

  // Vérifier que la catégorie a été ajoutée
  expect(screen.getByText('New Category')).toBeInTheDocument();
});
