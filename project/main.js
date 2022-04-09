const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');

function createWindow() {
  const winState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 1000,
  });
  let mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    // x: winState.x,
    // y: winState.y,
    x: 1328,
    y: 0,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  winState.manage(mainWindow);

  mainWindow.loadFile('./renderer/main.html');
  mainWindow.webContents.openDevTools();

  // this is not even done in forge implementaiton?
  // mainWindow.on("closed", () => {
  //   mainWindow = null;
  // })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
