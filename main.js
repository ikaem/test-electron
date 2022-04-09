// Modules
const { ipcRenderer } = require('electron');
const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const { contextMenu } = require('./contextMenu');
const mainMenu = require('./mainMenu');
const { trayMenu } = require('./trayMenu');
const fs = require('fs');
const { resolve, join } = require('path');
const {
  app,
  BrowserWindow,
  webContents,
  session,
  dialog,
  globalShortcut,
  Menu,
  MenuItem,
  Tray,
  screen,
  ipcMain,
} = electron;

console.log('is ready?', app.isReady()); // false
// const bcrypt = require("bcrypt");
// const colors = require("colors");

// console.log(colors.rainbow("hello world"))
// bcrypt.hash("string", 10, (err, hash) => console.log({hash}) )

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let secondaryWindow;
let tray;

app.disableHardwareAcceleration();

function createTray() {
  tray = new Tray('./trayTemplate@2x.png');
  tray.setToolTip('My app');
  tray.on('click', (e) => {
    if (e.shiftKey) app.quit();
    else {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
  tray.setContextMenu(trayMenu);
}

// Create a new BrowserWindow when `app` is ready
function createWindow() {
  // console.log('what');

  // askFruit().then((result) => console.log('answer', result));

  // this is not persisten sesion
  // const customSes = session.fromPartition("persist:part1")
  // const customSes = session.fromPartition("persist:part1")
  const primaryDisplay = screen.getPrimaryDisplay();

  const winState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 1000,
  });

  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    // x: winState.x,
    x: 1328,
    y: 0,
    // x: winState.x,
    // y: winState.y,
    // x: primaryDisplay.bounds.x,
    // y: primaryDisplay.bounds.y,
    // width: primaryDisplay.size.width / 2,
    // height: primaryDisplay.size.height,
    minWidth: 600,
    // frame: false,
    // titleBarStyle: 'hidden',
    // this is to illustrate tecqhique with offscreen rendering  - we want to hide the window too, not just the content that are hidden by defualt becuase web contnets of the window are in a different threead
    // show: false,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      preload: resolve(__dirname, 'preload.js'),
      nodeIntegration: true,
      // offscreen: true,
      // this is disabled by defualt
      // enableRemoteModule: true,
    },
    // show: false,
    // backgroundColor: "#66CD00",
  });
  const wc = mainWindow.webContents;
  const ses = mainWindow.webContents.session;

  console.log({ ses });
  /* 
  { ses: Session {} }
  
  */

  // secondaryWindow = new BrowserWindow({
  //   width: 600,
  //   height: 300,
  //   // webPreferences: {
  //     // --- !! IMPORTANT !! ---
  //     // Disable 'contextIsolation' to allow 'nodeIntegration'
  //     // 'contextIsolation' defaults to "true" as from Electron v12
  //     // contextIsolation: false,
  //     // nodeIntegration: true,
  //   // },
  //   // parent: mainWindow,
  //   // modal: true,
  //   // show: false,
  //   // show: false,
  //   // backgroundColor: "#66CD00",
  // });

  // Load index.html into the new BrowserWindow
  // mainWindow.loadURL('https://github.com');
  mainWindow.loadFile('index.html');
  // this is in case we are rendering offscreen
  // mainWindow.loadURL('https://google.com');

  mainWindow.webContents.on('did-finish-load', (e) => {
    console.log('main window title', mainWindow.getTitle());

    // this is to illustrate tecqhique with offscreen rendering  - we want to close the window when it is finished loading
    // mainWindow.close();
    // mainWindow = null;
  });

  mainWindow.webContents.on('paint', (e, dirty, image) => {
    const screenshot = image.toPNG();
    const filepath = join(
      app.getPath('desktop'),
      `screenshot.${Math.random()}.png`
    );

    fs.writeFile(filepath, screenshot, () => {
      console.log('what');
    });
  });

  wc.on('media-started-playing', () => {
    console.log('media started');
  });

  wc.on('media-paused', () => {
    console.log('media paused');
  });

  wc.on('context-menu', (e, params) => {
    console.log(
      `Context menu opened on: ${params.mediaType} at x: ${params.x}, and y: ${params.y}`
    );

    console.log(`User selected text: ${params.selectionText}`);
    console.log(`User can copy text: ${params.editFlags.canCopy}`);

    const selectedText = params.selectionText;

    if (selectedText) wc.executeJavaScript(`alert("${selectedText}")`);
  });

  // mainWindow.loadURL('https://httpbin.org/basic-auth/user/passwd');

  // wc.on("login", (e, request, authInfo, callback) => {

  //   console.log("logging in", callback)
  //   console.log("e", e)
  //   console.log("request", request)
  //   console.log("authInfo", authInfo)

  //   // now we go with the login with callback
  //   callback("user", "passwd")

  // } )

  // wc.on("did-navigate", (e, url, statusCode, message) => {
  //   console.log("event", e)
  //   console.log("event", url)
  //   console.log("event", statusCode)
  //   console.log("event", message)
  // })

  // secondaryWindow.loadFile('secondary.html');

  winState.manage(mainWindow);

  // setTimeout(() => {
  //   secondaryWindow.show();
  //   setTimeout(() => {
  //     // secondaryWindow.hide();
  //     secondaryWindow.close();
  //   }, 1000);
  // }, 1000);

  // mainWindow.loadURL("https://google.com");

  // mainWindow.once("ready-to-show", mainWindow.show )

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // console.log("here", webContents.getAllWebContents())

  // wc.on('did-finish-load', () => {
  //   console.log('all content ready');
  // });

  // wc.on('dom-ready', () => {
  //   console.log('dom ready');
  // });

  // wc.on('new-window', (event, url) => {
  //   event.preventDefault();
  //   console.log('this is the event', event);
  //   console.log('this is the url', url);
  // });

  // wc.on('before-input-event', (event, input) => {
  //   console.log('this is event', event);
  //   console.log('this is input', input);
  //   console.log('this is input key', input.key);
  //   console.log('this is input type', input.type);
  // });

  mainWindow.on('focus', () => console.log('main wondow focused'));

  // console.log(BrowserWindow.getAllWindows());

  // secondaryWindow.on("closed", () => {
  //   mainWindow.maximize()
  // })

  // Listen for window being closed
  mainWindow.on('closed', () => {
    // debugger;
    // this is to illustrate tecqhique with offscreen rendering  - we want to close the window automatically when it is finished loading, not manually when close d event is triggered
    mainWindow = null;
  });

  // secondaryWindow.on('closed', () => {
  //   // debugger;
  //   secondaryWindow = null;
  // });

  // secondaryWindow = new BrowserWindow({
  //   width: 600,
  //   height: 300,
  //   webPreferences: {
  //     partition: 'persist:part1',
  //     // session: customSes,
  //     // --- !! IMPORTANT !! ---
  //     // Disable 'contextIsolation' to allow 'nodeIntegration'
  //     // 'contextIsolation' defaults to "true" as from Electron v12
  //     contextIsolation: false,
  //     nodeIntegration: true,
  //   },
  //   // parent: mainWindow,
  //   // modal: true,
  //   // show: false,
  //   // show: false,
  //   // backgroundColor: "#66CD00",
  // });

  // secondaryWindow.openDevTools();

  // secondaryWindow.loadFile('secondary.html');

  // const ses3 = session.defaultSession;

  // const ses2 = secondaryWindow.webContents.session;
  // console.log(Object.is(ses, ses3));

  // ses.clearStorageData()

  // THIS IS A PROVMISE

  function getCookies() {
    ses.cookies.get({ name: 'cookie1' }).then(console.log).catch(console.error);
  }

  const cookie = {
    url: 'https://angrychaired.surge.sh',
    name: 'cookie1',
    value: 'electron',
    expirationDate: 1680518597.83476,
  };

  ses.cookies.set(cookie).then(() => {
    console.log('cookie1 set');
    getCookies();

    // [
    //   {
    //     name: '_octo',
    //     value: 'GH1.1.2125894388.1648982589',
    //     domain: '.github.com',
    //     hostOnly: false,
    //     path: '/',
    //     secure: true,
    //     httpOnly: false,
    //     session: false,
    //     expirationDate: 1680518597.83476
    //   },
    //   {
    //     name: 'logged_in',
    //     value: 'no',
    //     domain: '.github.com',
    //     hostOnly: false,
    //     path: '/',
    //     secure: true,
    //     httpOnly: true,
    //     session: false,
    //     expirationDate: 1680518597.834794
    //   },
    //   {
    //     name: 'cookie1',
    //     value: 'electron',
    //     domain: 'angrychaired.surge.sh',
    //     hostOnly: true,
    //     path: '/',
    //     secure: false,
    //     httpOnly: false,
    //     session: true
    //   },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    getCookies();

    /* 
    
    [
  {
    name: '_octo',
    value: 'GH1.1.2125894388.1648982589',
    domain: '.github.com',
    hostOnly: false,
    path: '/',
    secure: true,
    httpOnly: false,
    session: false,
    expirationDate: 1680518597.83476
  },
  {
    name: 'logged_in',
    value: 'no',
    domain: '.github.com',
    hostOnly: false,
    path: '/',
    secure: true,
    httpOnly: true,
    session: false,
    expirationDate: 1680518597.834794
  },
  {
    name: '_gh_sess',
    value: '0iy8xMz52xMkzdIP5qyl4LM3BuE%2BPpmwhxWf0HazFi2FUhk5Bwg0jYgNb9xvyOaWTlPIzAc0%2F5M18E1WSsSpfDxJFheID8ozAJIa5ttYh0CvyBMgAiTVgmZOpD25ljgOddjF9A2%2Fys3ZFjg4BfQfo%2BGUOYq1Zyom7F4SeQ95wet8cBTQ8nycsHr9q4QpRsH5apr5g3dOVpSFYo4fW2AviCEvhcz2svbNsdYya0rFhwYIXkzzOiXADFd8uvNzEztoroTzaVdsr2sCiEDHiS5UxQ%3D%3D--j2NbQqnB%2BpW4gfPL--PEk5Db27DVlVWhSQ%2BIZRSw%3D%3D',
    domain: 'github.com',
    hostOnly: true,
    path: '/',
    secure: true,
    httpOnly: true,
    session: true
  }
]

    
    */
  });

  // console.log(Object.is(ses3, customSes))
  ses.cookies.remove('https://angrychaired.surge.sh', 'cookie1');
  console.log('here');
  getCookies();

  const defaultSession = session.defaultSession;

  defaultSession.on('will-download', (e, downloadItem, wc) => {
    // console.log('item size', downloadItem.getTotalBytes());
    // console.log('item size current', downloadItem.getReceivedBytes());
    // console.log('item nanme', downloadItem.getFilename());

    const fileName = downloadItem.getFilename();
    const fileSize = downloadItem.getTotalBytes();

    downloadItem.setSavePath(app.getPath('desktop') + `/${fileName}`);

    /*     item size 79265
item size current 0
item nanme splash.png */

    downloadItem.on('updated', (e, state) => {
      const received = downloadItem.getReceivedBytes();

      if (state === 'progressing' && received) {
        const progress = Math.round((received / fileSize) * 100);

        console.log({ progress });

        wc.executeJavaScript(`window.progress.value = ${progress}`);
      }
    });
  });

  // dialog
  mainWindow.webContents.on('did-finish-load', () => {
    // dialog
    //   .showOpenDialog(mainWindow, {
    //     buttonLabel: 'Select a photo',
    //     defaultPath: app.getPath('home'),
    //     properties: ["multiSelections", "createDirectory", "openFile", "openDirectory"]
    //   })
    //   .then((result) => {
    //     console.log('result', result);
    //   });
    // dialog.showSaveDialog(mainWindow, {}).then(result => console.log(result))
    // const answers = ['Yes', 'No', 'Maybe'];
    // dialog
    //   .showMessageBox(mainWindow, {
    //     title: 'Some question',
    //     detail: 'Some explanation here',
    //     message: 'Some message',
    //     buttons: answers,
    //   })
    //   .then((result) => {
    //     console.log('result', result);
    //     // result { response: 2, checkboxChecked: false }
    //   });
  });

  // global shortcuts
  // globalShortcut.register('G', () => console.log('user pressed G'));
  // globalShortcut.register('CommandOrControl+G', () =>
  //   console.log('user pressed G')
  // );
  // globalShortcut.unregister('CommandOrControl+G', () =>
  //   console.log('user unpressed G')
  // );

  // Menu and menu item

  // const mainMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Electron',
  //     submenu: [
  //       {
  //         label: 'Item 1',
  //         submenu: [
  //           {
  //             label: 'Subitem 1',
  //           },
  //         ],
  //       },
  //       { label: 'Item 2' },
  //       { label: 'Item 3' },
  //     ],
  //   },
  //   {
  //     label: 'Actions',
  //     submenu: [
  //       {
  //         label: 'Item 1',
  //         submenu: [
  //           {
  //             label: 'Subitem 1',
  //           },
  //         ],
  //       },
  //       { label: 'Item 2' },
  //       { label: 'Item 3' },
  //     ],
  //   },
  //   {
  //     label: 'Help',
  //     submenu: [
  //       {
  //         label: 'Item 1',
  //         submenu: [
  //           {
  //             label: 'Subitem 1',
  //           },
  //         ],
  //       },
  //       { label: 'Item 2' },
  //       { label: 'Item 3' },
  //     ],
  //   },
  // ]);

  // const mainMenu = new Menu();
  // const menuItem1 = new MenuItem({
  //   label: 'Electron',
  //   submenu: [
  //     {
  //       label: 'Item 1',
  //       submenu: [
  //         {
  //           label: 'Subitem 1',
  //         },
  //       ],
  //     },
  //     { label: 'Item 2' },
  //     { label: 'Item 3' },
  //   ],
  // });

  // mainMenu.append(menuItem1);

  // Menu.setApplicationMenu(mainMenu);

  // context menu
  mainWindow.webContents.on('context-menu', (e) => {
    contextMenu.popup(mainWindow);
  });

  // tray module
  createTray();

  // power monitor
  const powerMonitor = electron.powerMonitor;

  powerMonitor.on('suspend', (e) => {
    console.log('Saving some data');
  });

  powerMonitor.on('resume', () => {
    if (!mainWindow) createWindow();
  });

  // screen
  // console.log({ screen: screen.getAllDisplays() });
  const displays = screen.getAllDisplays();

  // console.log('dimensions', displays[0].bounds);
  // dimensions { x: -1536, y: 216, width: 1536, height: 864 }

  screen.on('display-metrics-changed', (e, display, metricsChanged) => {
    console.log('metrics changed', metricsChanged);
    // metrics changed [ 'bounds', 'workArea' ]
  });

  // setInterval(() => {
  //   console.log("mouse position", screen.getCursorScreenPoint())
  //   // mouse position { x: 239, y: 529
  // }, 100);

  // ipc main, after app has started
  mainWindow.webContents.on('did-finish-load', (e) => {
    // mainWindow.webContents.send('mailbox', 'you have mail');
    mainWindow.webContents.send('mailbox', {
      name: 'karlo',
      age: 36,
    });
  });

  // listen on main window's contents crash event
  mainWindow.webContents.on('crashed', () => {
    setTimeout(() => {
      mainWindow.reload();
    }, 1000);
  });

  let progress = 0.01;

  // progress bar

  const progressInterval = setInterval(() => {
    // 1 is 100%

    mainWindow.setProgressBar(progress);

    if (progress <= 1) {
      progress += 0.01;
    } else {
      // 0 sets finished
      // -1 removesit
      mainWindow.setProgressBar(-1);
      clearInterval(progressInterval);
    }
  }, 100);
}

