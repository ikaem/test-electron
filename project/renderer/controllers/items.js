const { shell } = require('electron');
const fs = require('fs');
const { resolve } = require('path');

const items = document.getElementById('items');
// const storage = [];
const storage = JSON.parse(localStorage.getItem('readit-items')) || [];

console.log({ storage });

let readerJS;
// note that read file reutnrs buffer by degalt
// we would not have fs here, nor dirnmae
fs.readFile(resolve(__dirname, 'reader.js'), (err, data) => {
  // need to convert data buffer to sztring
  readerJS = data.toString();
});

// listen for message from reader window
window.addEventListener('message', (e) => {
  console.log(e);
  if (e.data.action === 'delete-reader-item') {
    deleteItem(e.data.itemIndex);
    // close the window somewhie
    // we need the proxy window id

    e.source.close();
  }
});

// delete item
const deleteItem = (index) => {
  // so we need to remove the child for sure
  items.removeChild(items.childNodes[index]);

  console.log({ index });
  console.log({ children: items.childNodes });

  // and then also remove from the cache
  // oh, yes, we hold it here
  storage.splice(index, 1);
  save();

  if (storage.length === 0) return;

  const newSelectedItemIndex = index === 0 ? 0 : index - 1;

  document
    .getElementsByClassName('read-item')
    [newSelectedItemIndex].classList.add('selected');
};

// content to load after a n itme is open - this is to offer some options to users
const save = () => {
  localStorage.setItem('readit-items', JSON.stringify(storage));
};

const addItem = (item, isNew = true) => {
  // ćcreate nmew dom node for an item
  // so we create a div

  const itemNode = document.createElement('div');

  itemNode.setAttribute('class', 'read-item');

  itemNode.innerHTML = `
    <img src="${item.screenshot}"/>
    <h2>${item.title}</h2> 
  `;

  itemNode.setAttribute('data-url', item.url);

  // items.appendChild(itemNode);
  items.append(itemNode);

  itemNode.addEventListener('click', select);
  itemNode.addEventListener('dblclick', open);

  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  if (!isNew) return;

  storage.push(item);
  save();
};

// track items in local stroage
// this would notmally be in some kind of repositroy layer
const renderItemsFromStorage = () => {
  for (const item of storage) {
    // console.log({ item });
    // const itemNode = document.createElement('div');

    // itemNode.setAttribute('class', 'read-item');

    // itemNode.innerHTML = `
    //   <img src="${item.screenshot}"/>
    //   <h2>${item.title}</h2>
    // `;

    // items.append(itemNode);

    addItem(item, false);
  }
};

// set items as elected

const select = (e) => {
  // // initially remove select class from element that has it
  // document
  //   .getElementsByClassName('read-item selected')[0]
  //   ?.classList.remove('selected');

  getSelectedItem().node.classList.remove('selected');

  // now select the one in the event - pretty cool
  e.currentTarget.classList.add('selected');
};

const changeSelection = (direction) => {
  // we need to get current item
  // const currentItem = document.querySelector('.read-item.selected');/*  */
  const currentItem = getSelectedItem().node;

  if (direction === 'ArrowUp' && currentItem?.previousElementSibling) {
    currentItem?.classList.remove('selected');
    currentItem?.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem?.nextElementSibling) {
    currentItem?.classList.remove('selected');
    currentItem.nextElementSibling.classList.add('selected');
  }
};

const open = async () => {
  if (!storage.length) return;

  // const selectedItem = document.getElementsByClassName('read-item selected')[0];
  const selectedItem = getSelectedItem();

  const contentUrl = selectedItem.node.dataset.url;

  console.log({ contentUrl });

  const readerWindow = window.open(
    contentUrl,
    '',
    `
    maxWidth=2000,
    maxHeight=2000,
    width=300,
    height=800,
    backgroundColor=#dedede,
    nodeIntegration=0,
    contextIsolation=1
  `
  );

  // console.log(readerJS.replace('{{index}}', selectedItem.itemIndex));

  readerWindow.eval(readerJS.replace('{{index}}', selectedItem.itemIndex));
};

const getSelectedItem = () => {
  const currentItem = document.getElementsByClassName('read-item selected')[0];

  // now we set the thing of index to 0
  let itemIndex = 0;
  let child = currentItem;

  // this will increment item index every time the child has a previous sibling - and it will eventually lead us to the actualy item index where current item is at
  //very cool one liner
  while ((child = child.previousElementSibling) != null) itemIndex++;

  return {
    node: currentItem,
    itemIndex,
  };
};

const openItemNative = () => {
  if (!storage.length) return;

  const selectedItem = getSelectedItem();

  const contentUrl = selectedItem.node.dataset.url;

  shell.openExternal(contentUrl);
};

module.exports = {
  storage,
  addItem,
  save,
  renderItemsFromStorage,
  select,
  changeSelection,
  open,
  openItemNative,
  getSelectedItem,
  deleteItem,
};
