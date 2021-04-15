import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import LogItem from './LogItem'
import AddLogItem from './AddLogItem'

const App = () => {
	const [logs, setLogs] = useState([
		{
			_id: 1,
			text: 'This is log one',
			priority: 'low',
			user: 'Kevin',
			created: new Date().toString(),
		},
		{
			_id: 2,
			text: 'This is log two',
			priority: 'moderate',
			user: 'Alberto',
			created: new Date().toString(),
		},
		{
			_id: 3,
			text: 'This is log three',
			priority: 'high',
			user: 'Romero',
			created: new Date().toString(),
		},
	])

	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	})

	// Adding the data grabbed from the component to the state
	function addItem(item){

		// Validate that there is data to be added
		if (item.text === '' || item.user === '' || item.priority === ''){
			showAlert('Please fill out all fields', 'danger')
			return false
		}

		item._id = Math.floor(Math.random() * 1000) + 1000
		item.created = new Date().toString()
		setLogs([...logs, item])
		showAlert('Log Added')
	}

	// Deleting an item
	function deleteItem(_id){
		setLogs(logs.filter((item) => item._id !== _id))
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
