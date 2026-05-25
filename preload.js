const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('notchflowAPI', {
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  windowMoveDelta: (data) => ipcRenderer.send('window-move-delta', data),
  toggleDeepWork: (enable) => ipcRenderer.send('toggle-deep-work', enable),
  onSystemIdleTime: (callback) => ipcRenderer.on('system-idle-time', (event, idleTime) => callback(idleTime))
});
