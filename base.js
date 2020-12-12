function store(name, value) {
    localStorage.setItem(name, value);
    console.log('"' + value + '" successfully stored in "' + name + '"');
}

function showSecondMenu() {
    $('.objetBandeauEntete_secondmenu').show(); 
    $("#id_34").show();
}