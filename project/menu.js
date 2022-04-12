const { Menu, shell } = require('electron');

const applyAppMenu = (appWin) => {
  const template = [
    {
      label: 'Items',
      submenu: [
        {
          label: 'Add new',
          click: () => {
            appWin.send('menu-show-modal');
          },
          accelerator: 'CmdOrCtrl+O',
        },
        {
          label: 'Read item',
          click: () => {
            appWin.send('menu-open-item');
          },
          accelerator: 'CmdOrCtrl+Enter',
        },
        {
          label: 'Delete item',
          click: () => {
            appWin.send('menu-delete-item');
          },
          accelerator: 'CmdOrCtrl+Backspace',
        },
        {
          label: 'Open in Browser',
          accelerator: 'CmdOrCtrl+Shift+Enter',
          click: () => {
            appWin.send('menu-open-item-native');
          },
        },
        {
          label: 'Search Items',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            appWin.send('menu-focus-search');
          },
        },
      ],
    },
    { role: 'editMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more',
          click: () => shell.openExternal('https://angrychaired.surge.sh'),
        },
      ],
    },
  ];

  if (process.platform === 'darwin')
    template.unshift({
      role: 'appMenu',
    });

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
};

module.exports = {
  applyAppMenu,
};
