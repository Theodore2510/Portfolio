document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('.task-filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initialize the app
    renderTasks();
    updateTaskCount();

    // Add new task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
            renderTasks();
            updateTaskCount();
        }
    });

    // Handle task actions (complete, edit, delete)
    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.id);

        if (e.target.classList.contains('task-checkbox')) {
            toggleTask(taskId);
        } else if (e.target.classList.contains('btn-edit')) {
            editTask(taskId);
        } else if (e.target.classList.contains('btn-delete')) {
            deleteTask(taskId);
        }
    });

    // Clear completed tasks
    clearCompleted.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });

    // Task management functions
    function addTask(text) {
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(task);
        saveTasks();
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateTaskCount();
        }
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
            }
        }
    }

    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks();
            renderTasks();
            updateTaskCount();
        }
    }

    function renderTasks() {
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

        taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="btn btn-warning btn-sm btn-action btn-edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-action btn-delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </li>
        `).join('');
    }

    function updateTaskCount() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});