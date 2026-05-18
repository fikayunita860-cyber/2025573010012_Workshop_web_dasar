const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");
const taskCounter = document.getElementById("taskCounter");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

renderTasks();

// Tambah tugas
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {

  const text = taskInput.value.trim();
  const priority = priorityInput.value;

  // Validasi
  if (text === "") {
    errorMessage.textContent = "Tugas tidak boleh kosong!";
    return;
  }

  if (text.length < 3) {
    errorMessage.textContent = "Minimal 3 karakter!";
    return;
  }

  if (text.length > 100) {
    errorMessage.textContent = "Maksimal 100 karakter!";
    return;
  }

  errorMessage.textContent = "";

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
    priority: priority
  };

  tasks.push(task);

  saveTasks();

  taskInput.value = "";

  renderTasks();
}

// Render tugas
function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.setAttribute("draggable", true);

    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-left">

        <input type="checkbox" ${task.completed ? "checked" : ""}>

        <span class="task-text">
          ${task.text}
        </span>

        <span class="priority ${task.priority.toLowerCase()}">
          ${task.priority}
        </span>

      </div>

      <button class="delete-btn">
        Hapus
      </button>
    `;

    // Checkbox selesai
    const checkbox = li.querySelector("input");

    checkbox.addEventListener("change", function () {

      task.completed = checkbox.checked;

      saveTasks();

      renderTasks();

    });

    // Hapus tugas
    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {

      tasks = tasks.filter(t => t.id !== task.id);

      saveTasks();

      renderTasks();

    });

    // Edit tugas
    const taskText = li.querySelector(".task-text");

    taskText.addEventListener("dblclick", function () {

      const input = document.createElement("input");

      input.type = "text";

      input.value = task.text;

      input.className = "edit-input";

      taskText.replaceWith(input);

      input.focus();

      function saveEdit() {

        const newText = input.value.trim();

        if (newText.length < 3 || newText.length > 100) {
          alert("Teks harus 3 sampai 100 karakter!");
          renderTasks();
          return;
        }

        task.text = newText;

        saveTasks();

        renderTasks();
      }

      input.addEventListener("blur", saveEdit);

      input.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
          saveEdit();
        }

      });

    });

    // Drag Start
    li.addEventListener("dragstart", function () {
      li.classList.add("dragging");
    });

    // Drag End
    li.addEventListener("dragend", function () {

      li.classList.remove("dragging");

      const items = [...taskList.querySelectorAll(".task-item")];

      const newTasks = [];

      items.forEach(item => {

        const id = Number(item.dataset.id);

        const taskData = tasks.find(t => t.id === id);

        newTasks.push(taskData);

      });

      tasks = newTasks;

      saveTasks();

    });

    taskList.appendChild(li);

  });

  updateCounter();

}

// Drag Over
taskList.addEventListener("dragover", function (e) {

  e.preventDefault();

  const draggingItem = document.querySelector(".dragging");

  const items = [
    ...taskList.querySelectorAll(".task-item:not(.dragging)")
  ];

  const nextItem = items.find(item => {

    return e.clientY <= item.offsetTop + item.offsetHeight / 2;

  });

  taskList.insertBefore(draggingItem, nextItem);

});

// Counter
function updateCounter() {

  const remainingTasks = tasks.filter(task => !task.completed).length;

  taskCounter.textContent = `${remainingTasks} tugas tersisa`;

}

// Hapus semua selesai
clearCompleted.addEventListener("click", function () {

  tasks = tasks.filter(task => !task.completed);

  saveTasks();

  renderTasks();

});

// Filter
filterButtons.forEach(button => {

  button.addEventListener("click", function () {

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();

  });

});

// Simpan localStorage
function saveTasks() {

  localStorage.setItem("tasks", JSON.stringify(tasks));

}