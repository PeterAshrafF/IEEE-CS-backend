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

// POST Request - Adding a task
app.post("/todoList", (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Name and description are required."
        });
    }

    const sql = "INSERT INTO todoList (name, description) VALUES (?, ?)";
    db.run(sql, [name, description], function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to insert task into database.",
                error: err
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "task added, hurraay....",
            taskId: this.lastID
        });
    });
});

// GET Request - Retrieving todoList
app.get("/todoList", (req, res) => {
    const sql = "SELECT * FROM todoList";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to retrieve todoList from the database.",
                error: err
            });
        }

        if (rows.length < 1) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "No todoList found."
            });
        }

        res.json({
            status: 200,
            success: true,
            data: rows
        });
    });
});

//GET Request - gets a task by id
app.get("/todoList/:id", (req, res) => {
    const { id } = req.params;  // Extract task ID from the URL

    const sql = "SELECT * FROM todoList WHERE id = ?";
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to retrieve task from the database.",
                error: err
            });
        }

        if (!row) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No task found with id: ${id}`
            });
        }

        res.json({
            status: 200,
            success: true,
            data: row
        });
    });
});


// PUT Request - Updating a task by id
app.put("/todoList/:id", (req, res) => {
    const { id } = req.params;  // Extract task ID from URL
    const { name, description } = req.body;  // Extract name and description from request body

    if (!name || !description) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: "Name and description are required."
        });
    }

    const sql = "UPDATE todoList SET name = ?, description = ? WHERE id = ?";
    db.run(sql, [name, description, id], function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to update task.",
                error: err
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No task found with id: ${id}`
            });
        }

        res.json({
            status: 200,
            success: true,
            message: "task updated successfully!"
        });
    });
});

// DELETE Request - Deleting a task by id
app.delete("/todoList/:id", (req, res) => {
    const { id } = req.params;

    // SQL to delete the task
    const deleteSql = "DELETE FROM todoList WHERE id = ?";
    
    db.run(deleteSql, id, function (err) {
        if (err) {
            return res.status(500).json({
                status: 500,
                success: false,
                message: "Failed to delete task.",
                error: err
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: `No task found with id: ${id}`
            });
        }

        // After successfully deleting, query to count remaining tasks
        const countSql = "SELECT COUNT(*) AS count FROM todoList";
        db.get(countSql, (err, row) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    success: false,
                    message: "Failed to count remaining tasks.",
                    error: err
                });
            }

            const remainingTasks = row.count;
            let successMessage = "";

            if (remainingTasks > 0) {
                successMessage = `1 down, ${remainingTasks} more to go!`;
            } else {
                successMessage = "Hurray, no more tasks!";
            }

            // Return success message based on the remaining tasks
            res.json({
                status: 200,
                success: true,
                message: successMessage
            });
        });
    });
});


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});