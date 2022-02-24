chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.type != "post") {
            fetch(`${msg.data.serverIp}/getData?name=${msg.data.name}`, {
                method: "GET"
            }).then((res) => {
                console.log(res)
                return res.text().then((txt) => port.postMessage(txt))
            })
        }
    })
})

chrome.runtime.onMessage.addListener(function handleMessage(msg, sender, sendResponse) {
    if (msg.type == "post") {
        fetch(`${JSON.parse(msg.data).serverIp}/newData`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: msg.data
        })    
        console.log("[INFO] tried")
    }
})