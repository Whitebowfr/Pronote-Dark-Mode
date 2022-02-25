var express = require('express')
var app = express()
var http = require('http').Server(app)
var mysql = require('mysql')
const fs = require('fs')
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

app.post("/newData", (request, res) => {
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
        if (err) console.log("[ERROR] " + err)
        conn.query("SELECT * FROM users_settings WHERE name=?", [post.name], (erro, results) => {
            if (erro) console.log("[ERROR] " + erro)
            if (results.length == 0) {
                // Create new user
                conn.query("INSERT INTO users_settings SET ?", post, (error, results) => {
                    conn.release()
                    res.end()
                    if (error) console.log("[ERROR] " + error)
                })
            } else {
                // Update existing user
                delete post["ID"]
                let current = results[0]
                delete current["ID"]
                if (post != current) {
                    conn.query("UPDATE users_settings SET ? WHERE name=? LIMIT 1", [post, post.name], (error, results) => {
                        conn.release()
                        res.end()
                        if (error) console.log("[ERROR] " + error)
                    })
                }
            }
        })
    })
})

app.get("/getData", (request, response) => {
    const name = request.query.name
    const userVersion = request.query.v.split(".").map(element => parseInt(element))
    response.set('Content-Type', 'text/plain');
    fs.readFile(`${__dirname}/extension/manifest.json`, (err, data) => {
        const currentVersion = JSON.parse(data).version.split(".").map(element => parseInt(element))
        pool.getConnection((err, conn) => {
            if (err) console.log("[ERROR] " + err)
            conn.query("SELECT * FROM users_settings WHERE name = ?", [name], (error, results) => {
                conn.release()
                if (error) console.log("[ERROR] " + error)
                if (results.length == 0) {
                    if (checkIfBigUpdateNeeded(userVersion, currentVersion)) {
                        response.send("{needBigUpdate: true}")
                    } else if (checkIfSmallUpdateNeeded(userVersion, currentVersion)) {
                        response.send("{needSmallUpdate: true}")
                    } else {
                        response.send("{}")
                    }
                } else {
                    if (checkIfBigUpdateNeeded(userVersion, currentVersion)) {
                        results[0].needBigUpdate = true;
                    } else if (checkIfSmallUpdateNeeded(userVersion, currentVersion)) {
                        results[0].needSmallUpdate = true;
                    }
                    response.send(JSON.stringify(results[0]).replaceAll(/[\\\\]"/gmi, '"').replaceAll(/"{/gm, '{').replaceAll(/}"/gm, "}"))
                }
                response.end()
            })
        })
    })
    
})

function checkIfBigUpdateNeeded(client, server) {
    return client[0] < server[0] || server[1] - client[1] > 2
}

function checkIfSmallUpdateNeeded(client, server) {
    return client[2] < server[2] || (server[1] - client[1] >= 1 && server[1] - client[1] <= 2)
}

http.listen(8003, "192.168.1.119", function() {
    console.log('listening on 8003')
})