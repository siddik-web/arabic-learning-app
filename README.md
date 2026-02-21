## Arabic Learning App

An interactive, browser‑based app to help beginners learn the Arabic script and basic Quranic content. It focuses on practical reading skills with audio support, spaced practice, and gentle progress tracking.

### Live Preview
You can try out the app live at: [Arabic Learning App](https://siddik-web.github.io/arabic-learning-app/)

### Features
- **Arabic Alphabet**: Learn the full 28 letters with details and audio for each.
- **Harakat**: Practice short vowels and how they change letter sounds.
- **Vocabulary**: 100+ Quranic words categorized by type (Allah's names, verbs, nouns, etc.) with a favorites system.
- **Surahs**: Explore short surahs with full audio playback.
- **Duas**: Daily prayers with audio support and favorites.
- **Tracing**: Interactive canvas for practicing letter writing with dotted guides.
- **Quizzes**: Test your knowledge with multiple quiz modes (Letter → Name, Name → Letter, Word → Meaning).
- **Progress Tracking**: Daily streaks, XP, achievements, and progress visualization.

### Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES Modules).
- **Audio**: Web Speech API (Text‑to‑Speech) for dynamic pronunciation.
- **Storage**: Browser `localStorage` for saving progress and favorites.
- **Offline Support**: Designed to work as a static application.

### Text-to-Speech (TTS) System
The app uses a robust, custom-built TTS wrapper (`js/core/tts.js`) optimized for Arabic learning:
- **Auto-Initialization**: Pre-loads voices asynchronously for Chrome/Android compatibility.
- **Voice Selection**: Automatically prioritizes high-quality Arabic voices across Windows, Android, iOS, and macOS.
- **Debouncing**: Prevents audio overlapping during rapid user interaction.
- **Error Handling**: Graceful fallbacks when specific voices are unavailable.

#### Troubleshooting Audio
If you don't hear any audio, please check the following:
1. **System Volume**: Ensure your device volume is up and not muted.
2. **Arabic Voice Data**: Your OS might need Arabic speech data installed:
   - **Android**: Settings -> Languages & Input -> Text-to-speech output -> Preferred engine (Gear) -> Install voice data -> Arabic.
   - **Windows**: Settings -> Time & Language -> Speech -> Manage voices -> Add voices -> Arabic.
   - **Browsers**: Use modern browsers like Chrome, Edge, or Safari for the best experience.

### Project Structure
- `index.html` – Main entry point and layout shell.
- `styles/main.css` – Global styling and responsive UI.
- `js/app.js` – Central orchestration and event delegation.
- `js/core/` – Core systems (state management, TTS, utilities).
- `js/data/` – Content database (alphabet, words, surahs, etc.).
- `js/modules/` – Feature-specific logic (quiz, tracing, progress).

### Getting Started
1. Clone or download this repository.
2. Open the project folder:
   ```bash
   cd arabic-learning-app
   ```
3. Start a simple static server:
   ```bash
   # Option 1: Python 3
   python -m http.server 8000
   ```
4. In your browser, open: `http://localhost:8000`

### Development Notes
- **ES Modules**: JavaScript is structured using native modules.
- **Event Delegation**: Clicks are handled centrally in `app.js` for performance.
- **State**: `state.js` handles persistent data across sessions.

### Contributing
Improvements and new learning activities are welcome. Feel free to expand the curated data in `js/data/` or enhance the interactive modules.

