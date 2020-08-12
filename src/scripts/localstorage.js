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

    removeWebsite(address) {
        chrome.storage.sync.get("blacklistWebsites", function (item) {
            var newBlacklist = item["blacklistWebsites"]
            var ind = newBlacklist.indexOf(address);
            newBlacklist.splice(ind, 1);
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

    penaltyTimeToUse() {
        chrome.storage.sync.get("time", function (item) {
            chrome.storage.sync.set({
                time: item["time"] - 60000
            })
        })
    }
}