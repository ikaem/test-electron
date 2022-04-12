const { ipcRenderer } = require('electron');
const {
  addItem,
  renderItemsFromStorage,
  changeSelection,
  open: openItem,
  openItemNative,
  getSelectedItem,
  deleteItem,
} = require('./controllers/items');

const showModalButton = document.getElementById('show-modal');
const closeModalButton = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItemButton = document.getElementById('add-item');
const itemUrl = document.getElementById('url');
const search = document.getElementById('search');

renderItemsFromStorage();

// filter items with search
search.addEventListener('keyup', (e) => {
  const readItemsCollection = document.getElementsByClassName('read-item');

  const arrayOfItemElements = Array.from(readItemsCollection);

  for (const itemElement of arrayOfItemElements) {
    const isMatch = itemElement.textContent
      .toLowerCase()
      .includes(e.target.value.toLowerCase());
    console.log({ isMatch });

    itemElement.style.display = isMatch ? 'flex' : 'none';
  }
});

// handling ui behavior while sending new item
const toggleModalButtons = () => {
  if (addItemButton.disabled === true) {
    addItemButton.disabled = false;
    addItemButton.style.opacity = 1;
    addItemButton.innerText = 'Add Item';
    closeModalButton.style.display = 'inline';
  } else {
    addItemButton.disabled = true;
    addItemButton.style.opacity = 0.5;
    addItemButton.innerText = 'Adding...';
    closeModalButton.style.display = 'none';
  }
};

// now we handle toggling modal
showModalButton.addEventListener('click', () => {
  // this is applied inline
  modal.style.display = 'flex';
  itemUrl.focus();
});

closeModalButton.addEventListener('click', () => {
  // this is applied inline
  modal.style.display = 'none';
});

/* handle new new item */
addItemButton.addEventListener('click', () => {
  const url = itemUrl.value;
  // this would usually be done by the way of preload script
  ipcRenderer.send('new-item', itemUrl.value);
  toggleModalButtons();
});

itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItemButton.click();
});

// listeners - we would not do this in production like that - we would have data returned from the preload script
ipcRenderer.on('new-item-success', (e, data) => {
  console.log({ data });

  // add new item to html

  addItem(data);

  toggleModalButtons();

  // hide the modal and clear input
  modal.style.display = 'none';
  itemUrl.value = '';
});

// logic for keyboard navigation if up or down
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    changeSelection(e.key);
  }
});

// listener for opening modal form menu
ipcRenderer.on('menu-show-modal', (e) => {
  showModalButton.click();
});

// listener for opening modal form menu
ipcRenderer.on('menu-open-item', (e) => {
  // showModalButton.click();
  openItem();
});

// listener for opening modal form menu
ipcRenderer.on('menu-delete-item', (e) => {
  console.log('reached');
  const selectedItemIndex = getSelectedItem().itemIndex;
  deleteItem(selectedItemIndex);
});

ipcRenderer.on('menu-open-item-native', (e) => {
  // showModalButton.click();
  // openItem();

  // const selectedItem = getSelectedItem()

  openItemNative();
});

ipcRenderer.on('menu-focus-search', (e) => {
  // showModalButton.click();
  // openItem();

  console.log('are we here');

  // const selectedItem = getSelectedItem()

  search.focus();
});
