const items = document.getElementById('items');
// const storage = [];
const storage = JSON.parse(localStorage.getItem('readit-items')) || [];

console.log({ storage });

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
  // initially remove select class from element that has it
  document
    .getElementsByClassName('read-item selected')[0]
    ?.classList.remove('selected');

  // now select the one in the event - pretty cool
  e.currentTarget.classList.add('selected');
};

const changeSelection = (direction) => {
  // we need to get current item
  const currentItem = document.querySelector('.read-item.selected');

  if (direction === 'ArrowUp' && currentItem?.previousElementSibling) {
    currentItem?.classList.remove('selected');
    currentItem?.previousElementSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem?.nextElementSibling) {
    currentItem?.classList.remove('selected');
    currentItem.nextElementSibling.classList.add('selected');
  }
};

const open = () => {
  if (!storage.length) return;

  const selectedItem = document.getElementsByClassName('read-item selected')[0];

  const contentUrl = selectedItem.dataset.url;

  console.log({ contentUrl });
};

module.exports = {
  storage,
  addItem,
  save,
  renderItemsFromStorage,
  select,
  changeSelection,
  open,
};
