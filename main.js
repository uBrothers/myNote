const { app, BrowserWindow, Menu } = require("electron");
const { shell } = require("electron");
const { dialog } = require("electron");
const fs = require("fs");

require("electron-reload")(__dirname);

let win;
var file;
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "New",
        accelerator: 'CmdOrCtrl+N',
        click(){
          win.loadFile("index.html");
          const saveFileItem = menu.getMenuItemById("save-file");
          saveFileItem.enabled = false;
        }
      },
      {
        label: "Open File",
        accelerator: "Ctrl+O",
        click: async () => {
          const { filePaths } = await dialog.showOpenDialog({
            properties: ["openFile"],
          });
          file = filePaths[0];
          const contents = fs.readFileSync(file, "utf-8");
          win.webContents.send("fileOpened", {
            contents,
            filePath: file,
          });
          const saveFileItem = menu.getMenuItemById("save-file");
          saveFileItem.enabled = true;
        }
      },
      {
        id: "save-file",
        enabled: false,
        accelerator: "Ctrl+S",
        label: "Save",
        click: async () => {
          win.webContents.send("saveFile");
        }
      },
      {
        id: "save-new-file",
        accelerator: "Ctrl+Shift+S",
        label: "Save As",
        click: async () => {
          const openFile = await dialog.showSaveDialog();
          file = openFile.filePath
          win.webContents.send("saveNewFile", {
            filePath: file,
          });
          const saveFileItem = menu.getMenuItemById("save-file");
          saveFileItem.enabled = true;
        }
      },
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" }
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Larger",
        role: "zoomin"
      },
      {
        label: "Smaller",
        role: "zoomout"
      },
      {
        label: "Reset size",
        role: "resetzoom"
      },
      { type: "separator" }
    ]
  },
  {
    role: "window",
    submenu: [
      {
        lebel: "Full/Small",
        role: "togglefullscreen"
      },
      { role: "Minimize" },
      { role: "close" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click() {
          shell.openExternal("https://github.com/uBrothers/myNote");
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("index.html");


  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

app.whenReady().then(createWindow);
