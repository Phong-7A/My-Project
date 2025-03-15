if (typeof Html5QrcodeScanner === 'undefined') {
    console.error("Html5QrcodeScanner is not loaded. Please check if html5-qrcode.min.js is correctly placed in the same directory as this file.");
    document.getElementById('qr-result').innerHTML = `Error: QR Scanner library not loaded. Please ensure the file 'html5-qrcode.min.js' is in the correct directory.`;
    document.getElementById('qr-result').classList.add('show');
} else {
    let html5QrcodeScanner = null;

    function isValidUrl(string) {
        try {
            const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?[\w=&-]*)?(#[\w-]*)?$/i;
            return urlPattern.test(string);
        } catch (e) {
            return false;
        }
    }

    function normalizeUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    }

    function createVisitButton(url, container) {
        const normalizedUrl = normalizeUrl(url);
        const visitBtn = document.createElement('button');
        visitBtn.className = 'qr-btn visit-btn';
        visitBtn.textContent = 'Visit Website';
        visitBtn.onclick = () => {
            window.open(normalizedUrl, '_blank');
        };
        container.appendChild(visitBtn);
    }

    function startScanner() {
        const qrReader = document.getElementById('qr-reader');
        const qrResult = document.getElementById('qr-result');
        const startBtn = document.querySelector('.qr-btn');
        const stopBtn = document.querySelector('.stop-btn');

        if (!qrReader || !qrResult || !startBtn || !stopBtn) {
            console.error("Required elements not found:", { qrReader, qrResult, startBtn, stopBtn });
            qrResult.innerHTML = `Error: Required elements not found. Please check the page structure.`;
            qrResult.classList.add('show');
            return;
        }

        if (!html5QrcodeScanner) {
            try {
                html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', {
                    fps: 10,
                    qrbox: 250,
                    rememberLastUsedCamera: true
                });

                html5QrcodeScanner.render(
                    (result) => {
                        qrResult.innerHTML = `Scanned Result: <strong>${result}</strong>`;
                        qrResult.classList.add('show');

                        if (isValidUrl(result)) {
                            createVisitButton(result, qrResult);
                        }

                        stopScanner();
                        console.log("Scan successful:", result);
                    },
                    (err) => {
                        console.error("Scanner error:", err);
                        qrResult.innerHTML = `Error: Unable to scan. Details: ${err}`;
                        qrResult.classList.add('show');
                    }
                );

                startBtn.style.display = 'none';
                stopBtn.style.display = 'block';
                console.log("Scanner started successfully.");
            } catch (err) {
                console.error("Error starting scanner:", err);
                qrResult.innerHTML = `Error: Failed to start scanner. Details: ${err.message}. Please allow camera access and try again.`;
                qrResult.classList.add('show');
            }
        } else {
            console.log("Scanner is already running.");
        }
    }

    function stopScanner() {
        const qrResult = document.getElementById('qr-result');
        const startBtn = document.querySelector('.qr-btn');
        const stopBtn = document.querySelector('.stop-btn');

        if (html5QrcodeScanner) {
            try {
                html5QrcodeScanner.clear();
                html5QrcodeScanner = null;
                startBtn.style.display = 'block';
                stopBtn.style.display = 'none';
                qrResult.classList.remove('show');
                console.log("Scanner stopped successfully.");
            } catch (err) {
                console.error("Error stopping scanner:", err);
                qrResult.innerHTML = `Error: Failed to stop scanner. Details: ${err.message}`;
                qrResult.classList.add('show');
            }
        }
    }

    function scanFromImage(event) {
        const file = event.target.files[0];
        const imageResult = document.getElementById('image-result');
        const qrImagePreview = document.getElementById('qr-image-preview');

        if (!file) {
            imageResult.innerHTML = `Error: No file selected.`;
            imageResult.classList.add('show');
            console.error("No file selected.");
            return;
        }

        const fileUrl = URL.createObjectURL(file);
        const imgElement = document.createElement('img');
        imgElement.src = fileUrl;
        imgElement.alt = "Uploaded QR Code";
        qrImagePreview.innerHTML = '';
        qrImagePreview.appendChild(imgElement);
        qrImagePreview.classList.add('show');

        const html5Qrcode = new Html5Qrcode("qr-reader");
        html5Qrcode.scanFile(file, true)
            .then(result => {
                imageResult.innerHTML = `Scanned Result: <strong>${result}</strong>`;
                imageResult.classList.add('show');

                if (isValidUrl(result)) {
                    createVisitButton(result, imageResult);
                }

                console.log("Scan successful:", result);
            })
            .catch(err => {
                console.error("Error scanning file:", err);
                imageResult.innerHTML = `Error: Unable to scan the QR code. Details: ${err.message}`;
                imageResult.classList.add('show');
            })
            .finally(() => {
                html5Qrcode.clear();
                URL.revokeObjectURL(fileUrl);
            });
    }
}