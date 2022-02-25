chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.type != "post") {
            fetch(`${msg.data.serverIp}/getData?name=${msg.data.name}&v=${chrome.app.getDetails().version}`, {
                method: "GET"
            }).then((res) => {
                return res.text().then((txt) => {
                    txt = JSON.parse(txt)
                    console.log(txt)
                    if (txt.needSmallUpdate) {
                        chrome.browserAction.setBadgeText({text: "!!"})
                        chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]})
                    } else {
                        chrome.browserAction.setBadgeText({text: ""})
                        chrome.browserAction.setBadgeBackgroundColor({color: [255,0,0,255]})
                    }
                    if (txt.needBigUpdate) {
                        chrome.notifications.create("PRONOTE_ID", {
                            type: "basic",
                            title: "Une mise à jour de Pronote Dark Mode est disponible",
                            message: "Merci de l'effectuer pour éviter des crashs potentiels",
                            iconUrl: "data/icon.png",
                            silent: true,
                        })
                    }

                    port.postMessage(txt)
                })
            })
        }
    })
})

chrome.runtime.onMessage.addListener(function handleMessage(msg, sender, sendResponse) {
    if (msg.type == "post") {
        fetch(`${JSON.parse(msg.data).serverIp}/newData`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: msg.data
        })
    }
})