const { autoUpdater } = require('electron-updater');

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

const autoUpdate = () => {
  // check for updates on GH releases

  console.log('checking for updates ');
  autoUpdater.checkForUpdates();
};

module.exports = { autoUpdate };
