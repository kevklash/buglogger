import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem'
import AddLogItem from './AddLogItem'
import { ipcRenderer } from 'electron'

const App = () => {
	const [logs, setLogs] = useState([])

	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	})

	// Sending event to the main process through the IPC rendederer, it will be caught in main.js
	// Passing [] empty array as there are no dependencies, to run each time based on the dependency changes
	useEffect(() =>{
		ipcRenderer.send('logs:load')

		// Receiving the logs from main window
		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs))
		})

		// Catching the "clear all logs" event
		ipcRenderer.on('logs:clear', () => {
			setLogs([])
			showAlert('All logs were removed.')
		})
	}, [])

	// Adding the data grabbed from the component to the state
	function addItem(item){

		// Validate that there is data to be added
		if (item.text === '' || item.user === '' || item.priority === ''){
			showAlert('Please fill out all fields', 'danger')
			return false
		}

		/*item._id = Math.floor(Math.random() * 1000) + 1000
		item.created = new Date().toString()
		setLogs([...logs, item])*/

		// Sending an event to the main process with the added log\
		ipcRenderer.send('logs:add', item)

		showAlert('Log Added')
	}

	// Deleting an item
	function deleteItem(_id){
		// setLogs(logs.filter((item) => item._id !== _id))
		//Sending the event witht the _id to delete the correct log
		ipcRenderer.send('logs:delete', _id)
		showAlert('Log Removed')
	}

	// Showing the alert and then hiding it after 3 seconds
	function showAlert(message, variant = 'success', seconds = 3000) {
		setAlert({
			show: true,
			message,
			variant
		})
		setTimeout(() => {
			setAlert({
				show: false,
				message: '',
				variant: ''
			})
		}, seconds)
	}

	return (
		<Container>
			<AddLogItem addItem={addItem} />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>Priotity</th>
						<th>Log Text</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{logs.map((log) => (
						<LogItem key={log._id} log={log} deleteItem={deleteItem}/>
					)) }
				</tbody>
			</Table>
		</Container>
	)
}

export default App
