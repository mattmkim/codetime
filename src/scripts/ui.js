chrome.storage.onChanged.addListener(function(changes) {
    if (changes.time) {
        var milli = parseInt(changes.time.newValue);
        var hours = Math.floor(milli/1000/60/60);
        var mins = Math.floor((milli/1000/60/60 - hours)*60);
        var seconds = Math.floor(((milli/1000/60/60 - hours)*60 - mins)*60);
        if (mins < 10) {mins = "0" + mins;}
        if (seconds < 10) {seconds = "0" + seconds;}
        document.getElementById("timer").innerHTML = `${hours}:${mins}:${seconds}`
    }

    if (changes.blacklistWebsites) {
        var newBlacklist = changes.blacklistWebsites.newValue
        var newAddress = newBlacklist[newBlacklist.length - 1]
        var oldHTML = document.getElementById("blacklist-content").innerHTML;

        // remove closing ul tag and add new list element
        oldHTML = oldHTML.substring(0, oldHTML.length - 5)
        var listCode = `<li class="list-group-item" id="blacklist-group-item">
                            <span class="address">${newAddress}</span>
                            <i class="far fa-trash-alt"></i>
                            
                        </li>
                        </ul>`
        var newHTML = oldHTML + listCode;
        document.getElementById("blacklist-content").innerHTML = newHTML;
        document.getElementById("blacklist-group-item").addEventListener("click", function(event) {
            event.target.parentNode.remove();
        })

    }
});
