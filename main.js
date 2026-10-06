const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow = null;
let isManualUpdateCheck = false;

// Configure autoUpdater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  const iconPath = process.platform === 'win32' 
    ? path.join(__dirname, 'assets', 'icon.ico')
    : path.join(__dirname, 'assets', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 880,
    minWidth: 1024,
    minHeight: 700,
    title: 'Psalms Learning Suite',
    icon: iconPath,
    backgroundColor: '#0F172A',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true
    }
  });

  // Load the central hub
  mainWindow.loadFile(path.join(__dirname, 'src', 'Psalms_Interactive_Learning_Suite.html'));

  // Open external links in default web browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  setupMenu();
}

function setupMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'Course Suite Hub',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            if (mainWindow) {
              mainWindow.loadFile(path.join(__dirname, 'src', 'Psalms_Interactive_Learning_Suite.html'));
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Print Active Page...',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.print();
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Navigation',
      submenu: [
        {
          label: 'Back',
          accelerator: isMac ? 'Cmd+[' : 'Alt+Left',
          click: () => {
            if (mainWindow && mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          }
        },
        {
          label: 'Forward',
          accelerator: isMac ? 'Cmd+]' : 'Alt+Right',
          click: () => {
            if (mainWindow && mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          }
        },
        {
          label: 'Reload Page',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload();
            }
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(process.env.NODE_ENV === 'development' ? [
          { type: 'separator' },
          { role: 'toggleDevTools' }
        ] : [])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates...',
          click: () => {
            triggerManualUpdateCheck();
          }
        },
        { type: 'separator' },
        {
          label: 'GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/gregvruggink/psalms-learning-suite');
          }
        },
        {
          label: 'Release Notes & Releases',
          click: () => {
            shell.openExternal('https://github.com/gregvruggink/psalms-learning-suite/releases');
          }
        },
        { type: 'separator' },
        {
          label: 'About Psalms Learning Suite',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Psalms Learning Suite',
              message: 'Psalms Learning Suite',
              detail: `Version: ${app.getVersion()}\n\nAn interactive desktop course suite for Hebrew poetry, form-critical hermeneutics, and exegetical study.\n\nAuthor: Greg Vruggink\nRepository: https://github.com/gregvruggink/psalms-learning-suite`,
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function triggerManualUpdateCheck() {
  if (!app.isPackaged) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Check for Updates',
      message: 'Running in Development Mode',
      detail: `Current version is ${app.getVersion()}.\nAuto-update checks are enabled in packaged releases distributed via GitHub Releases.`,
      buttons: ['OK']
    });
    return;
  }

  isManualUpdateCheck = true;
  autoUpdater.checkForUpdates().catch(err => {
    dialog.showMessageBox(mainWindow, {
      type: 'warning',
      title: 'Update Check',
      message: 'Unable to check for updates',
      detail: `Could not reach GitHub Releases server:\n${err.message}`,
      buttons: ['OK']
    });
    isManualUpdateCheck = false;
  });
}

// AutoUpdater Event Listeners
autoUpdater.on('update-available', (info) => {
  const version = info.version || 'new version';
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: `A new version of Psalms Learning Suite (${version}) is available!`,
    detail: 'Would you like to download this update in the background?',
    buttons: ['Download Update', 'Later'],
    defaultId: 0,
    cancelId: 1
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Downloading Update',
        message: 'Downloading update in the background...',
        detail: 'You can continue studying. You will be notified when the update is ready to install.',
        buttons: ['OK']
      });
    }
  });
  isManualUpdateCheck = false;
});

autoUpdater.on('update-not-available', () => {
  if (isManualUpdateCheck) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Up to Date',
      message: 'You have the latest version',
      detail: `Psalms Learning Suite v${app.getVersion()} is currently the newest version available.`,
      buttons: ['OK']
    });
  }
  isManualUpdateCheck = false;
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready to Install',
    message: 'The update has been downloaded!',
    detail: 'Would you like to restart Psalms Learning Suite now to install the update?',
    buttons: ['Restart & Install', 'Later'],
    defaultId: 0,
    cancelId: 1
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  if (isManualUpdateCheck) {
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Update Error',
      message: 'Failed to complete update check',
      detail: err.message,
      buttons: ['OK']
    });
  }
  isManualUpdateCheck = false;
});

// App Lifecycle
app.whenReady().then(() => {
  createWindow();

  // If running in packaged production build, check for updates quietly on launch
  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch(err => {
        console.log('Quiet background update check error:', err.message);
      });
    }, 3000);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for renderer access
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('check-for-updates', () => triggerManualUpdateCheck());
ipcMain.handle('navigate-hub', () => {
  if (mainWindow) {
    mainWindow.loadFile(path.join(__dirname, 'src', 'Psalms_Interactive_Learning_Suite.html'));
  }
});
