// Array to store tasks
const todos = [];

// Get DOM elements
const input = document.getElementById('taskInput');
const submit = document.getElementById('submit');
const list = document.getElementById('taskList');

// Load saved tasks from localStorage when page loads
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(...saved);
  renderTodos();
});

// Handle submit button click
submit.addEventListener('click', addTodo);

// Add a new task
function addTodo() {
  const text = input.value.trim();
  if (!text) return alert('Please write something');

  // === DUPLICATE CHECK ===
  const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    alert('This task already exists!');
    return;
  }

  // Add task with unique ID
  todos.push({ 
    id: Date.now(), 
    text,
    completed: false     // Added for completed feature
  });

  input.value = '';      
  updateStorage();       
  renderTodos();         
}

// Display all tasks in the list
function renderTodos() {
  list.innerHTML = ''; 

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;

    // Checkbox for completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed || false;
    checkbox.onchange = () => toggleComplete(todo.id);
    li.appendChild(checkbox);

    // Show task text
    const span = document.createElement('span');
    span.innerText = todo.text;
    if (todo.completed) span.style.textDecoration = 'line-through';
    li.appendChild(span);

    // Add Edit button
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => enterEditMode(li, todo);
    li.appendChild(editBtn);

    // Add Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

// Toggle completed status
function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    updateStorage();
    renderTodos();
  }
}

// Delete a task by ID
function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    updateStorage();
    renderTodos();
  }
}

// Switch task to edit mode
function enterEditMode(li, todo) {
  li.innerHTML = ''; 

  const inputEdit = document.createElement('input');
  inputEdit.value = todo.text;
  li.appendChild(inputEdit);

  const saveBtn = document.createElement('button');
  saveBtn.innerText = 'Save';
  saveBtn.onclick = () => {
    const newText = inputEdit.value.trim();
    if (!newText) return alert('Task cannot be empty');

    // Duplicate check while editing
    const isDuplicate = todos.some(t => 
      t.id !== todo.id && t.text.toLowerCase() === newText.toLowerCase()
    );

    if (isDuplicate) {
      alert('This task already exists!');
      return;
    }

    todo.text = newText;
    updateStorage();
    renderTodos();
  };
  li.appendChild(saveBtn);
}

// Save current tasks to localStorage
function updateStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}