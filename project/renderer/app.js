const showModalButton = document.getElementById('show-modal');
const closeModalButton = document.getElementById('close-modal');
const modal = document.getElementById('modal');
const addItemButton = document.getElementById('add-item');
const itemUrl = document.getElementById('url');

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

  console.log({ url: itemUrl });
});

itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItemButton.click();
});
