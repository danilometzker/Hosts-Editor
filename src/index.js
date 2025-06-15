process.env.NODE_OPTIONS = "--no-deprecation";

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const electronSquirrelStartup = require("electron-squirrel-startup");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (electronSquirrelStartup) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    const preloadPath = path.join(__dirname, "preload.js");

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, "icon.ico"),
        transparent: false,
        frame: false,
        focusable: true, //THIS IS THE KEY
        closable: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: preloadPath,
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    if (app.isPackaged) {
        const startUrl = path.join(__dirname, "/build/renderer/index.html");
        mainWindow.loadFile(startUrl);
        mainWindow.webContents.closeDevTools();
    } else {
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    mainWindow.setTitle("");
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);

    mainWindow.webContents.on("context-menu", (e) => {
        e.preventDefault(); // Previne o menu de contexto padrão
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// IPC handlers
ipcMain.handle("get-system-info", async () => {
    return {
        platform: process.platform,
        version: process.version,
    };
});

ipcMain.handle("minimize-app", async () => {
    mainWindow.minimize();
});

ipcMain.handle("close-app", async () => {
    app.exit(0);
});

ipcMain.on("windowMoving", (e, { mouseX, mouseY }) => {
    const { x, y } = screen.getCursorScreenPoint();
    mainWindow.setPosition(x - mouseX, y - mouseY);
});
