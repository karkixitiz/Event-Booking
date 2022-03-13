# Event Booking

Designing Full stack Event Booking web Application.

## Features

### GraphQL API
	- Schemas and Resolvers
	- npm i express-graphql graphql
### React SAP

### Mongodb
	- npm install mongoose --save
### Node/Express
	- npm i express bodyParser
	- npm i --save-dev nodemon

## GraphiQL  Script
- Get all Events list
	query{
	events {
		title
		price
		
	}
	}

- Create an Event
	mutation{createEvent(eventInput:{title:"test",description:"test desc", price:23.99,date:"2020-12-06T09:26:30.645Z"}){
	title
	description
	}
	}

-Create a User
	mutation{
	createUser(userInput:{email:"karkikiran714@gmail.com",password:"test123"}){
		email
		password
	}
	}