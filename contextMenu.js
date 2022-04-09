const { Menu } = require('electron');

exports.contextMenu = Menu.buildFromTemplate([
  {
    label: 'Item 1',
  },
  {
    // label: 'Item 2',
    role: "editMenu"
  },
]);
