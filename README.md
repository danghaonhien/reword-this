# Reword This - Chrome Extension

AI-Powered Text Rewriting Chrome Extension that rewrites selected text in various tones.

## Features

- **Right-click to Reword** - Highlight text on any website and right-click to reword it
- **Multiple Tones** - Choose from Clarity, Friendly, Formal, and more
- **"Surprise Me" Mode** - Get random creative tones for your text
- **XP and Streak System** - Earn XP and build a streak by rewriting text daily
- **Privacy-First** - All data stored locally, no server-side logs

## Installation (Development)

1. Clone this repository:
```bash
git clone https://github.com/yourusername/reword-this.git
cd reword-this
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer Mode" at the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

Run the development server:
```bash
npm run dev
```

This will allow you to test the UI in your browser at `http://localhost:5173/`.

## Usage

1. Highlight any text on a webpage
2. Right-click and select "Reword This"
3. Choose a tone or click "Surprise Me"
4. Copy the rewritten text or use the Replace button

## Privacy

- All user data is stored locally in your browser
- No text is logged or stored on any external servers
- The extension does not track your browsing history

## License

MIT 