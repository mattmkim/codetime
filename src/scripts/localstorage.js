class LocalStorage {
    // method to initialize blacklisted websites
    initBlacklistWebsites() {
        var websites = ["youtube.com", "facebook.com", "instagram.com"];
        chrome.storage.sync.set({
            blacklistWebsites: websites
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
        })
    }

    incrTimeToUse() {
        chrome.storage.sync.get("time", function (item) {
            chrome.storage.sync.set({
                time: item["time"] + 600000
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

    initNumQuestionsSolved() {
        chrome.storage.sync.set({
            numQuestions: 0
        })
    }

    incrNumQuestionsSolved() {
        chrome.storage.sync.get("numQuestions", function (item) {
            chrome.storage.sync.set({
                numQuestions: item["numQuestions"] + 1
            })
        })
    }
}