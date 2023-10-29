//DATOS
class Tareas {
  constructor(id, title, description, priority, completed, tag, dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.completed = completed;
    this.tag = tag;
    this.dueDate = dueDate;
  }
}
// Funcion para mapear los datos de la API
function mapAPIToTasks(data) {
  return data.map(item => {
    return new Tareas(
      item.id,
      item.title,
      item.description,
      item.priority,
      item.completed,
      item.tag,
      new Date(item.dueDate)
    );
  });
}
// Funcion que lee los datos de la API
function ReadAPIToTask(data) {
  return new Tareas(
    data.id,
    data.title,
    data.description,
    data.completed,
    data.priority,
    data.tag,
    new Date(data.dueDate),
  );
}

// Funcion que muestra los datos en la tabla
function displayTasksView(tasks) {

  clearTable();

  showLoadingMessage();

  if (tasks.length === 0) {

    showNotFoundMessage();

  } else {

    hideMessage();

    displayTasksTable(tasks);
  }

}
// Funcion que muestra mensaje de carga
function displayClearTasksView() {
  clearTable();

  showInitialMessage();
}



// Agregar Datos a la Tabla

function displayTasksTable(tasks) {
  const tableBody = document.getElementById("data-table-body");

  tasks.forEach(task => {

    const row = document.createElement("tr");

    row.innerHTML += `
        <td><input type="checkbox" data-id="${task.id}" /></td>
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td class="description">${task.description}</td>
        <td>${task.priority}</td>
        <td>${task.completed}</td>
        <td>${task.tag}</td>
        <td>${formatDate(task.dueDate)}</td>
        <td>
          <button class="deletetask-button" data-id="${task.id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
        <td>
          <button id="edittask-button" class="edittask-button" data-id="${task.id}">
            <i class="fa fa-edit"></i>
          </button>
        </td>
      `;
    tableBody.appendChild(row);
  });

  initDeleteTasksButtonHandler();
  initUpdateTasksButtonHandler();
}
// Funcion que muestra los datos en el modal
function MostrarTareasToModal(task) {
  const upid = document.getElementById("update-id");
  const uptitle = document.getElementById("update-tarea");
  const updescription = document.getElementById("update-description");
  const uppriority = document.getElementById("update-priority");
  const upcompleted = document.getElementById("update-completed");
  const uptag = document.getElementById("update-tag");
  const updueDate = document.getElementById("update-dueDate");

  //console.log(task);
  //Insertar datos en el modal
  upid.value = task.id;
  uptitle.value = task.title;
  updescription.value = task.description;
  uppriority.value = task.priority.toString();
  upcompleted.value = task.completed.toString();
  uptag.value = task.tag;
  updueDate.value = formatDateToISO(task.dueDate);
  console.log(task);

}

// Funcion que limpia la tabla
function clearTable() {
  const tableBody = document.getElementById('data-table-body');

  tableBody.innerHTML = '';
}


// Funcion que muestra mensaje de carga
function showLoadingMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'Cargando...';

  message.style.display = 'block';
}


// Funcion que muestra mensaje de carga
function showInitialMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se ha realizado una busqueda de Tareas.';

  message.style.display = 'block';
  message.style.textAlign = 'center';
}


// Funcion que muestra mensaje de que no se encuentraron datos
function showNotFoundMessage() {
  const message = document.getElementById('message');

  message.innerHTML = 'No se encontraron Tareas.';

  message.style.display = 'block';
  message.style.textAlign = 'center';
}


// Funcion que oculta mensaje
function hideMessage() {
  const message = document.getElementById('message');

  message.style.display = 'none';
}

//FILTROS (VIEW)

function initFilterButtonsHandler() {

  document.getElementById('filter-form').addEventListener('submit', event => {
    event.preventDefault();
    searchTasks();
  });

  document.getElementById('reset-filters').addEventListener('click', () => clearTasks());

}
// Funcion que limpia los filtros
function clearTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');

  displayClearTasksView();
}
// Funcion que resetea los filtros
function resetTasks() {
  document.querySelector('select.filter-field').selectedIndex = 0;
  document.querySelectorAll('input.filter-field').forEach(input => input.value = '');
  searchTasks();
}
// Funcion que busca las tareas
function searchTasks() {
  const title = document.getElementById('title-filtro').value;
  const priority = document.getElementById('priority-filtro').value;
  const dueDate = document.getElementById('fecha-filtro').value;

  getTasksData(title, priority, dueDate);
}

// Boton Agregar y Actualizar (VIEW)

