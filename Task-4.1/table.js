const sqlite =  require('sqlite3').verbose();
const db = new sqlite.Database("./todoList.db", sqlite.OPEN_READWRITE, (err) =>{
    if (err) return console.error(err);
});
//const sql = `drop TABLE users`

const sql = `SELECT name FROM sqlite_master WHERE type='table'`;

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    
    console.log("Tables in the database:");
    rows.forEach((row) => {
        console.log(row.name);
    });
});

db.run(sql);