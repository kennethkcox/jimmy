# Contributing to Jimmy

First off, thank you for considering contributing to Jimmy! 

## How to Contribute

### 1. Reporting Bugs
If you find a bug, please open an issue and include:
- Your operating system version.
- Steps to reproduce the issue.
- Expected behavior vs actual behavior.

### 2. Suggesting Enhancements
We love new ideas! If you have a feature request:
- Open an issue describing the feature.
- Explain how it fits the "minimalist productivity" vision of Jimmy.

### 3. Submitting Pull Requests
1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3. Make your changes.
4. Run the test suite: `npm test`. **All tests must pass.**
5. Commit your changes (`git commit -m 'Add amazing feature'`).
6. Push to the branch (`git push origin feature/amazing-feature`).
7. Open a Pull Request!

## Development Guidelines
- **Security:** Do not modify `main.js` to enable `nodeIntegration` or disable `contextIsolation`. All IPC communication must pass through `preload.js`.
- **Aesthetics:** This app aims for a Braun-inspired minimalist aesthetic. Stick to the existing color palette (off-whites, `#1e1e1e`, `#ff9f0a`, `#32d74b`).
- **Logic:** Core timer logic must be pure JS and unit-tested in `timer.test.js`.
