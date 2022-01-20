const electron = require("electron");
const url = require("url");
const path = require("path");
const { addDB, deleteDB, getListDB } = require("./db.js");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    frame: true,
  });

  mainWindow.setResizable(false);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "pages/mainWindow.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("close", () => {
    app.quit();
  });

  ipcMain.on("todo:close", () => {
    app.quit();
  });

  ipcMain.on("newTodo:close", () => {
    addWindow.close();
    addWindow = null;
  });

  ipcMain.on("newTodo:save", (err, data) => {
    if (data) {
      const todo = addDB(data.todoValue);
      mainWindow.webContents.send("todo:addItem", todo);

      if (data.ref === "new") {
        addWindow.close();
        addWindow = null;
      }
    }
  });

  mainWindow.webContents.once("dom-ready", () => {
    const list = getListDB();
    mainWindow.webContents.send("initApp", list);
  });

  ipcMain.on("remove:todo", (e, id) => {
    deleteDB(id);
  });
});

const mainMenuTemplate = [
  {
    label: "Dosya",
    submenu: [
      {
        label: "Yeni TODO Ekle",
        click() {
          createWindow();
        },
      },
      {
        label: "Tümünü Sil",
        click() {
          // todoList.splice(0, todoList.length);
          // mainWindow.webContents.send("todo:deleteAll");
        },
      },
      {
        label: "Çıkış",
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
        role: "quit",
      },
    ],
  },
];

if (process.platform === "win32") {
  mainMenuTemplate.unshift({
    label: app.getName(),
    role: "TODO",
  });
}

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Geliştirici Araçları",
    submenu: [
      {
        label: "Geliştirici Araçları",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      { label: "Yenile", role: "reload" },
    ],
  });
}

function createWindow() {
  addWindow = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    width: 500,
    height: 200,
    title: "Yeni Bir Pencere",
    frame: false,
  });

  addWindow.setResizable(false);

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "pages/newTodo.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  addWindow.on("close", () => {
    addWindow = null;
  });
}
