var storage = new LocalStorage();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("blacklist-content").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("work-mode-content").style.display = "flex";

    // retrieve time left
    chrome.storage.sync.get("time", function (item) {
        var timeLeft = item["time"];
        var hours = Math.floor(timeLeft/1000/60/60);
        
        var mins = Math.floor((timeLeft/1000/60/60 - hours)*60);
        var seconds = Math.floor(((timeLeft/1000/60/60 - hours)*60 - mins)*60);
        if (mins < 10) {mins = "0" + mins;}
        if (seconds < 10) {seconds = "0" + seconds;}

        document.getElementById("timer").innerHTML = `${hours}:${mins}:${seconds}`
    })

    // get current blacklist
    chrome.storage.sync.get("blacklistWebsites", function(item) {
        var htmlCode = `<ul class="list-group list-group-flush" id="blacklist-list">`
        for (var i = 0; i < item["blacklistWebsites"].length; i++) {
            var domain = item["blacklistWebsites"][i];
            var listCode = `<li class="list-group-item">
                                <span class="address">${domain}</span>
                                <i class="far fa-trash-alt"></i>
                                
                            </li>`
            htmlCode += listCode;
        }
        htmlCode += `</ul>`

        document.getElementById("blacklist-content").innerHTML = htmlCode;
    })
})

window.onload = function() {
    document.getElementById("settings").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "none";
        document.getElementById("settings-content").style.display = "flex";
        document.getElementById("work-mode-content").style.display = "none";
    })
    
    document.getElementById("work-mode").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("work-mode-content").style.display = "flex";
    })
    
    document.getElementById("blacklist").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "flex";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("work-mode-content").style.display = "none";
    })

    let settingsForm = document.getElementById("settings-form")
    settingsForm.addEventListener("submit", function(event) {
        event.preventDefault()
        let address = settingsForm.elements["address"].value
        storage.addNewWebsite(address);
    })

    let deleteButton = document.getElementById("blacklist-list").getElementsByClassName("far");
    Array.prototype.slice.call(deleteButton).forEach(function (item) {
        item.addEventListener("click", function(event) {
            event.target.parentNode.remove();

            // TODO: Make function call to remove from blacklist
        })
    })
}  
