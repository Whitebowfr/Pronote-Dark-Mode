function store(name, value) {
    localStorage.setItem(name, value);
    console.log('"' + value + '" successfully stored in "' + name + '"');
}