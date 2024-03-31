document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('productList');

    // Function to fetch and display products
    function fetchProducts() {
        fetch('https://localhost:7215/api/Product')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(products => {
                renderProducts(products);
            })
            .catch(error => {
                productList.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    }

    // Function to render products on the page
    function renderProducts(products) {
        productList.innerHTML = ''; // Clear existing list
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <h2>${product.name}</h2>
                <p>Description: ${product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
            `;
            productList.appendChild(productElement);
        });
    }

    // Function to create a new product
    async function createProduct(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch('https://localhost:7215/api/Product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    description: formData.get('description'),
                    price: parseFloat(formData.get('price')),
                    quantity: parseInt(formData.get('quantity'))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            // Reset form fields
            form.reset();

            // Refresh product list
            fetchProducts();
            document.getElementById('createMessage').textContent = 'Product created successfully!';
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('createMessage').textContent = error.message;
        }
    }

    // Fetch and display products when the page loads
    fetchProducts();

    // Attach event listener to the form for creating products
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', createProduct);

    // Function to get a product
    async function getProduct(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(`https://localhost:7215/api/Product/${formData.get('getId')}`);

            if (!response.ok) {
                let message;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const responseBody = await response.json();
                    message = responseBody.message;
                } else {
                    message = await response.text();
                }
                throw new Error(message);
            }

            const product = await response.json();

            // Display product details
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productDescription').textContent = `Description: ${product.description}`;
            document.getElementById('productPrice').textContent = `Price: ${product.price}`;
            document.getElementById('productQuantity').textContent = `Quantity: ${product.quantity}`;

            document.getElementById('getMessage').textContent = '';
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('getMessage').textContent = error.message;
            document.getElementById('productName').textContent = '';
            document.getElementById('productDescription').textContent = ``;
            document.getElementById('productPrice').textContent = ``;
            document.getElementById('productQuantity').textContent = ``;
        }
    }

    // Function to delete a product
    async function deleteProduct(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(`https://localhost:7215/api/Product/${formData.get('productId')}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                let message;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const responseBody = await response.json();
                    message = responseBody.message;
                } else {
                    message = await response.text();
                }
                throw new Error(message);
            }

            // Refresh product list
            fetchProducts();
            document.getElementById('deleteMessage').textContent = 'Product was deleted successfully!';
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('deleteMessage').textContent = error.message;
        }
    }

    // Function to update a product
    async function updateProduct(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        try {
            const response = await fetch(`https://localhost:7215/api/Product/${formData.get('updateId')}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('updateName'),
                    description: formData.get('updateDescription'),
                    price: parseFloat(formData.get('updatePrice')),
                    quantity: parseInt(formData.get('updateQuantity'))
                })
            });

            if (!response.ok) {
                let message;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const responseBody = await response.json();
                    message = responseBody.message;
                } else {
                    message = await response.text();
                }
                throw new Error(message);
            }

            // Refresh product list
            fetchProducts();
            document.getElementById('updateMessage').textContent = 'Product updated successfully!';
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('updateMessage').textContent = error.message;
        }
    }

    // Attach event listeners to the forms for deleting and updating products

    const getForm = document.getElementById('getForm');
    getForm.addEventListener('submit', getProduct);

    const deleteForm = document.getElementById('deleteForm');
    deleteForm.addEventListener('submit', deleteProduct);

    const updateForm = document.getElementById('updateForm');
    updateForm.addEventListener('submit', updateProduct);
});
