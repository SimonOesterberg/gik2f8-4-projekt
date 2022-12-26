const menuListElement = document.getElementById('menuList');

const menuApi = new MenuApi('http://localhost:5000/menu');



  
function addToOrder(item){
OrdersApi.create(item).then((item) => {
     if (item) {
        renderList();
      }
 });
}
  

function renderMenu() {
    console.log('rendering');
  
    menuApi.getAll().then((menu) => {

        menuListElement.innerHTML = '';

      if (menu && menu.length > 0) {
        menu.forEach((menuItem) => {
          menuListElement.insertAdjacentHTML('beforeend', renderMenuItem(menuItem));
        });
      }
    });
  }
  
  function renderMenuItem({id, name, description, price}) {

    let html = `
        <li class="flex bg-white bg-opacity-75 mt-2 p-3 rounded border-neutral-400 border border-solid shadow">
            <div class="flex-1">
                <div class="flex items-center">
                    <h3 class="mb-1 flex-1 text-xl font-bold text-pink-800 uppercase">${name}</h3>
                </div>
                <p class="mt-2 text-xs">${description}</p>
            </div>
            <div class="flex items-center">
                <button name="addToOrder" class="rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1" type="submit">Beställ</button>
            </div>
        </li>`;
  
    return html;
  }

   
function deleteOrder(id) {
    OrdersApi.remove(id).then((result) => {
  
      renderList();
    });
  }
  
  
  
  
  

  renderMenu();