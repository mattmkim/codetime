class LocalStorage {
    // method to initialize blacklisted websites
    initBlacklistWebsites() {
        var websites = ["youtube.com", "facebook.com", "instagram.com"];
        chrome.storage.sync.set({
            blacklistWebsites: websites
        }, function() {
            console.log("blacklisted websites initialized")
        })
    }

    addNewWebsite(address) {
        chrome.storage.sync.get("blacklistWebsites", function (item) {
            var prevBlacklist = item["blacklistWebsites"]
            var newBlacklist = prevBlacklist.concat(address)
            chrome.storage.sync.set({
                blacklistWebsites: newBlacklist
            })
        })
    }

    initTimeToUse() {
        chrome.storage.sync.set({
            time: 0
        }, function() {
            console.log("time to use initialized")
        })
    }

    incrTimeToUse() {
        chrome.storage.sync.get("time", function (item) {
            chrome.storage.sync.set({
                time: item["time"] + 600000
            }, function() {
                console.log("time to use increased")
            })
        })
    }

    decrTimeToUse() {
        chrome.storage.sync.get("time", function (item) {
            chrome.storage.sync.set({
                time: item["time"] - 1000
            })
        })
    }
}