// app.on("browser-window-blur", (e) => {
//   console.log("app unfocused")

//   // console.log('app is quting');
//   // e.preventDefault()

//   setTimeout(() => {
//     app.quit()
//   }, 1000)
// });

// app.on("browser-window-focus", (e) => {
//   console.log("app focused")

//   // console.log('app is quting');
//   // e.preventDefault()
// });

// Electron `app` is ready
app.on('ready', () => {
  console.log('app is ready');

  console.log(app.getPath('desktop'));
  console.log(app.getPath('music'));
  console.log(app.getPath('temp'));
  console.log(app.getPath('userData'));

  createWindow();
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  // if (mainWindow === null) createWindow();
});

// ipc main
ipcMain.on('channel1-sync', (e, args) => {
  console.log('args:', args);
  // this is deprecated
  e.returnValue = 'A sync value';
});

ipcMain.on('channel1', (e, args) => {
  console.log('args:', args);
  console.log('sender:', e.sender);
  e.sender.send('channel1-response', 'Message received - thank you!');
});

// logic for displaying message box dialog from the main process

async function askFruit() {
  const fruites = ['apple', 'orange', 'grape'];
  const choice = await dialog.showMessageBox({
    message: 'Pick a fruite',
    buttons: fruites,
  });

  const response = fruites[choice.response];

  return response;
}

