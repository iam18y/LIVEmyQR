document.getElementById('send-otp').addEventListener('click', async () => {
    const mobile = document.getElementById('mobile').value;
    if (!/^\d{10}$/.test(mobile)) {
        return alert('Please enter a valid 10-digit mobile number.');
    }

    const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('otp-screen').style.display = 'block';
    } else {
        alert(result.message);
    }
});

document.getElementById('verify-otp').addEventListener('click', async () => {
    const mobile = document.getElementById('mobile').value;
    const otp = document.getElementById('otp').value;

    const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
    });

    const result = await response.json();
    if (result.success) {
        localStorage.setItem('user', JSON.stringify({ mobile, verified: true }));
        window.location.href = 'menu.html';
    } else {
        alert(result.message);
    }
});
