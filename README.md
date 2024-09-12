# IEEE-CS-backend
## Table Scheme 
- todoList
    - **id** : Integer (Primary Key)

    - **name** : String
    - **description** : String
# API Endpoints
- POST `/todoList`: Add a new TODO item to the list

- GET `/todoList`: Retrieve the list of all TODO items
- GET `/todoList/{id}`: Retrieve a specific TODO item by its ID
- PUT `/todoList/{id}`: Update an existing TODO item by its ID
- DELETE `/todoList/{id}`: Remove a TODO item by its ID

# Setup & Reqruirments
1. clone the rep

2. install nodejs & python & node pack manager by running `npm install` (in the terminal) & mime db if you encountered error "db.json not found" by running `npm install npm install mime-db` (in the terminal)
3. setup the table by running `node table.js`
4. start the server by running `node apptodo.js`
5. interface with postman or similar alternatives