function initAddTasksButtonsHandler() {

  document.getElementById('addTask').addEventListener('click', () => {
    openaddTaskModal()
  });

  document.getElementById('modal-background').addEventListener('click', () => {
    closeaddTaskModal();
    closeupdateTaskModal();
  });

  document.getElementById('task-form').addEventListener('submit', event => {
    event.preventDefault();
    processSubmitTask();
  });

  document.getElementById('updatetask-form').addEventListener('submit', event => {
    event.preventDefault();
    processUpdateTask();
  });
}

// Boton Abrir/Cerrar Modal (VIEW)
function openaddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modalT').style.display = 'block';
}

function closeaddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modalT').style.display = 'none';
}

// Boton Abrir/Cerrar ModalUpdate (VIEW)
function openupdateTaskModal(taskId) {
  getTaskData(taskId);

  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('updatemodalT').style.display = 'block';
}

function closeupdateTaskModal() {
  document.getElementById('updatetask-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('updatemodalT').style.display = 'none';
}

//Procesar Datos (CONTROLLER)
function processSubmitTask() {
  const title = document.getElementById('tarea').value;
  const description = document.getElementById('description').value;
  const priority = document.getElementById('priority').value;
  const completed = document.getElementById('completed').value;
  const tag = document.getElementById('tag').value;
  const dueDate = document.getElementById('dueDate').value;

  const taskToSave = new Tareas(
    null,
    title,
    description,
    priority,
    completed,
    tag,
    dueDate
  );

  createTask(taskToSave);
}
//Procesar Datos Actualizar(CONTROLLER)
function processUpdateTask() {
  const id = document.getElementById('update-id').value;
  const title = document.getElementById('update-tarea').value;
  const description = document.getElementById('update-description').value;
  const priority = document.getElementById('update-priority').value;
  const completed = document.getElementById('update-completed').value;
  const tag = document.getElementById('update-tag').value;
  const dueDate = document.getElementById('update-dueDate').value;

  const taskToSave = new Tareas(
    id,
    title,
    description,
    priority,
    completed,
    tag,
    dueDate
  );

  PUTTask(taskToSave);
}

function initDeleteTasksButtonHandler() {

  document.querySelectorAll('.deletetask-button').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-id');
      deleteTask(taskId);

    });

  });

}

function initUpdateTasksButtonHandler() {

  document.querySelectorAll('.edittask-button').forEach(button => {

    button.addEventListener('click', () => {

      const taskId = button.getAttribute('data-id');
      openupdateTaskModal(taskId);

    });

  });

}

// API (MODEL)
function getTasksData(title, priority, dueDate) {

  const url = buildGetTasksDataUrl(title, priority, dueDate);
  console.log(url);

  fetchAPI(url, 'GET')
    .then(data => {
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function getTaskData(taskId) {
  fetchAPI(`${apiURL}/users/219220049/tasks/${taskId}`, 'GET')
    .then(data => {
      const task = ReadAPIToTask(data);
      console.log(task);
      MostrarTareasToModal(task);
    });
}

function createTask(task) {

  fetchAPI(`${apiURL}/users/219220049/tasks`, 'POST', task)
    .then(task => {
      closeaddTaskModal();
      resetTasks();
      window.alert(`Tarea ${task.id} creada correctamente.`);
    });

}

function PUTTask(task) {

  fetchAPI(`${apiURL}/users/219220049/tasks/${task.id}`, 'PUT', task)
    .then(task => {
      closeupdateTaskModal();
      getTasksData();
      window.alert(`Tarea ${task.id} actualizada correctamente.`);
    });

}

function deleteTask(taskId) {

  const confirm = window.confirm(`¿Estás seguro de que deseas eliminar la tarea ${taskId}?`);

  if (confirm) {

    fetchAPI(`${apiURL}/users/219220049/tasks/${taskId}`, 'DELETE')
      .then(() => {
        resetTasks();
        window.alert("Tarea eliminada.");
      });

  }
}
// Funcion que construye la URL
function buildGetTasksDataUrl(title, priority, dueDate) {

  const url = new URL(`${apiURL}/users/219220049/tasks`);
  console.log(apiURL);

  if (title) {
    url.searchParams.append('title', title);
  }

  if (priority) {
    url.searchParams.append('priority', priority);
  }

  if (dueDate) {
    url.searchParams.append('dueDate', dueDate);
  }

  return url;
}

// Inicializacion

initAddTasksButtonsHandler();

initFilterButtonsHandler();

getTasksData();
