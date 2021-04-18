const path = require('path')
const url = require('url')
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const connectDB = require('./config/db')
const Log = require('./models/Log')

// Connect to DB
connectDB()

let mainWindow

let isDev = false
// If on Mac
const isMac = process.platform === 'darwin' ? true : false

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: isDev ? 1200 : 1100,
		height: 800,
		backgroundColor: 'white',
		show: false,
		icon: `${__dirname}/assets/icon.png`,
		webPreferences: {
			nodeIntegration: true,
		},
	})

	let indexPath

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath)

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()

		// Open devtools if dev
		if (isDev) {
			const {
				default: installExtension,
				REACT_DEVELOPER_TOOLS,
			} = require('electron-devtools-installer')

			installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
				console.log('Error loading React DevTools: ', err)
			)
			mainWindow.webContents.openDevTools()
		}
	})

	mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', () => {
	createMainWindow()

	// Implementing the menu
	const mainMenu = Menu.buildFromTemplate(menu)
	Menu.setApplicationMenu(mainMenu)
})

// Creating a Menu
const menu = [
	...(isMac ? [{ role: 'appMenu' }] : []),
	{
		role: 'fileMenu'
	},
	{
		role: 'editMenu'
	},
	{
		label: 'Logs',
		submenu: [
			{
				label: 'Clear all logs',
				click: () => clearLogs(),
			}
		]
	},
	...(isDev ? [
		{
			label: 'Developer',
			submenu: [
				{ role: 'reload' },
				{ role: 'forceReload' },
				{ type: 'separator' },
				{ role: 'toggledevtools' }
			]
		}
	] : [])
]

// Catching the event sent from IPC
ipcMain.on('logs:load', sendLogs)

// Catching the event with the log/item added to create it in the DB
ipcMain.on('logs:add', async (e, item) => {
	// console.log(item)
	try {
		await Log.create(item)
		// Sending the logs again to reload the in the UI
		sendLogs()
	} catch (error) {
		console.log(error)
	}
})

// Catching the event with the log/item removed to delete it from the DB
ipcMain.on('logs:delete', async (e, id) => {
	try {
		await Log.findOneAndDelete({ _id: id })
		// Sending the logs again to reload the in the UI
		sendLogs()
	} catch (error) {
		console.log(error)		
	}
})

// Fetching the data and sending the event with the data back to the renderer
async function sendLogs(){
	try {
		const logs = await Log.find().sort({ created: 1 })
		// Sending the retrieved logs back to the renderer
		mainWindow.webContents.send('logs:get', JSON.stringify(logs))
	} catch (error) {
		console.log(error)
	}
}

// Clear all logs
async function clearLogs() {
	try {
		// Delete all records in the table
		await Log.deleteMany({})
		mainWindow.webContents.send('logs:clear')
		// No need to sendLogs() as logs are not defined anymore, we just need to catch the event
	} catch (error) {
		console.log(error)
	}
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
})

// Stop error
app.allowRendererProcessReuse = true
