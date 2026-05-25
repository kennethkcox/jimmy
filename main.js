const { app, BrowserWindow, ipcMain, screen, Tray, Menu, nativeImage, powerMonitor } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: Math.floor(width / 2) - 200,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  createWindow();

  // Create Tray
  const iconBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZKAQMFKon2HUAIbRMAiGQTAMgngE0+zQjIA/Y0Mw2hjE0IAmJjG0kGgAADOFAgE8o3uQAAAAAElFTkSuQmCC';
  const icon = nativeImage.createFromDataURL(iconBase64);
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Notchflow', click: () => mainWindow.show() },
    { label: 'Hide Notchflow', click: () => mainWindow.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Notchflow');
  tray.setContextMenu(contextMenu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const idleTime = powerMonitor.getSystemIdleTime();
      mainWindow.webContents.send('system-idle-time', idleTime);
    }
  }, 1000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handler to resize the window dynamically from the renderer
ipcMain.on('resize-window', (event, { width, height }) => {
  if (mainWindow) {
    const display = screen.getPrimaryDisplay();
    const x = Math.floor(display.workAreaSize.width / 2) - Math.floor(width / 2);
    mainWindow.setBounds({ x: x, y: 0, width: width, height: height });
  }
});

ipcMain.on('set-ignore-mouse-events', (event, ignore) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(ignore, { forward: true });
  }
});

ipcMain.on('window-move-delta', (event, { deltaX, deltaY }) => {
  if (mainWindow) {
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: bounds.x + deltaX,
      y: bounds.y + deltaY,
      width: bounds.width,
      height: bounds.height
    });
  }
});

let isDeepWork = false;
let normalBounds = null;

ipcMain.on('toggle-deep-work', (event, enable) => {
  if (mainWindow) {
    isDeepWork = enable;
    if (enable) {
      normalBounds = mainWindow.getBounds();
      const display = screen.getPrimaryDisplay();
      mainWindow.setResizable(true);
      mainWindow.setBounds(display.workArea);
    } else {
      if (normalBounds) {
        mainWindow.setBounds(normalBounds);
        mainWindow.setResizable(false);
      }
    }
  }
});
