const express = require('express');
const ProductManager = require('./productManager'); 
const app = express();
const puerto = 8080;

const gestorProducts = new ProductManager('./productos.json'); 

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = gestorProducts.getProducts();

    if (limit) {
      res.json(products.slice(0, parseInt(limit)));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const idProducto = parseInt(req.params.pid);
    const producto = gestorProducts.getProductById(idProducto);

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
