const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

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
      { label: "Tümünü Sil" },
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
  let addWindow = new BrowserWindow({
    width: 550,
    height: 250,
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
