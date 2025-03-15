let qrCodeCanvas = null;
function generateQR() {
    const qrText = document.getElementById('qr-text').value;
    const qrcode = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('download-btn');
    qrcode.innerHTML = '';

    if (qrText) {
        qrCodeCanvas = new QRCode(qrcode, {
            text: qrText,
            width: 200,
            height: 200,
            colorDark: '#2c3e50',
            colorLight: '#ecf0f1'
        });

        setTimeout(() => {
            qrcode.style.opacity = '1';
            downloadBtn.style.display = 'block'; 
        }, 100);
    } else {
        alert('Please enter some text or URL!');
        downloadBtn.style.display = 'none';
    }
}

function downloadQR() {
    if (qrCodeCanvas) {
                const canvas = document.querySelector('#qrcode canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else {
            alert('Please generate a QR code first!');
        }
    }
}