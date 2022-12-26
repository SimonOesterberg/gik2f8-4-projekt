const menuListElement = document.getElementById('menuList');
const orderListElement = document.getElementById('orderList')

const menuApi = new MenuApi('http://localhost:5000/menu');
const ordersApi = new OrdersApi('http://localhost:5000/orders');

menuForm.addEventListener('submit', onSubmit);

  
function onSubmit(e){

    e.preventDefault();

    let itemToOrder;
    const id = orderedItem.value;

    menuApi.getAll().then((menu) => {

        menuListElement.innerHTML = '';

        menu.forEach(item => {
            if (item.id == id) {
                itemToOrder = item;
            }
        });

        delete itemToOrder.id; 

        addToOrder(itemToOrder);
    });
}

function addToOrder(item) {
    ordersApi.create(item).then((item) => {
        if (item) {
            renderOrders();
        }
    });
}
  

function renderOrders(){
    ordersApi.getAll().then((orders) => {

        orderListElement.innerHTML = '';

        if (orders && orders.length > 0) {
            orders.forEach((orderItem) => {
            orderListElement.insertAdjacentHTML('beforeend', renderOrderItem(orderItem));
            });
        } else {
            orderListElement.insertAdjacentElement('beforeend', `<p>Inget i beställningen ännu!</p>`)
        }
    });
}

function renderMenu() {
    console.log('rendering menu');
  
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
                <div class="flex items-center justify-start">
                    <h3 class="mb-1 text-xl font-bold text-pink-800 uppercase">${name}</h3>
                    <p class="ml-1 mr-1"> - </p>
                    <h3 class="mb-1 flex-1 text-xl font-bold text-pink-800 uppercase">${price}:-</h3>
                </div>
                <p class="mt-2 text-xs">${description}</p>
            </div>
            <div class="flex items-center">
                <button name="addToOrder" class="rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-1" type="submit" onclick="orderedItem.value = ${id}">Lägg till</button>
            </div>
        </li>`;
  
    return html;
  }

  
  function renderOrderItem({id, name, description, price}) {

    let html = `
        <li class="flex bg-white bg-opacity-75 mt-2 p-3 rounded border-neutral-400 border border-solid shadow">
            <div class="flex-1">
                <div class="flex items-center justify-start">
                    <h3 class="mb-1 text-xl font-bold text-pink-800 uppercase">${name}</h3>
                    <p class="ml-1 mr-1"> - </p>
                    <h3 class="mb-1 flex-1 text-xl font-bold text-pink-800 uppercase">${price}:-</h3>
                </div>
                <p class="mt-2 text-xs">${description}</p>
            </div>
            <div class="flex items-center">
                <button name="removeOrderItem" class="rounded-md bg-red-600 hover:bg-red-400 px-4 py-1" type="submit" onclick="deleteOrder(${id})">Ta bort</button>
            </div>
        </li>`;
  
    return html;
  }


function calcPrize(items){
    
    
}

   
function deleteOrder(id) {
    ordersApi.remove(id).then((result) => {
  
      renderOrders();
    });
  }
  
  
  
  
  

  renderMenu();
  renderOrders();