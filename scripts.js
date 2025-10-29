document.addEventListener('DOMContentLoaded', function() {
    createPageStructure();
    loadTasks();
    renderTasks();
    initEventListeners(); 
});

let tasks = [];
let dragStartIndex = null;

function createPageStructure() {   
    const container = document.createElement('div');
    container.className = 'container';
    
    const header = document.createElement('h1');
    header.className ='header';    
    header.textContent = 'ToDo List';
    container.appendChild(header);
    
    const addForm = document.createElement('div'); 
    addForm.className = 'add-task-form';
     
    const taskInput = document.createElement('input');
    taskInput.type ='text';
    taskInput.className = 'task-input'; 
    taskInput.placeholder = 'Введите новую задачу...';
    
    const taskDate = document.createElement('input') ; 
    taskDate.type = 'date'; 
    taskDate.className = 'task-date'; 
    
    const addButton = document.createElement('button');
    addButton.className = 'add-btn';
    addButton.textContent = 'Добавить'; 
    
    addForm.appendChild(taskInput);
    addForm.appendChild(taskDate);
    addForm.appendChild(addButton);
    container.appendChild(addForm);
    
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Поиск задач...';
    
    const filterSelect = document.createElement('select' );
    filterSelect.className = 'filter-select';
    const filterOptions = [
        {value:'all', text: 'Все задачи'},
        {value:'completed',text: 'Выполненные'}, 
        {value: 'active' ,text: 'Активные'}
    ];
    filterOptions.forEach(option => {
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = option.text; 
        filterSelect.appendChild(optElement);
    });
    
    const sortSelect = document.createElement('select');
    sortSelect.className = 'sort-select';
    const sortOptions = [ 
        {value:'default',text:'По умолчанию'},
        {value:'newest',text:'Сначала новые'}, 
        {value:'oldest',text:'Сначала старые' }
    ];
    sortOptions.forEach(option => { 
        const optElement = document.createElement('option');
        optElement.value = option.value;
        optElement.textContent = option.text;
        sortSelect.appendChild(optElement);
    });
    
    controls.appendChild(searchInput); 
    controls.appendChild(filterSelect);
    controls.appendChild(sortSelect);
    container.appendChild(controls);
    
    const tasksList = document.createElement('ul');
    tasksList.className = 'tasks-list';
    container.appendChild(tasksList);
    
    document.body.appendChild(container);
}

function initEventListeners() {
    const addButton = document.querySelector('.add-btn');
    const taskInput = document.querySelector('.task-input');
    const taskDate = document.querySelector('.task-date');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const sortSelect = document.querySelector('.sort-select');
    
    addButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    searchInput.addEventListener('input', renderTasks);
    filterSelect.addEventListener('change', renderTasks);
    sortSelect.addEventListener('change', renderTasks);
    
    const today = new Date().toISOString().split('T')[0];
    taskDate.value = today;
}

function addTask() {
    const taskInput = document.querySelector('.task-input');
    const taskDate = document.querySelector('.task-date');
    const text = taskInput.value.trim();
    const date = taskDate.value;

    if (text === '') {
        alert('Введите текст задачи!');
        return;
    }
    const newTask = {
        id: Date.now(),
        text: text,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
}
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}
function doTaskCompletion(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    } 
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    if (!task) return ; 
    
    const editModal = document.createElement('div');
    editModal.className = 'modal-overlay';
    const editForm = document.createElement('div'); 
    editForm.className = 'modal-content';

    const title = document.createElement('h3');
    title.textContent ='Редактировать задачу'; 
    
    const textLabel = document.createElement('label');
    textLabel.textContent = 'Текст задачи:';
    textLabel.htmlFor = 'edit-text';
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.id = 'edit-text';
    textInput.value = task.text;
    textInput.className = 'modal-input';
    
    const dateLabel = document.createElement('label');
    dateLabel.textContent = 'Дата выполнения:';
    dateLabel.htmlFor = 'edit-date';  
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'edit-date';
    dateInput.value = task.date;
    dateInput.className = 'modal-input';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Сохранить';
    saveButton.className = 'modal-btn save-btn'; 
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Отмена';
    cancelButton.className = 'modal-btn cancel-btn';
    
    saveButton.addEventListener('click', () => {
        const newText = textInput.value.trim();
        const newDate = dateInput.value;
        if (newText ===  '') { 
            alert('Текст задачи не может быть пустым!');
            return;
        }
        task.text = newText; 
        task.date = newDate;
        saveTasks();
        renderTasks();
        document.body.removeChild(editModal);
    });
    
    cancelButton.addEventListener('click', () => {document.body.removeChild(editModal);});
    //миссклик
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            document.body.removeChild(editModal);
        }
    });
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(saveButton);
    
    editForm.appendChild(title);
    editForm.appendChild(textLabel);
    editForm.appendChild(textInput);
    editForm.appendChild(dateLabel);
    editForm.appendChild(dateInput);
    editForm.appendChild(buttonContainer);
    
    editModal.appendChild(editForm);
    document.body.appendChild(editModal);
    
    textInput.focus();
    textInput.select();
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}
function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
function renderTasks() {
    const tasksList = document.querySelector('.tasks-list');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const sortSelect = document.querySelector('.sort-select');
    
    while (tasksList.firstChild) {tasksList.removeChild(tasksList.firstChild);}
    
    let filteredTasks = tasks.filter(task =>{
        const matchesSearch = task.text.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesFilter = filterSelect.value === 'all' || 
            (filterSelect.value === 'completed' && task.completed) ||
            (filterSelect.value === 'active' && !task.completed);
        return matchesSearch && matchesFilter; 
    });
    
    if (sortSelect.value === 'newest') {
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortSelect.value === 'oldest') {
        filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }// default исходный порядок
    
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Задачи не найдены';
        tasksList.appendChild(emptyMessage);
        return;
    }
    filteredTasks.forEach((task, index) => {
        const taskItem = createTaskElement(task, index);
        tasksList.appendChild(taskItem);
    });
}

