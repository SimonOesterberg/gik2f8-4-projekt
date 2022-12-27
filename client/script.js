const menuListElement = document.getElementById('menuList');
const orderListElement = document.getElementById('orderList');


const menuApi = new MenuApi('http://localhost:5000/menu');
const ordersApi = new OrdersApi('http://localhost:5000/orders');
const sentOrdersApi = new SentOrdersApi('http://localhost:5000/sentOrders');

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
            renderMenu();
        }
    });
}
  

function renderOrders(){
    ordersApi.getAll().then((orders) => {

        orderListElement.innerHTML = '';
        let totalAmount = 0;
        const totalPriceElement = document.getElementById('totalPrice');
        
        if (orders && orders.length > 0) {
            orders.forEach((orderItem) => {
                totalAmount += orderItem.price;
                orderListElement.insertAdjacentHTML('beforeend', renderOrderItem(orderItem));

            });
            totalPriceElement.innerHTML = totalAmount + ":-";
            
        } else {
            orderListElement.insertAdjacentHTML('beforeend', `<h2 class="text-center text-xl font-bold text-gray-500 p-4" >Inget i beställningen ännu!</h2>`)
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
                <button name="addToOrder" class="rounded-md bg-teal-700 hover:bg-teal-600 bg-opacity-50 px-4 py-1" type="submit" onclick="orderedItem.value = ${id}"> Lägg Till</button>
                
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
                    <h3 class="mb-1 flex-1 text-xl font-bold text-pink-800ö uppercase">${price}:-</h3>
                </div>
                <p class="mt-2 text-xs">${description}</p>
            </div>
            <div class="flex items-center">
                <button name="removeOrderItem" class="rounded-md bg-red-300 hover:bg-red-100 px-4 py-1" type="submit" onclick="deleteOrder(${id})"> Ta Bort </button>
            </div>
        </li>`;
  
    return html;
  }


function sendOrder() {

    let newOrder = [];

    ordersApi.getAll().then((order) => {

        if (order) {

            newOrder.push(order);

            if (newOrder.length > 0) {
                sentOrdersApi.create(newOrder).then((newOrder) => {
                    if (newOrder) {
                        renderOrders();
                    }
                });
            }
        }
    });
}

   
function deleteOrder(id) {
    ordersApi.remove(id).then((result) => {
  
      renderOrders();
    });
}


  renderMenu();
  renderOrders();