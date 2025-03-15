function generateShortUrl(originalUrl) {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `http://short.url/${randomString}`;
}

function isValidUrl(string) {
    try {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?[\w=&-]*)?(#[\w-]*)?$/i;
        return urlPattern.test(string);
    } catch (e) {
        return false;
    }
}

function shortenUrl() {
    const urlInput = document.getElementById('url-input');
    const shortenedResult = document.getElementById('shortened-result');

    shortenedResult.innerHTML = '';

    const originalUrl = urlInput.value.trim();
    if (!originalUrl) {
        shortenedResult.innerHTML = `Error: Please enter a URL.`;
        shortenedResult.classList.add('show');
        return;
    }

    if (!isValidUrl(originalUrl)) {
        shortenedResult.innerHTML = `Error: Invalid URL. Please enter a valid URL (e.g., https://example.com).`;
        shortenedResult.classList.add('show');
        return;
    }

    const shortUrl = generateShortUrl(originalUrl);
    shortenedResult.innerHTML = `Shortened URL: <strong>${shortUrl}</strong>`;
    shortenedResult.classList.add('show');

    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(shortUrl).then(() => {
            alert('URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy URL.');
        });
    };
    shortenedResult.appendChild(copyBtn);
}