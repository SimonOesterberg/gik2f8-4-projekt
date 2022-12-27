const sentOrdersListElement = document.getElementById('sentOrdersList')

const sentOrdersApi = new SentOrdersApi('http://localhost:5000/sentOrders');


function renderOrders(){
    sentOrdersApi.getAll().then((orders) => {

        sentOrdersListElement.innerHTML = '';
        
        if (orders && orders.length > 0) {
            orders.forEach((order) => {
                sentOrdersListElement.insertAdjacentHTML('beforeend', renderOrder(order));
            });
            
            
        } else {
            sentOrdersListElement.insertAdjacentHTML('beforeend', `<h2 class="text-center text-xl font-bold text-gray-500">Inga beställningar ännu!</h2>`)
        }
    });
   
}
  function renderOrder({id, content}) {
   

    let html = `
        <li class="flex bg-white bg-opacity-75 mt-2 p-3 rounded border-neutral-400 border border-solid shadow">
            <div class="flex-1">
                <div class="flex items-center justify-start">
                    <h3 class="mb-1 text-xl font-bold text-pink-800 uppercase">Order ${id}</h3>
                </div>
        `

        content.forEach(orderItem => {
            html += `
                <p class="mt-2 text-l">${orderItem.name}</p>
                `
        });

        

        html+=`
            </div>
            <div class="flex items-center">
                <button name="finishOrder" class="rounded-md bg-blue-300 hover:bg-blue-100 px-4 py-1" type="submit" onclick="finishOrder(${id})">Order färdig</button>
            </div>
        </li>`;
  
    return html;
  }



   
function finishOrder(id) {
    sentOrdersApi.remove(id).then((result) => {
        renderOrders();
    });
}
  

  renderOrders();