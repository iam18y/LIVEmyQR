const menuContainer = document.getElementById('menu-container');
let cart = JSON.parse(localStorage.getItem('cart')) || {};

async function fetchAndRenderMenu() {
    const response = await fetch('/api/menu');
    const menu = await response.json();
    menuContainer.innerHTML = ''; // Clear existing menu
    for (const category in menu) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h2>${category}</h2>`;
        menu[category].forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            const quantity = cart[item.name] ? cart[item.name].quantity : 0;
            itemCard.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <p>${item.description}</p>
                </div>
                <button data-name="${item.name}" data-price="${item.price}">
                    ${quantity > 0 ? `+ ${quantity} -` : 'Add'}
                </button>
            `;
            categoryDiv.appendChild(itemCard);
        });
        menuContainer.appendChild(categoryDiv);
    }
}

function updateCartInStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

menuContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const itemName = e.target.dataset.name;
        if (cart[itemName]) {
            cart[itemName].quantity++;
        } else {
            cart[itemName] = { price: e.target.dataset.price, quantity: 1 };
        }
        updateCartInStorage();
        updateCartFAB();
        renderMenu(); // Re-render to update button text/state
    }
});

function updateCartFAB() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        const cartFab = document.getElementById('cart-fab');
        if (cartFab) {
            cartFab.querySelector('span').textContent = totalItems;
        }
    }
}

// Initial render
renderMenu();
updateCartFAB();
