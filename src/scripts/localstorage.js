class LocalStorage {
    // method to initialize blacklisted websites
    initBlacklistWebsites() {
        var websites = ["youtube.com", "facebook.com", "instagram.com"];
        chrome.storage.local.set({
            blacklistWebsites: websites
        })
    }

    removeWebsite(address) {
        chrome.storage.local.get("blacklistWebsites", function (item) {
            var newBlacklist = item["blacklistWebsites"]
            var ind = newBlacklist.indexOf(address);
            newBlacklist.splice(ind, 1);
            chrome.storage.local.set({
                blacklistWebsites: newBlacklist
            })
        })
    }

    initTimeToUse() {
        chrome.storage.local.set({
            time: 0
        })
    }

    incrTimeToUse() {
        chrome.storage.local.get("time", function (item) {
            chrome.storage.local.set({
                time: item["time"] + 900000
            })
        })
    }

    decrTimeToUse() {
        chrome.storage.local.get("time", function (item) {
            chrome.storage.local.set({
                time: item["time"] - 1000
            })
        })
    }

    initNumQuestionsSolved() {
        chrome.storage.local.set({
            numQuestions: 0
        })
    }

    incrNumQuestionsSolved() {
        chrome.storage.local.get("numQuestions", function (item) {
            chrome.storage.local.set({
                numQuestions: item["numQuestions"] + 1
            })
        })
    }
}