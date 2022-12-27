const express = require('express');
const app = express();

const fs = require('fs/promises');

const PORT = 5000;
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    
    next();
  });

app.get(['/menu', '/orders', '/sentOrders'], async (req, res) => {
  try {

    if (req.url === "/menu") {
        const menu = await fs.readFile('./menu.json');
        res.send(JSON.parse(menu));
    } else if (req.url === "/orders") {
        const orders = await fs.readFile('./orders.json');
        res.send(JSON.parse(orders));
    } else if (req.url === '/sentOrders'){
      const sentOrders = await fs.readFile('./sentOrders.json');
      res.send(JSON.parse(sentOrders));
    }

  } catch (error) {
    res.status(500).send({ error });
  }
});


app.post(['/orders', '/sentOrders'], async (req, res) => {
  if (req.url === "/orders") {
    try {
      const item = req.body;
      const listBuffer = await fs.readFile('./orders.json');
      const currentOrder = JSON.parse(listBuffer);

      let maxOrderItemId = 0;
      if (currentOrder && currentOrder.length > 0) {
        maxOrderItemId = currentOrder.reduce(
          (maxId, currentElement) =>
            currentElement.id > maxId ? currentElement.id : maxId,
          maxOrderItemId
        );
      }

      const newOrderItem = { id: maxOrderItemId + 1, ...item };
      const updatedOrder = currentOrder ? [...currentOrder, newOrderItem] : [newOrderItem];

      await fs.writeFile('./orders.json', JSON.stringify(updatedOrder));
      res.send(updatedOrder);
    } catch (error) {
      res.status(500).send({ error: error.stack });
    }
  } else if (req.url === '/sentOrders') {
    try {
      const order = req.body;
      const listBuffer = await fs.readFile('./sentOrders.json');
      const currentSentOrders = JSON.parse(listBuffer);

      let maxSentOrdersId = 0;
      if (currentSentOrders && currentSentOrders.length > 0) {
        maxSentOrdersId = currentSentOrders.reduce(
          (maxId, currentElement) =>
            currentElement.id > maxId ? currentElement.id : maxId,
            maxSentOrdersId
        );
      }

      const newSentOrder = { id: maxSentOrdersId + 1, content: order.pop() };
      const updatedSentOrders = currentSentOrders ? [...currentSentOrders, newSentOrder] : [newSentOrder];

      await fs.writeFile('./sentOrders.json', JSON.stringify(updatedSentOrders));
      res.send(updatedSentOrders);
    } catch (error) {
      res.status(500).send({ error: error.stack });
    }
  }
});

app.delete(['/orders/:id', '/sentOrders/:id'], async (req, res) => {
  console.log(req.url);

  const targetFile = req.url.substring(0, req.url.length - 2);

  if (targetFile === '/orders') {
    try {
      const id = req.params.id;
      const listBuffer = await fs.readFile('./orders.json');
      const currentOrder = JSON.parse(listBuffer);
      if (currentOrder.length > 0) {
        await fs.writeFile(
          './orders.json',
          JSON.stringify(currentOrder.filter((orderItem) => orderItem.id != id))
        );
        res.send({ message: `Rätt med id ${id} togs bort` });
      } else {
        res.status(404).send({ error: 'Ingen rätt att ta bort' });
      }
    } catch (error) {
      res.status(500).send({ error: error.stack });
    }
  } else if (targetFile === '/sentOrders') {
    try {
      const id = req.params.id;
      const listBuffer = await fs.readFile('./sentOrders.json');
      const currentOrders = JSON.parse(listBuffer);
      if (currentOrders.length > 0) {
        await fs.writeFile(
          './sentOrders.json',
          JSON.stringify(currentOrders.filter((orderItem) => orderItem.id != id))
        );
        res.send({ message: `Order med id ${id} togs bort` });
      } else {
        res.status(404).send({ error: 'Ingen order att ta bort' });
      }
    } catch (error) {
      res.status(500).send({ error: error.stack });
    }
  }
});

app.patch('/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const newData = req.body
    const listBuffer = await fs.readFile('./orders.json');
    const currentTasks = JSON.parse(listBuffer);
      let oldOrder = currentTasks.filter((order) => order.id == orderId);
      if(oldOrder.length >= 1){
        Object.assign(oldOrder[0], newData);
        const orderList = oldOrder.filter(order => order.id != orderId);
        await fs.writeFile('./orders.json', JSON.stringify([...orderList, oldOrderTask[0]]));
        res.send(oldOrder)
      } else {
     

      res.status(404).send({ error: 'Ingen uppgift' });
    }
    
  } catch (error) {
    /* Om något annat fel uppstår, skickas statuskod 500, dvs. ett generellt serverfel, tillsammans med information om felet.  */
    res.status(500).send({ error: error.stack });
  }
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
