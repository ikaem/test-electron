// not really sure if i should be polluting global scope here
// let offscreenWindow;

const { BrowserWindow } = require('electron/main');

const readUrlItem = (url, callback) => {
  // create offscreen window
  // this could be a reusable function
  const offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  offscreenWindow.loadURL(url);

  // wait to load
  offscreenWindow.webContents.on('did-finish-load', async (e) => {
    console.log('in here');
    const title = offscreenWindow.getTitle();
    const screenshot = await offscreenWindow.capturePage();
    const screenshotDataUrl = screenshot.toDataURL();

    callback({
      title,
      screenshot: screenshot.toDataURL(),
      url,
    });

    // cleanup
    offscreenWindow.close();
  });
};

module.exports = readUrlItem;
