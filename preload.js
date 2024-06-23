const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDirectory: async () => await ipcRenderer.invoke('dialog:openDirectory')
});
