var app = require('express')()
var http = require('http').Server(app)
var mysql = require('mysql')
require('dotenv').config()

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'pronote_dark_mode',
    password: process.env.USER_PASSWORD
});

app.post("/newData", (request) => {
    let data = request.body
    let post = {
        ID: null,
        name: data.ogName,
        background_url: data.backgroundUrl,
        custom_accent_color: data.customAccentColor,
        loaded_theme: data.loadedTheme,
        custom_name: data.name,
        profile_picture: data.profilePic
    }
    pool.getConnection((err, conn) => {
        if (err) throw err
        conn.query("INSERT INTO users_settings SET ?", post, (error, results) => {
            if (error) throw error
        })
    })
})

app.get("/getData", (request, response) => {
    const name = request.body.name;
    response.set('Content-Type', 'text/plain');

    pool.getConnection((err, conn) => {
        if (err) throw err
        conn.query("SELECT * FROM users_settings WHERE name = ?", [name], (error, results) => {
            if (error) throw error
            response.send(JSON.stringify(results))
        })
    })
})

http.listen(8003, "localhost", function() {
    console.log('listening on 8003')
})