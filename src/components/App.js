import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import LogItem from './LogItem'

const App = () => {
	const [logs, setLogs] = useState([
		{
			id: 1,
			text: 'This is log one',
			priority: 'low',
			user: 'Kevin',
			created: new Date().toString(),
		},
		{
			id: 2,
			text: 'This is log two',
			priority: 'moderate',
			user: 'Alberto',
			created: new Date().toString(),
		},
		{
			id: 3,
			text: 'This is log three',
			priority: 'high',
			user: 'Romero',
			created: new Date().toString(),
		},
	])
	return (
		<Container>
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
					{ logs.map((log) => (
						<LogItem />
					)) }
				</tbody>
			</Table>
		</Container>
	)
}

export default App
