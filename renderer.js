// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { desktopCapturer, ipcRenderer, remote, shell } = require('electron');

// console.log({ remote });

// console.log('what not');
// alert("what is ")

// document.getElementById('button-screenshot').addEventListener('click', () => {
//   desktopCapturer
//     .getSources({
//       types: ['screen', 'window'],
//       thumbnailSize: { width: 500, height: 500 },
//     })
//     .then((result) => {
//       // const image = document.getElementById("screen-thumbnail").setAttribute("src", result[0].thumbnail)

//       document.getElementById('screen-thumbnail').src =
//         result[0].thumbnail.toDataURL();
//     });
// });

// desktopCapturer
//   .getSources({ types: ['screen', 'window'] })
//   .then((result) => console.log('result', result));

// ipc rendered
document.getElementById('channel1Button').addEventListener('click', () => {
  // jnow we send async
  // ipcRenderer.send('channel1', 'hello from main window');
  // now we send sync
  const response = ipcRenderer.sendSync(
    'channel1-sync',
    'hello from main window, i am waitinbg for response'
  );

  console.log('this is sync response', response);
});

ipcRenderer.on('channel1-response', (e, args) => {
  console.log('args on renderer:', args);
});

ipcRenderer.on('mailbox', (e, args) => {
  console.log('args on renderer for mailbox:', args);
});

// requiring dialog from remote
const { dialog, BrowserWindow } = remote;

setTimeout(() => {
  // const win = new BrowserWindow({
  //   y: 50,
  //   x: 50,
  //   width: 300,
  //   height: 300,
  // });
  // win.loadFile('index.html');
  // // dialog
  // //   .showMessageBox({
  // //     message: 'Dialog from renderer',
  // //     buttons: ['one', 'two'],
  // //   })
  // //   .then((result) => console.log('result:', result));
  // setTimeout(() => {
  //   // remote.app.quit();
  // }, 2000);
  // const mainWindow = remote.getCurrentWindow();
  // mainWindow.maximize();
}, 2000);

// getting fruit dialog with ipc

document.getElementById('ask-fruit').addEventListener('click', () => {
  // ipcRenderer.send('ask-fruit');
  ipcRenderer
    .invoke('ask-fruit')
    .then((result) => console.log('choice:', result));
});

const showSite = () => {
  shell.openExternal('https://electronjs.org');
};

// shell.showItemInFolder()

// ipcRenderer.on('fruit-choice', (e, args) => {
//   console.log('choice response:', args);
// });

// native image
//

// html5 notifications
// const notification = new Notification('Electron app', {
//   body: 'This is some notification',
// });

notification.onclick = async (e) => {
  console.log('event', e);

  const currentWindow = await ipcRenderer.invoke('get-current-window');
  console.log({ currentWindow });
};
