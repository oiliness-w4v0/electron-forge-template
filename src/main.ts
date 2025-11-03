import path from 'node:path'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import started from 'electron-squirrel-startup'
import { fatal } from 'signale'
import 'dotenv/config'

if (started) {
  app.quit()
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 730,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, '../../dist/preload.js'),
    },
  })

  win.loadURL(process.env.VITE_APP_FRONTEND_URL!).catch(fatal)

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:'))
      shell.openExternal(url).catch(console.error)
    return { action: 'deny' }
  })

  win.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle('ping', async () => 'pong')
