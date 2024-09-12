const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite =  require('sqlite3').verbose();
const url = require("url");

let sql;

const db = new sqlite.Database("./todoList.db", sqlite.OPEN_READWRITE, (err) =>{
    if (err) return console.error(err);
});

app.use(bodyParser.json());

// POST Request - Adding a user
app.post("/users", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Name and email are required."
        });
    }

    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    db.run(sql, [name, email], function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to insert user into database.",
                error: err
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "User added successfully!",
            userId: this.lastID
        });
    });
});

// GET Request - Retrieving users
app.get("/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to retrieve users from the database.",
                error: err
            });
        }

        if (rows.length < 1) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "No users found."
            });
        }

        res.json({
            status: 200,
            success: true,
            data: rows
        });
    });
});

//GET Request - gets a user by id
app.get("/users/:id", (req, res) => {
    const { id } = req.params;  // Extract user ID from the URL

    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to retrieve user from the database.",
                error: err
            });
        }

        if (!row) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No user found with id: ${id}`
            });
        }

        res.json({
            status: 200,
            success: true,
            data: row
        });
    });
});


// PUT Request - Updating a user by id
app.put("/users/:id", (req, res) => {
    const { id } = req.params;  // Extract user ID from URL
    const { name, email } = req.body;  // Extract name and email from request body

    if (!name || !email) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Name and email are required."
        });
    }

    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.run(sql, [name, email, id], function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to update user.",
                error: err
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No user found with id: ${id}`
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "User updated successfully!"
        });
    });
});

// DELETE Request - Deleting a user by id
app.delete("/users/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, id, function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to delete user.",
                error: err
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No user found with id: ${id}`
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "User deleted successfully!"
        });
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});