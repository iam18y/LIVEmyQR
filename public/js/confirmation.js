document.addEventListener('DOMContentLoaded', () => {
    const order = JSON.parse(localStorage.getItem('order'));
    if (order) {
        const orderId = 'ORD' + Date.now();
        document.getElementById('order-id').textContent = orderId;

        const qrCodeData = JSON.stringify({
            orderId: orderId,
            ...order
        });

        new QRCode(document.getElementById("qrcode"), {
            text: qrCodeData,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Clear the cart and order from storage
        localStorage.removeItem('cart');
        localStorage.removeItem('order');
    } else {
        // Redirect if no order data is found
        window.location.href = 'index.html';
    }
});
