function isValidUrl(string) {
    try {
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\?[\w=&-]*)?(#[\w-]*)?$/i;
        return urlPattern.test(string);
    } catch (e) {
        return false;
    }
}

async function shortenUrlWithTinyURL(originalUrl) {
    try {
        if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
            originalUrl = 'https://' + originalUrl;
        }

        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const shortUrl = await response.text();
        if (!shortUrl || shortUrl.includes('Error')) {
            throw new Error('TinyURL API returned an error.');
        }

        return shortUrl;
    } catch (error) {
        console.error('Error shortening URL:', error);
        throw error;
    }
}

async function shortenUrl() {
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

    try {
        const shortUrl = await shortenUrlWithTinyURL(originalUrl);

        shortenedResult.innerHTML = `Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
        shortenedResult.classList.add('show');

        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = async () => {
            try {
                if (!navigator.clipboard) {
                    throw new Error('Clipboard API not supported in this browser.');
                }

                await navigator.clipboard.writeText(shortUrl);
                
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.disabled = true;
                copyBtn.style.opacity = '0.6';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.disabled = false;
                    copyBtn.style.opacity = '1';
                }, 2000);

                alert('URL copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy:', error);
                alert(`Failed to copy URL: ${error.message}. Try manually copying the link.`);
            }
        };
        shortenedResult.appendChild(copyBtn);
    } catch (error) {
        shortenedResult.innerHTML = `Error: Failed to shorten URL. ${error.message}`;
        shortenedResult.classList.add('show');
    }
}