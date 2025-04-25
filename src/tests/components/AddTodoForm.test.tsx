import { render, screen, fireEvent } from '@testing-library/react';
import AddTodoForm from '../../components/AddTodoForm';
import { vi } from 'vitest';

// Mock de la fonction onAddTodo
const mockAddTodo = vi.fn();

// Données de test pour les catégories
const categories = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
];

test('should render the AddTodoForm and handle input', async () => {
  // Rendre le composant AddTodoForm avec les props nécessaires
  render(
    <AddTodoForm
      categories={categories}
      selectedCategoryId="1"
      onAddTodo={mockAddTodo}
    />
  );

  // Vérifier que le champ texte est présent
  const inputElement = screen.getByPlaceholderText(/add a new task/i);
  expect(inputElement).toBeInTheDocument();

  // Simuler un changement de texte dans le champ input
  fireEvent.change(inputElement, { target: { value: 'Test Todo' } });
  expect(inputElement).toHaveValue('Test Todo');

  // Simuler un focus sur le champ input pour déclencher l'expansion
  fireEvent.focus(inputElement);

  // Attendre que le bouton "Add Task" soit visible
  const buttonElement = await screen.findByRole('button', {
    name: /add task/i,
  });
  expect(buttonElement).toBeInTheDocument();

  // Simuler un clic sur le bouton "Add Task"
  fireEvent.click(buttonElement);

  // Vérifier que la fonction onAddTodo a été appelée avec les bons arguments
  expect(mockAddTodo).toHaveBeenCalledWith('Test Todo', '1', 'medium');
});
