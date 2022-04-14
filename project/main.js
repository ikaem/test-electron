const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const { ipcMain } = require('electron');
const readUrlItem = require('../services/read-url-item/read-url-item');
const { applyAppMenu } = require('./menu');
const { autoUpdate } = require('./updater');

function createWindow() {
  // take 4 seconds before checkign for updates
  setTimeout(() => {
    autoUpdate();
  }, 4000);

  const winState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 1000,
  });

  // is this going to be garbage collected? unneccesarily
  const mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    // x: winState.x,
    // y: winState.y,
    x: 1328,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
      // just for the sake of the tutorial
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  applyAppMenu(mainWindow);

  winState.manage(mainWindow);

  mainWindow.loadFile('./renderer/main.html');
  mainWindow.webContents.openDevTools();

  // this is not even done in forge implementaiton?
  // mainWindow.on("closed", () => {
  //   mainWindow = null;
  // })

  // but this could help with keeping the reference somehow
  return mainWindow;
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ipc main listeners
ipcMain.on('new-item', async (e, itemUrl) => {
  // or e.reply would work too

  // await new Promise(resolve => {
  //   setTimeout(() =>{
  //     resolve(null)
  //   }, 2000)
  // })
  // await new Promise((r) => setTimeout(r, 2000));
  // console.log({ itemUrl });
  // e.sender.send('new-item-success', 'New item from main process');

  readUrlItem(itemUrl, (item) => {
    e.sender.send('new-item-success', item);
  });
});
