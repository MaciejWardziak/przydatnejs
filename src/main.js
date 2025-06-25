const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

// Funkcja do tworzenia elementu listy
function createTodoItem(text, completed = false) {
  const li = document.createElement('li');

  // checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;  // Ustawienie stanu checkboxa
  checkbox.addEventListener('change', () => toggleCompleted(li, checkbox));

  // tekst zadania
  const span = document.createElement('span');
  span.textContent = text;

  // przycisk usuwania
  const removeBtn = createRemoveButton(li);

  // składanie w całość
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(removeBtn);

  return li;
}

// Funkcja do przełączania statusu 'zrobione' / 'nie zrobione'
function toggleCompleted(li, checkbox) {
  li.classList.toggle('completed', checkbox.checked);
  saveTodos(); // Po każdej zmianie stanu zadania zapisujemy listę
}

// Funkcja do tworzenia przycisku usuwania
function createRemoveButton(li) {
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Usuń';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    li.remove();
    saveTodos(); // Po usunięciu zadania zapisujemy listę
  });
  return removeBtn;
}

// Funkcja do zapisywania listy TODO w localStorage
function saveTodos() {
  const todos = [];
  const todoItems = document.querySelectorAll('li');

  todoItems.forEach((li) => {
    const text = li.querySelector('span').textContent;
    const completed = li.querySelector('input').checked;
    todos.push({ text, completed });
  });

  localStorage.setItem('todos', JSON.stringify(todos)); // Zapisujemy listę w localStorage
}

// Funkcja do wczytywania listy TODO z localStorage
function loadTodos() {
  const savedTodos = JSON.parse(localStorage.getItem('todos'));
  
  if (savedTodos) {
    savedTodos.forEach(todo => {
      const todoItem = createTodoItem(todo.text, todo.completed);
      list.appendChild(todoItem);
    });
  }
}

// Główna funkcja do obsługi formularza
function handleFormSubmit(event) {
  event.preventDefault(); // nie przeładowuj strony

  const text = input.value.trim();
  if (text === '') return; // sprawdź, czy tekst nie jest pusty

  const todoItem = createTodoItem(text);
  list.appendChild(todoItem);

  saveTodos(); // Zapisz stan po dodaniu nowego zadania

  input.value = ''; // wyczyść pole
}

// Ładowanie zadań przy starcie
document.addEventListener('DOMContentLoaded', loadTodos);

// Podłączanie nasłuchiwacza zdarzeń do formularza
form.addEventListener('submit', handleFormSubmit);
