chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.type == "post") {
            fetch("http://192.168.1.10:8003/newData", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: msg.data
            })
        } else {
            fetch(`http://192.168.1.10:8003/getData?name=${msg.data}`, {
                method: "GET",
            }).then((res) => {
                console.log(res)
                return res.text().then((txt) => port.postMessage(txt))
            })
        }
    })
})