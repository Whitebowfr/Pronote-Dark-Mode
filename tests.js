function store(name, value) {
    localStorage.setItem(name, value);
    console.log('"' + value + '" successfully stored with key "' + name + '"');
}

function changeNameStartup() {
    if (localStorage.getItem("keep")) { //only change the image/name if the "keep" var is set to true
        document.getElementsByClassName("ibe_util_texte ibe_actif").item(0).innerText = localStorage.getItem("name");
        document.getElementsByClassName("ibe_util_photo ibe_actif").item(0).firstElementChild.src = localStorage.getItem("profilePic");
        document.querySelectorAll('[role="main"]').style.backgroundImage = "url('" + localStorage.getItem("bckgrndUrl") + "')"
        document.getElementById("keepCheck").checked = true; //tick the checkbox
    }
    if (localStorage.getItem("badConnection")) {
        document.getElementById("badConnection").checked = true;
    }
}

function changeName(name) {
    document.getElementsByClassName("ibe_util_texte ibe_actif").item(0).innerText = name
}

function changeImage(url) {
    document.getElementsByClassName("ibe_util_photo ibe_actif").item(0).firstElementChild.src = url
}

function changeBackground(url) {
    if (!localStorage.getItem("badConnection")) {
        document.querySelectorAll('[role="main"]').style.backgroundImage = "url('" + url + "')"
    } else {
        return false
    }
}

function previousValue(el) {
    console.log(el.previousElementSibling.value)
    return el.previousElementSibling.value
}

function changeStyle(tochange, val) {
    document.documentElement.style.setProperty('--' + tochange, val);
}

setTimeout(function(){changeNameStartup();}, 500)