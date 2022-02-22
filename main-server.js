var express = require('express')
var app = express()
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

app.use(express.json())
app.use(express.urlencoded())

app.get("/", (request, res) => {
    res.send("Test successful")
})

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
        conn.query("SELECT * FROM users_settings WHERE name=?", [post.name], (erro, results) => {
            if (erro) throw erro
            if (results.length == 0) {
                // Create new user
                conn.query("INSERT INTO users_settings SET ?", post, (error, results) => {
                    if (error) throw error
                })
            } else {
                // Update existing user
                delete post["ID"]
                let current = results[0]
                delete current["ID"]
                if (post != current) {
                    conn.query("UPDATE users_settings SET ? WHERE name=? LIMIT 1", [post, post.name], (error, results) => {
                        if (error) throw error
                    })
                }
            }
        })
        
    })
})

app.get("/getData", (request, response) => {
    const name = request.query.name
    response.set('Content-Type', 'text/plain');

    pool.getConnection((err, conn) => {
        if (err) throw err
        conn.query("SELECT * FROM users_settings WHERE name = ?", [name], (error, results) => {
            if (error) throw error
            response.send(JSON.stringify(results[0]).replaceAll(/[\\\\]"/gmi, '"').replaceAll(/"{/gm, '{').replaceAll(/}"/gm, "}"))
        })
    })
})

http.listen(8003, "192.168.1.10", function() {
    console.log('listening on 8003')
})