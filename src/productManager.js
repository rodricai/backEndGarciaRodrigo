const fs = require('fs');


class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this.readProducts();
        this.productIdCounter = this.calculateProductIdCounter();
    }

    readProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error('Error reading products file:', error.message);
            return [];
        }
    }

    saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(this.path, data);
        } catch (error) {
            console.error('Error saving products file:', error.message);
        }
    }

    calculateProductIdCounter() {
        if (this.products.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.products.map(product => product.id), 0);
        return maxId + 1;
    }

    addProduct(product) {
        // Validar campos obligatorios
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        // Validar que el campo "code" no se repita
        if (this.products.some(p => p.code === product.code)) {
            console.error("Ya existe un producto con ese código");
            return;
        }

        // Agregar producto con id autoincrementable
        const newProduct = {
            id: this.productIdCounter++,
            ...product
        };
        this.products.push(newProduct);
        this.saveProducts();
        console.log("Producto agregado correctamente:", newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    }

    updateProduct(productId, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields,
                id: productId, 
            };
            this.saveProducts();
            console.log('Producto actualizado correctamente:', this.products[productIndex]);
            return this.products[productIndex];
        }

        console.error('Producto no encontrado');
        return null;
    }

    deleteProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        this.saveProducts();
        console.log('Producto eliminado correctamente con ID:', productId);
    }
}
module.exports = ProductManager;

// Uso de la clase

const productManager = new ProductManager('productos.json');




/*
///////////////////////////////  TESTING   ////////////////////////
// Ejemplo de cómo agregar un producto

productManager.addProduct({
  title: "Producto de prueba",
  description: "Este es un producto de prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});
// Crear instancia de ProductManager
const productManager = new ProductManager();

// getProducts devuelve array vacío
const productoInicial = productManager.getProducts();
console.log("Productos iniciales:", productoInicial);

// addProduct con un nuevo producto
productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25
});

// Invocar a getProducts nuevamente y muestra el producto recien agregado en el array
const productoAgreadoRecientemente = productManager.getProducts();
console.log("Productos después de la adición:", productoAgreadoRecientemente);

// agregamos el producto con el code repetido para que tire error
productManager.addProduct({
  title: "producto repetido",
  description: "Este es un producto repetido",
  price: 150,
  thumbnail: "Otra imagen",
  code: "abc123",  // Code repetido
  stock: 20
});

// Llamar a getProductById con un ID que no existe (debería mostrar un error)
const idDeProductoInexistente = 999;
const productoInexistente = productManager.getProductById(idDeProductoInexistente);

// Llamar a getProductById con el ID del producto agregado (debería mostrar el producto)
const idProductoAgregado = 1;  // Ajustar según el ID generado automáticamente
const productoEncontrado = productManager.getProductById(idProductoAgregado);

// Mostrar resultados
console.log("Producto no encontrado:", productoInexistente);
console.log("Producto encontrado:", productoEncontrado);

// Verificación de que el producto se haya agregado correctamente
const allProducts = productManager.getProducts();
console.log('Todos los productos después de agregar:', allProducts);


*/