const { app } = require('electron');
const fs = require('fs');
const { resolve } = require('path');

const desktopPath = app.getPath('desktop');

window.versions = {
  node: process.versions.node,
  electron: process.versions.electron,
};

// this does not work just because node integration is enabled, and im lazy to remove al lrequire references in the app
window.writeToFile = (text) => {
  fs.writeFile(resolve(desktopPath, 'newfile.txt'), text, (err) =>
    console.log({ err })
  );
};
