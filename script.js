document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    if (title === '') {
        alert('Task title is required');
        return;
    }

    const task = {
        id: Date.now().toString(),
        title,
        description,
        dueDate,
        priority,
        completed: false
    };

    saveTask(task);
    appendTask(task);
    clearInputs();
}

function saveTask(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach(task => appendTask(task));
}

function appendTask(task) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    if (task.completed) {
        taskItem.classList.add('completed');
    }
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <div>
            <strong class="task-title">${task.title}</strong> - ${task.priority}
            <p class="task-desc">${task.description}</p>
            <small class="task-date">${task.dueDate}</small>
        </div>
        <div class="task-actions">
            <button onclick="editTask('${task.id}')">Edit</button>
            <button onclick="deleteTask('${task.id}')">Delete</button>
            <button onclick="toggleComplete('${task.id}')">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </div>
    `;

    taskList.appendChild(taskItem);
}

function clearInputs() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-priority').value = 'Low';
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    document.querySelector(`[data-id='${taskId}']`).remove();
}

function editTask(taskId) {
    const taskItem = document.querySelector(`[data-id='${taskId}']`);
    const task = JSON.parse(localStorage.getItem('tasks')).find(task => task.id === taskId);

    taskItem.classList.add('editing');

    taskItem.innerHTML = `
        <div>
            <input type="text" value="${task.title}" class="edit-title">
            <textarea class="edit-desc">${task.description}</textarea>
            <input type="date" value="${task.dueDate}" class="edit-date">
            <select class="edit-priority">
                <option value="Low" ${task.priority === 'Low' ? 'selected' : ''}>Low Priority</option>
                <option value="Medium" ${task.priority === 'Medium' ? 'selected' : ''}>Medium Priority</option>
                <option value="High" ${task.priority === 'High' ? 'selected' : ''}>High Priority</option>
            </select>
        </div>
        <div class="task-actions">
            <button onclick="saveEditTask('${task.id}')">Save</button>
            <button onclick="cancelEditTask('${task.id}')">Cancel</button>
        </div>
    `;
}

function saveEditTask(taskId) {
    const taskItem = document.querySelector(`[data-id='${taskId}']`);
    const title = taskItem.querySelector('.edit-title').value;
    const description = taskItem.querySelector('.edit-desc').value;
    const dueDate = taskItem.querySelector('.edit-date').value;
    const priority = taskItem.querySelector('.edit-priority').value;

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => task.id === taskId ? { ...task, title, description, dueDate, priority } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskItem.classList.remove('editing');
    taskItem.querySelector('.task-title').innerText = title;
    taskItem.querySelector('.task-desc').innerText = description;
    taskItem.querySelector('.task-date').innerText = dueDate;
    taskItem.querySelector('.task-priority').innerText = priority;
    taskItem.innerHTML = `
        <div>
            <strong class="task-title">${title}</strong> - ${priority}
            <p class="task-desc">${description}</p>
            <small class="task-date">${dueDate}</small>
        </div>
        <div class="task-actions">
            <button onclick="editTask('${taskId}')">Edit</button>
            <button onclick="deleteTask('${taskId}')">Delete</button>
            <button onclick="toggleComplete('${taskId}')">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </div>
    `;
}

function cancelEditTask(taskId) {
    const task = JSON.parse(localStorage.getItem('tasks')).find(task => task.id === taskId);
    const taskItem = document.querySelector(`[data-id='${taskId}']`);

    taskItem.classList.remove('editing');
    taskItem.innerHTML = `
        <div>
            <strong class="task-title">${task.title}</strong> - ${task.priority}
            <p class="task-desc">${task.description}</p>
            <small class="task-date">${task.dueDate}</small>
        </div>
        <div class="task-actions">
            <button onclick="editTask('${task.id}')">Edit</button>
            <button onclick="deleteTask('${task.id}')">Delete</button>
            <button onclick="toggleComplete('${task.id}')">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </div>
    `;
}

function toggleComplete(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskItem = document.querySelector(`[data-id='${taskId}']`);
    taskItem.classList.toggle('completed');
    taskItem.querySelector('button[onclick^="toggleComplete"]').innerText = taskItem.classList.contains('completed') ? 'Uncomplete' : 'Complete';
}