function createTaskElement(task, index) {
    const taskItem = document.createElement('li'); 
    taskItem.className = 'task-item';
    taskItem.dataset.id = task.id;
    
    if (task.completed){
        taskItem.classList.add('completed');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => doTaskCompletion(task.id));
    
    const taskText = document.createElement('span'); 
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    const taskDateDisplay = document.createElement('span');
    taskDateDisplay.className = 'task-date-display';
    taskDateDisplay.textContent = new Date(task.date).toLocaleDateString('ru-RU');
    
    //------
    const actionsDiv = document.createElement('div'); 
    actionsDiv.className = 'task-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = '\u{270f}';
    editButton.title = 'Редактировать';
    editButton.addEventListener('click', (e) => {editTask(task.id);});
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = '\u{1F5D1}';
    deleteButton.title = 'Удалить';
    deleteButton.addEventListener('click', (e) => {deleteTask(task.id);});
    
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
     
    //
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect.value === 'default') {
        taskItem.draggable = true;
        taskItem.addEventListener('dragstart', handleDragStart);
        taskItem.addEventListener('dragover', handleDragOver); 
        taskItem.addEventListener('drop', handleDrop);
        taskItem.addEventListener('dragend', handleDragEnd); 
        taskItem.addEventListener('dragenter', handleDragEnter);
        taskItem.addEventListener('dragleave', handleDragLeave);
    } else {
        taskItem.draggable = false;
        taskItem.style.cursor = 'default';
    }
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskDateDisplay);
    taskItem.appendChild(actionsDiv);
    return taskItem;
} 
function handleDragStart(e) {
    const sortSelect = document.querySelector('.sort-select' );
    if (sortSelect.value !== 'default'){ return;}
    
    dragStartIndex = Array.from(this.parentNode.children).indexOf(this);
    // console.log(this.parentNode.children);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
}
function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
} 
function handleDragLeave(e) {
    e.preventDefault();
    if (!this.contains(e.relatedTarget)) {this.classList.remove('drag-over'); }
}
function handleDrop(e) {    
    e.preventDefault();
    const dragEndIndex = Array.from(this.parentNode.children).indexOf(this);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (dragStartIndex !== null && dragStartIndex !== dragEndIndex) {
        const draggedTask = tasks.find(task => task.id.toString() === draggedId);
        if (draggedTask) {
            const draggedIndex = tasks.indexOf(draggedTask);
            const movedTask = tasks.splice(draggedIndex, 1)[0];

            const targetTask = tasks.find(task => task.id.toString() === this.dataset.id);
            const targetIndex = tasks.indexOf(targetTask);
            
            tasks.splice(targetIndex, 0, movedTask); 
            saveTasks();
            renderTasks();
        }
    }
}
function handleDragEnd() {
    this.classList.remove('dragging');
    dragStartIndex = null;
    const dragOverElements = document.querySelectorAll('.drag-over');
    dragOverElements.forEach(el => el.classList.remove('drag-over'));
}