const electron = require("electron");
const { ipcRenderer } = electron;

checkTodoCount();

const todoValue = document.querySelector("#todoValue");

todoValue.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    ipcRenderer.send("newTodo:save", {
      ref: "main",
      todoValue: e.target.value,
    });
    todoValue.value = "";
  }
});

document.querySelector("#addBtn").addEventListener("click", () => {
  ipcRenderer.send("newTodo:save", { ref: "main", todoValue: todoValue.value });
  todoValue.value = "";
});

document.querySelector("#closeBtn").addEventListener("click", () => {
  if (confirm("Çıkmak İstiyor musunuz?")) {
    ipcRenderer.send("todo:close");
  }
});

ipcRenderer.on("initApp", (e, list) => {
  list.forEach((item) => {
    drawRow(item);
  });
});

ipcRenderer.on("todo:addItem", (e, todo) => {
  drawRow(todo);
});

ipcRenderer.on("todo:deleteAll", () => {
  document.querySelector(".todo-container").innerHTML = "";
  checkTodoCount();
});

function checkTodoCount() {
  const container = document.querySelector(".todo-container");
  const alertContainer = document.querySelector(".alert-container");
  const length = container.children.length;
  document.querySelector(".total-count-container").innerText = length;

  if (length !== 0) {
    alertContainer.style.display = "none";
  } else {
    alertContainer.style.display = "block";
  }
}

function drawRow(todo) {
  const container = document.querySelector(".todo-container");

  const row = document.createElement("div");
  row.className = "row";

  const col = document.createElement("div");
  col.className =
    "todo-item p-2 mb-3 text-light bg-dark col-md-12 shadow card d-flex justify-content-center flex-row align-items-center";

  const p = document.createElement("p");
  p.className = "m-0 w-100";
  p.innerText = todo.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-outline-danger flex-shrink-1";
  deleteBtn.innerText = "X";
  deleteBtn.addEventListener("click", (e) => {
    if (confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
      e.target.parentNode.parentNode.remove();
      checkTodoCount();
    }
  });

  col.appendChild(p);
  col.appendChild(deleteBtn);
  row.appendChild(col);
  container.appendChild(row);
  checkTodoCount();
}
