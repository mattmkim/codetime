var storage = new LocalStorage();

chrome.storage.onChanged.addListener(function(changes) {
    if (changes.time) {
        let time = new Date(changes.time.newValue);
        let hours = time.getUTCHours();
        let mins = time.getUTCMinutes();
        let seconds = time.getUTCSeconds();
        
        if (mins < 10) {mins = "0" + mins;}
        if (seconds < 10) {seconds = "0" + seconds;}
        console.log(seconds);
        document.getElementById("timer").innerHTML = `${hours}:${mins}:${seconds}`
    }

    if (changes.numQuestions) {
        var num = changes.numQuestions.newValue
        document.getElementById("num-questions").innerHTML = `<span class="badge badge-primary">Questions Sovled: ${num}</span>`
    }

    if (changes.blacklistWebsites) {
        if (changes.blacklistWebsites.oldValue.length > changes.blacklistWebsites.newValue.length) {
            return;
        }
        var newBlacklist = changes.blacklistWebsites.newValue
        var newAddress = newBlacklist[newBlacklist.length - 1]
        var oldHTML = document.getElementById("blacklist-content").innerHTML;

        // remove closing ul tag and add new list element
        oldHTML = oldHTML.substring(0, oldHTML.length - 5)
        
        var listCode = `<li class="list-group-item">
                            <span class="address" id="address">${newAddress}</span>
                            <i class="far fa-trash-alt"></i>
                        </li>
                        </ul>`
        var newHTML = oldHTML + listCode;
        document.getElementById("blacklist-content").innerHTML = newHTML;
        let deleteButton = document.getElementById("blacklist-list").getElementsByClassName("far");
        Array.prototype.slice.call(deleteButton).forEach(function (item) {
            item.addEventListener("click", function(event) {
                event.target.parentNode.remove();
                storage.removeWebsite(event.target.parentNode.querySelector(`[id="address"]`).innerHTML)
            })
        })
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("blacklist-content").style.display = "none";
    document.getElementById("settings-content").style.display = "none";
    document.getElementById("work-mode-content").style.display = "flex";

    // retrive num questions solved
    chrome.storage.sync.get("numQuestions", function (item) {
        document.getElementById("num-questions").innerHTML = `<span class="badge badge-primary">Questions Sovled: ${item["numQuestions"]}</span>`
    })

    // retrieve time left
    chrome.storage.sync.get("time", function (item) {
        let time = new Date(item["time"]);
        let hours = time.getUTCHours();
        let mins = time.getUTCMinutes();
        let seconds = time.getUTCSeconds();
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
                                <span class="address" id="address">${domain}</span>
                                <i class="far fa-trash-alt"></i> 
                            </li>`
            htmlCode += listCode;
        }
        htmlCode += `</ul>`

        document.getElementById("blacklist-content").innerHTML = htmlCode;
    })
})

// add listeners to UI 
window.onload = function() {
    document.getElementById("settings").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "none";
        document.getElementById("settings-content").style.display = "flex";
        document.getElementById("work-mode-content").style.display = "none";
        document.getElementById("form-message").innerHTML = "";
        document.getElementById("website-address").style.borderColor = "gray";
        document.getElementById("settings-form").elements["address"].value = "";
    })
    
    document.getElementById("work-mode").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "none";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("work-mode-content").style.display = "flex";
        document.getElementById("form-message").innerHTML = "";
        document.getElementById("website-address").style.borderColor = "gray";
        document.getElementById("settings-form").elements["address"].value = "";
    })
    
    document.getElementById("blacklist").addEventListener("click", function() {
        document.getElementById("blacklist-content").style.display = "flex";
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("work-mode-content").style.display = "none";
        document.getElementById("form-message").innerHTML = "";
        document.getElementById("website-address").style.borderColor = "gray";
        document.getElementById("settings-form").elements["address"].value = "";
    })

    let settingsForm = document.getElementById("settings-form")
    settingsForm.addEventListener("submit", function(event) {
        event.preventDefault()
        let address = settingsForm.elements["address"].value
        var pattern = new RegExp("[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:.(com|net|org|io|edu|info|gov))+");
        if (!pattern.test(address)) {
            document.getElementById("form-message").style.color = "red";
            document.getElementById("website-address").style.borderColor = "red";
            document.getElementById("form-message").innerHTML = `Address is not valid.`;
            
        } else {
            chrome.storage.sync.get("blacklistWebsites", function (item) {
                var prevBlacklist = item["blacklistWebsites"]
                if (prevBlacklist.includes(address)) {
                    document.getElementById("form-message").style.color = "red";
                    document.getElementById("website-address").style.borderColor = "red";
                    document.getElementById("form-message").innerHTML = `Address already in blacklist.`;
                    
                } else {
                    var newBlacklist = prevBlacklist.concat(address)
                    chrome.storage.sync.set({
                        blacklistWebsites: newBlacklist
                    })
                    document.getElementById("form-message").style.color = "green";
                    document.getElementById("form-message").innerHTML = `Address successfully added!`;
                }
            })
        }
    })

    let deleteButton = document.getElementById("blacklist-list").getElementsByClassName("far");
    Array.prototype.slice.call(deleteButton).forEach(function (item) {
        item.addEventListener("click", function(event) {
            event.target.parentNode.remove();
            storage.removeWebsite(event.target.parentNode.querySelector(`[id="address"]`).innerHTML)
        })
    })
}  