// waiing on event for fruit on ipc main
// ipcMain.on('ask-fruit', (e) => {
//   askFruit().then((answer) => {
//     e.reply('fruit-choice', answer);
//   });
// });

// we now handle invocation, we dont listen anymore
ipcMain.handle('ask-fruit', (e) => {
  return askFruit();
});

ipcMain.handle('get-desktop-path', (e) => {
  return app.getPath('desktop');
});

ipcMain.handle('get-current-window', () => {
  const window = BrowserWindow.getFocusedWindow();
  console.log({ window });

  window.close();
});

// share modules
// console.log('process:', process.versions);
// console.log('process:', process.type);
// console.log('process:', process.windowsStore);
// console.log('process:', process.mas);
// console.log('process:', process.getCreationTime());
// console.log('process:', process.getCPUUsage());
// console.log('process:', process.getHeapStatistics());

/* 
process: {
  node: '12.14.1',
  v8: '8.3.110.13-electron.0',
  uv: '1.33.1',
  zlib: '1.2.11',
  brotli: '1.0.7',
  ares: '1.15.0',
  modules: '80',
  nghttp2: '1.40.0',
  napi: '5',
  llhttp: '2.0.1',
  http_parser: '2.8.0',
  openssl: '1.1.0',
  icu: '65.1',
  unicode: '12.1',
  electron: '9.4.4',
  chrome: '83.0.4103.122'
}
*/
