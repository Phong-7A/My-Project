const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-btn');

window.addEventListener('load', function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(taskText => addTask(taskText));
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTask(taskText);
        saveTask(taskText);
        taskInput.value = '';
    }
});

clearBtn.addEventListener('click', function() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
});

function addTask(taskText) {
    const li = document.createElement('li');
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        li.style.animation = 'slideOutToRight 0.5s ease-out forwards';
        li.addEventListener('animationend', function() {
            li.remove();
            removeTask(taskText);
        }, { once: true });
    });
    li.appendChild(taskSpan);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

function saveTask(taskText) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}

function removeTask(taskText) {
    let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks = savedTasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(savedTasks));
}