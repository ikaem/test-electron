const { Menu } = require('electron');

exports.trayMenu = Menu.buildFromTemplate([
  { label: 'item 1' },
  { role: 'quit' },
]);
