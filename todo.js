const todos = [];
//Get DOM Element
const input = document.getElementById('taskInput');
const submit = document.getElementById('submit');
const list = document.getElementById('taskList');
//fetch saved task from local storage
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(...saved);
  renderTodos();
});

submit.addEventListener('click', addTodo);

function addTodo() {
  const text = input.value.trim();
  if (!text) return alert('Please write something');

  //check duplicate tasks
  const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    alert('This task already exists!');
    return;
  }
//assign unique ID to a task
  todos.push({ 
    id: Date.now(), 
    text,
    completed: false    
  });

  input.value = '';      
  updateStorage();       
  renderTodos();         
}
//display all tasks
function renderTodos() {
  list.innerHTML = ''; 

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;


    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed || false;
    checkbox.onchange = () => toggleComplete(todo.id);
    li.appendChild(checkbox);

    
    const span = document.createElement('span');
    span.innerText = todo.text;
    if (todo.completed) span.style.textDecoration = 'line-through';
    li.appendChild(span);

    
    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => enterEditMode(li, todo);
    li.appendChild(editBtn);

    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}


function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    updateStorage();
    renderTodos();
  }
}


function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    updateStorage();
    renderTodos();
  }
}


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

    //check duplicate while editing
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

//save current tasks to local storage
function updateStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
