const cartContainer = document.getElementById('cart-container');
const subtotalEl = document.getElementById('subtotal');
const taxesEl = document.getElementById('taxes');
const grandTotalEl = document.getElementById('grand-total');

let cart = JSON.parse(localStorage.getItem('cart')) || {};

function renderCart() {
    cartContainer.innerHTML = '';
    let subtotal = 0;
    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        for (const itemName in cart) {
            const item = cart[itemName];
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${itemName} (x${item.quantity})</p>
                <p>₹${itemTotal}</p>
                <button data-name="${itemName}">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
        }
    }
    const taxes = subtotal * 0.18; // Example 18% tax
    const grandTotal = subtotal + taxes;

    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    taxesEl.textContent = `₹${taxes.toFixed(2)}`;
    grandTotalEl.textContent = `₹${grandTotal.toFixed(2)}`;
}

cartContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const itemName = e.target.dataset.name;
        delete cart[itemName];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
});


async function placeOrder(paymentMethod) {
    const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cart,
            total: grandTotalEl.textContent,
            paymentMethod
        })
    });
    const result = await response.json();
    if (result.success) {
        localStorage.setItem('order', JSON.stringify({ orderId: result.orderId, ...cart }));
        window.location.href = 'confirmation.html';
    } else {
        alert('Failed to place order.');
    }
}


document.getElementById('pay-counter').addEventListener('click', () => placeOrder('Counter'));

document.getElementById('pay-online').addEventListener('click', () => {
    alert('Simulating online payment...');
    placeOrder('Online');
});


renderCart();
