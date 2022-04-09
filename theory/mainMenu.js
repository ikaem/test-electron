const { Menu } = require('electron');

const mainMenu = Menu.buildFromTemplate([
  {
    label: 'Electron',
    submenu: [
      {
        label: 'Item 1',
        submenu: [
          {
            label: 'Subitem 1',
            click: () => {
              console.log('this is main menu click');
            },
            accelerator: 'Shift+Alt+G',
            enabled: false,
          },
        ],
      },
      { label: 'Dev Tools', role: 'toggleDevTools' },
      { label: 'Item 3' },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {role: "undo"},
      {role: "redo"},
      {role: "copy"},
      {role: "paste"},
    ]
  },
  {
    label: 'Actions',
    submenu: [
      {
        label: 'Item 1',
        submenu: [
          {
            // label: 'Subitem 1',
            role: "toggleFullScreen"
          },
        ],
      },
      { label: 'Item 2' },
      { label: 'Item 3' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Item 1',
        submenu: [
          {
            label: 'Subitem 1',
          },
        ],
      },
      { label: 'Item 2' },
      { label: 'Item 3' },
    ],
  },
]);

module.exports = mainMenu;
