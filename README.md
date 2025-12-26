# QuickURL - Modern URL Shortener

A modern, responsive URL shortener web application built with pure HTML, CSS, and JavaScript. This project features a clean UI with dark/light mode, URL history tracking, QR code generation, and custom alias support.

## Features

- **URL Shortening**: Shorten long URLs using public APIs with fallback mechanisms
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **History Management**: Save and manage shortened URLs in local storage
- **QR Code Generation**: Generate QR codes for shortened URLs
- **Click Tracking**: Simulated click counter for analytics
- **Custom Aliases**: Create custom short URLs (frontend simulation)
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Toast Notifications**: Success and error messages
- **Modern UI**: Clean, card-based layout with smooth animations

## Technologies Used

- HTML5
- CSS3 (with Flexbox/Grid)
- JavaScript (ES6+)
- LocalStorage API
- Fetch API
- Font Awesome Icons

## Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. The application is ready to use!

## Usage

1. Enter a long URL in the input field
2. Optionally add a custom alias
3. Click "Shorten URL" button
4. Copy, open, or generate QR code for the shortened URL
5. View your history of shortened URLs below

## Project Structure

```
/url-shortener
├── index.html          # Main HTML file
├── style.css           # CSS styles with theme support
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## API Integration

The application uses multiple public URL shortening services as fallbacks:
1. TinyURL API
2. is.gd API
3. v.gd API

If all APIs fail, the app generates a hash-based short URL as a fallback.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

This application is ready for deployment on:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## License

This project is open source and available under the MIT License.

## Author

QuickURL - A modern URL shortener solution for the modern web.