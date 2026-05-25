# Jimmy

A beautiful, transparent productivity widget for Windows, inspired by macOS Dynamic Island and Braun industrial design. 

Jimmy floats seamlessly on your desktop, helping you maintain deep focus without distraction.

## Features

- **Pomodoro Timer:** A standard 25/5 minute timer right on your desktop.
- **Deep Work Mode:** A full-screen ambient "Burn Down" frame that gradually shrinks as your focus session completes.
- **Activity Sparkline:** Monitors your system idle time and displays an ambient sparkline of your activity.
- **Flow Visualizer:** A subtle particle system that visually reinforces your flow state.
- **Transparent & Click-Through:** By default, the island ignores mouse events so you can work normally right through it. Simply hover over it to interact.

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kennethkcox/jimmy.git
   cd jimmy
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## Development

The project uses a secure Electron architecture (`contextIsolation: true`, `nodeIntegration: false`) with a typed IPC bridge in `preload.js`.

To run the unit test suite (Jest):
```bash
npm test
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests and report issues.

## License
MIT License. See [LICENSE](LICENSE) for details.
