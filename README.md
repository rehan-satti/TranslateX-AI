# TranslateX AI – Premium Language Translator

A beautiful, production-ready AI Language Translator supporting **100+ languages** with a modern glassmorphism interface, voice input/output, translation history, AI writing tools, and much more.

## ✨ Features

### Core Translation
- **100+ Languages** – Comprehensive language support
- **Auto-detect** – Automatically detect source language
- **Fast Translation** – Powered by LibreTranslate API
- **Swap Languages** – One-click language & text swap
- **Character Counter** – Live word, character, and sentence count
- **Auto-save Draft** – Never lose your work

### Voice Features
- **Voice Input** – Speak to type using Web Speech API
- **Text-to-Speech** – Listen to translations
- **Voice Translation** – Real-time voice-to-voice translation
- **TTS Controls** – Adjust speed, pitch, and volume

### History & Favorites
- **Translation History** – Local storage of last 100 translations
- **Favorites** – Bookmark important translations
- **Search** – Find translations quickly
- **Reuse** – One-click reuse of past translations
- **Export Data** – Download all your data as JSON

### AI Writing Tools
- **Rewrite** – Rephrase text with synonym substitution
- **Fix Grammar** – Correct grammar and spelling
- **Professional Tone** – Business and formal style
- **Friendly Tone** – Casual and warm
- **Formal Tone** – Official and structured
- **Academic Tone** – Scholarly writing style
- **Shorten Text** – Make it concise
- **Expand Text** – Add more detail

### Additional Tools
- **Dictionary** – Word meanings, pronunciation, synonyms, antonyms
- **Grammar Checker** – Detect and fix common grammar issues
- **Copy/Share** – One-click copy and share translations
- **Download** – Export as TXT or PDF

### UI/UX
- **Dark & Light Mode** – Beautiful themes with smooth transitions
- **Glassmorphism Design** – Modern premium interface
- **Fully Responsive** – Perfect on mobile, tablet, and desktop
- **Smooth Animations** – Elegant transitions and hover effects
- **Toast Notifications** – Non-intrusive feedback messages
- **Keyboard Shortcuts** – Ctrl+Enter to translate, Esc to close
- **Accessibility** – ARIA labels, keyboard navigation, screen reader support

## 🚀 Getting Started

### Requirements
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for translation API

### Installation

1. **Download** all files into a folder:
   - `index.html`
   - `styles.css`
   - `app.js`

2. **Open** `index.html` in your browser

3. **Start Translating!**

### No Build Process Required
This is a pure vanilla JavaScript application with no dependencies, frameworks, or build steps. Simply open `index.html` and it works!

## 📖 Usage Guide

### Basic Translation
1. Select source language (or use Auto Detect)
2. Select target language
3. Type or paste text in the source panel
4. Click **Translate** button
5. View translation in the output panel

### Voice Input
1. Click the microphone icon in the source panel
2. Grant microphone permission
3. Speak your text
4. Text will be automatically filled

### Text-to-Speech
1. Translate text first
2. Click the **Speak** button in output panel
3. Adjust speed, pitch, volume in TTS controls
4. Click **Stop** to end playback

### Voice Translation
1. Go to **Voice Translation** section
2. Click the large microphone button
3. Speak your text
4. See real-time transcription and translation

### AI Writing Tools
1. Go to **AI Writing** section
2. Paste or type your text
3. Click any AI tool card (Rewrite, Grammar, etc.)
4. View result and copy

### Dictionary Lookup
1. Go to **Dictionary** section
2. Enter a word
3. View meaning, pronunciation, synonyms, antonyms

### Grammar Checker
1. Go to **Grammar Checker** section
2. Paste your text
3. Click **Check Grammar**
4. Review suggestions

## 🎨 Customization

### Changing Default Language
Edit `app.js` lines 160-161:
```javascript
state.sourceLang = 'auto';  // Change to any language code
state.targetLang = 'en';    // Change to any language code
```

### Adding More Languages
Add language objects to the `LANGUAGES` array in `app.js`:
```javascript
{ code: 'xx', name: 'Language Name', flag: '🏳️', popular: false }
```

### Changing API Endpoint
Edit `API_ENDPOINTS` array in `app.js` (line 13):
```javascript
const API_ENDPOINTS = [
  'https://your-api-endpoint.com',
  // Add fallback endpoints
];
```

## 🔧 Technical Details

### Technology Stack
- **HTML5** – Semantic markup
- **Tailwind CSS** (CDN) – Utility-first styling
- **Vanilla JavaScript** (ES6+) – No frameworks
- **LibreTranslate API** – Translation engine
- **Web Speech API** – Voice input/output
- **LocalStorage** – Client-side data persistence
- **Dictionary API** – Word definitions

### Browser Compatibility
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Performance
- Optimized DOM updates
- Debounced API requests
- Lazy rendering
- Efficient event handling
- Fast initial load (~2MB total)

### Security
- Input sanitization
- HTTPS API calls
- No third-party tracking
- Privacy-first design
- All data stored locally

## 📁 File Structure

```
translatex-ai/
├── index.html       # Main HTML structure
├── styles.css       # Complete styling (dark/light themes)
├── app.js          # All JavaScript logic
└── README.md       # This file
```

## 🌐 API Information

### LibreTranslate
This app uses the free LibreTranslate API with multiple fallback endpoints:
- https://libretranslate.com
- https://translate.argosopentech.com
- https://libretranslate.de

**Rate Limits:** Free tier has rate limiting. For unlimited use, consider:
1. Self-hosting LibreTranslate
2. Using API key (register at libretranslate.com)
3. Using alternative APIs (Google Translate, Microsoft Translator)

### Dictionary API
- Uses free Dictionary API: https://dictionaryapi.dev
- No API key required
- English language only

## 🎯 Keyboard Shortcuts

- **Ctrl + Enter** – Translate text
- **Escape** – Close dropdown/sidebar
- **Tab** – Navigate between elements

## 📱 Mobile Support

Fully responsive design works perfectly on:
- iOS Safari
- Android Chrome
- Mobile Firefox
- All modern mobile browsers

Features adapted for mobile:
- Touch-friendly UI
- Collapsible sidebar
- Optimized layouts
- Mobile voice input

## 🐛 Troubleshooting

### Translation Not Working
1. Check internet connection
2. Try different API endpoint
3. Verify language codes are supported
4. Check browser console for errors

### Voice Input Not Working
1. Grant microphone permission
2. Use HTTPS (required for Web Speech API)
3. Check browser compatibility
4. Ensure microphone is connected

### Text-to-Speech Not Working
1. Check browser supports Web Speech API
2. Verify volume is not muted
3. Try different browser

### Data Not Saving
1. Check LocalStorage is enabled
2. Clear browser cache if corrupted
3. Export data before clearing

## 📄 License

This project is open-source and free to use for personal and commercial projects.

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📧 Support

For issues or questions, please check:
- Browser console for error messages
- Network tab for API issues
- LocalStorage in DevTools for data issues

---

**Built with ❤️ using Vanilla JavaScript**

No frameworks. No dependencies. Just pure web technologies.

**Enjoy translating!** 🌍✨
