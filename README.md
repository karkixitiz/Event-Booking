# Event Booking

Designing Full stack Event Booking web Application.

## Features

### GraphQL API
	- Schemas and Resolvers
	- npm i express-graphql graphql
### React SAP
	- npm install react-router-dom@5.2.0
### Mongodb
	- npm install mongoose --save
### Node/Express
	- npm i express bodyParser
	- npm i --save-dev nodemon

## GraphiQL  Script
- Get all Events only
	query{
	events {
		title
		price
	}
	}
- Get Events with user's detail
	query{
		events{
					creator{
						email
						createdEvents{
							title
							creator{
							email
							}
						}
				}
			}
	}
- Get user and event details through booking id
query{
  bookings{
    _id
    createdAt
    event{
      title
      creator{
        email
      }
    }
  }
}
 - Cancel Booking
 mutation{
  cancelBooking(bookingId:"622f05636afd7199db78a94c"){
    title
    creator{
      email
    }
  }
}
- Create an Event and return event's details
	mutation{createEvent(eventInput:{title:"test",description:"test desc", price:23.99,date:"2020-12-06T09:26:30.645Z"}){
	title
	description
	}
	}
- Create an Event and return event's with user detail
	mutation{createEvent(eventInput:{title:"test",description:"test desc", price:23.99,date:"2020-12-06T09:26:30.645Z"}){
		creator{
			email
			}
		}
	}
-Create a User
	mutation{
	createUser(userInput:{email:"karkikiran714@gmail.com",password:"test123"}){
		email
		password
	}
	}