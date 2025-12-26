// URL Shortener Application
class URLShortener {
    constructor() {
        this.initializeElements();
        this.loadHistory();
        this.setupEventListeners();
        this.checkTheme();
    }

    initializeElements() {
        // Main elements
        this.urlInput = document.getElementById('urlInput');
        this.shortenBtn = document.getElementById('shortenBtn');
        this.customAlias = document.getElementById('customAlias');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.resultSection = document.getElementById('resultSection');
        this.shortUrl = document.getElementById('shortUrl');
        this.copyBtn = document.getElementById('copyBtn');
        this.openBtn = document.getElementById('openBtn');
        this.qrBtn = document.getElementById('qrBtn');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.toastContainer = document.getElementById('toastContainer');
        
        // Modal elements
        this.qrModal = document.getElementById('qrModal');
        this.closeModal = document.getElementById('closeModal');
        this.qrCodeContainer = document.getElementById('qrCodeContainer');
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                // For demo purposes, scroll to section
                if (target !== '#') {
                    const section = document.querySelector(target);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // URL shortening
        this.shortenBtn.addEventListener('click', () => {
            this.handleShortenURL();
        });

        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleShortenURL();
            }
        });

        // Result actions
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard(this.shortUrl.textContent);
        });

        this.openBtn.addEventListener('click', () => {
            this.openInNewTab(this.shortUrl.textContent);
        });

        this.qrBtn.addEventListener('click', () => {
            this.generateQRCode(this.shortUrl.textContent);
        });

        // History actions
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });

        // Modal
        this.closeModal.addEventListener('click', () => {
            this.qrModal.style.display = 'none';
        });

        // Close modal when clicking outside
        this.qrModal.addEventListener('click', (e) => {
            if (e.target === this.qrModal) {
                this.qrModal.style.display = 'none';
            }
        });
    }

    checkTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const themeToggle = document.getElementById('themeToggle');
            themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    async handleShortenURL() {
        const longURL = this.urlInput.value.trim();
        const alias = this.customAlias.value.trim();

        if (!longURL) {
            this.showToast('Please enter a URL', 'error');
            return;
        }

        if (!this.validateURL(longURL)) {
            this.showToast('Please enter a valid URL', 'error');
            return;
        }

        this.showLoading(true);

        try {
            let shortURL;
            if (alias) {
                // If custom alias is provided, create a custom short URL
                shortURL = await this.createCustomURL(longURL, alias);
            } else {
                // Use public API to shorten URL
                shortURL = await this.shortenWithAPI(longURL);
            }

            if (shortURL) {
                this.displayResult(shortURL);
                this.saveToHistory(longURL, shortURL);
                this.showToast('URL shortened successfully!', 'success');
            } else {
                this.showToast('Failed to shorten URL', 'error');
            }
        } catch (error) {
            console.error('Error shortening URL:', error);
            this.showToast('Error: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async shortenWithAPI(longURL) {
        // Using multiple fallback APIs for URL shortening
        const apis = [
            // First try TinyURL
            () => fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`).then(r => r.text()),
            // Fallback to is.gd
            () => fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longURL)}`).then(r => r.text()),
            // Fallback to vgd
            () => fetch(`https://v.gd/create.php?format=simple&url=${encodeURIComponent(longURL)}`).then(r => r.text())
        ];
        
        for (const apiCall of apis) {
            try {
                const result = await apiCall();
                if (result && result.startsWith('http')) {
                    return result;
                }
            } catch (error) {
                console.warn('API failed:', error.message);
            }
        }
        
        // If all APIs fail, use fallback method
        return this.createFallbackURL(longURL);
    }

    async createCustomURL(longURL, alias) {
        // For custom alias, we'll simulate by creating a custom URL
        // In a real implementation, this would require a backend
        // For this frontend-only version, we'll store it in localStorage
        const domain = window.location.origin;
        const customURL = `${domain}/${alias}`;
        
        // Store the mapping in localStorage
        let customMappings = JSON.parse(localStorage.getItem('customMappings') || '{}');
        customMappings[customURL] = longURL;
        localStorage.setItem('customMappings', JSON.stringify(customMappings));
        
        return customURL;
    }

    createFallbackURL(longURL) {
        // Create a simple hash-based short URL for demonstration
        const hash = this.generateHash(longURL);
        const domain = window.location.origin;
        return `${domain}/s/${hash}`;
    }

    generateHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    displayResult(shortURL) {
        this.shortUrl.textContent = shortURL;
        this.resultSection.style.display = 'block';
        
        // Auto-select the shortened URL for easy copying
        this.shortUrl.select && this.shortUrl.select();
    }

    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        this.shortenBtn.disabled = show;
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('URL copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('URL copied to clipboard!', 'success');
        });
    }

    openInNewTab(url) {
        window.open(url, '_blank');
    }

    async generateQRCode(url) {
        try {
            // Using a QR code API
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
            this.qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;
            this.qrModal.style.display = 'flex';
        } catch (error) {
            this.showToast('Failed to generate QR code', 'error');
        }
    }

    saveToHistory(longURL, shortURL) {
        const history = this.getHistory();
        const newItem = {
            id: Date.now(),
            longURL: longURL,
            shortURL: shortURL,
            date: new Date().toISOString(),
            clicks: 0 // Simulated click counter
        };
        
        history.unshift(newItem);
        localStorage.setItem('urlHistory', JSON.stringify(history));
        this.updateHistoryDisplay();
    }

    getHistory() {
        const history = localStorage.getItem('urlHistory');
        return history ? JSON.parse(history) : [];
    }

    loadHistory() {
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const history = this.getHistory();
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">No shortened URLs yet</p>';
            return;
        }

        history.forEach(item => {
            const historyItem = this.createHistoryItem(item);
            this.historyList.appendChild(historyItem);
        });
    }

    createHistoryItem(item) {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="original-url">Original: ${item.longURL}</div>
            <div class="short-url"><a href="${item.shortURL}" target="_blank">${item.shortURL}</a></div>
            <div class="history-meta">
                <div class="history-date">${new Date(item.date).toLocaleString()}</div>
                <div class="history-stats">
                    <div class="click-count">
                        <i class="fas fa-mouse"></i> Clicks: ${item.clicks}
                    </div>
                </div>
                <div class="history-actions">
                    <button class="copy-history-btn" onclick="urlShortener.copyToClipboard('${item.shortURL}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <button class="delete-btn" onclick="urlShortener.deleteHistoryItem(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    deleteHistoryItem(id) {
        let history = this.getHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem('urlHistory', JSON.stringify(history));
        this.updateHistoryDisplay();
        this.showToast('URL removed from history', 'info');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history?')) {
            localStorage.removeItem('urlHistory');
            this.updateHistoryDisplay();
            this.showToast('History cleared', 'info');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            ${message}
        `;
        
        this.toastContainer.appendChild(toast);
        
        // Remove toast after animation
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Add click tracking functionality
    addClickTracking() {
        // Use event delegation to track clicks on dynamically added links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.short-url a')) {
                e.preventDefault();
                const url = e.target.closest('.short-url a').href;
                
                let history = this.getHistory();
                const item = history.find(h => h.shortURL === url);
                
                if (item) {
                    item.clicks = (item.clicks || 0) + 1;
                    localStorage.setItem('urlHistory', JSON.stringify(history));
                    this.updateHistoryDisplay();
                    
                    // Actually open the URL in a new tab
                    window.open(url, '_blank');
                }
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.urlShortener = new URLShortener();
    window.urlShortener.addClickTracking();
});
