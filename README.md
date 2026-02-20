## Arabic Learning App

An interactive, browser‑based app to help beginners learn the Arabic script and basic Quranic content. It focuses on practical reading skills with audio support, spaced practice, and gentle progress tracking.

### Features
- Learn the full Arabic alphabet with details and audio for each letter
- Practice harakat (short vowels) and how they change letter sounds
- Build vocabulary through categorized word lists with favorites
- Explore short surahs with audio playback
- Learn and review common duas
- Tajweed basics and tips for correct pronunciation
- Flashcards, quizzes, and tracing exercises
- Daily streak and progress tracking

### Tech Stack
- Vanilla HTML, CSS, and JavaScript
- No build tools or backend; everything runs in the browser
- Optional use of the browser Speech Synthesis API for text‑to‑speech

### Project Structure
- `index.html` – Main entry point and layout shell
- `styles/main.css` – Global styling for the app
- `js/app.js` – App bootstrap, event wiring, and high‑level UI behavior
- `js/core/` – Core utilities (state, text‑to‑speech, helpers)
- `js/data/` – Static data: alphabet, harakat, words, duas, surahs, tajweed, tips
- `js/modules/` – Feature modules (alphabet, tracing, flashcards, quiz, progress, UI, etc.)

### Getting Started
1. Clone or download this repository.
2. Open the project folder:
   ```bash
   cd arabic-learning-app
   ```
3. Start a simple static server from the project root, for example:
   ```bash
   # Option 1: Python 3
   python -m http.server 8000

   # Option 2: Node (if you have `serve` installed)
   npx serve .
   ```
4. In your browser, open:
   ```text
   http://localhost:8000/index.html
   ```

You can also open `index.html` directly in a browser, but using a local server is recommended for consistent behavior with all features.

### Development Notes
- JavaScript modules are loaded directly via `<script type="module">` from `index.html`.
- Most user interactions are handled centrally in `js/app.js` and delegated to modules in `js/modules/`.
- Text‑to‑speech depends on the voices available in the user's browser/OS.

### Contributing
Improvements and new learning activities are welcome. Some possible directions:
- Expanding word lists, duas, and surahs
- Adding more interactive exercises or games
- Enhancing accessibility and mobile layout

