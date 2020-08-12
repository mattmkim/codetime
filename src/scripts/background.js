var storage = new LocalStorage()
var leetcode = new Leetcode()

// need a function that will run every second 
// check if we are on a blacklisted site, and block site when timer runs out
function checkCurrentPage() {
    chrome.tabs.query({}, function (tabs) {
        chrome.storage.sync.get(["time", "blacklistWebsites"], function (item) {
            for (var i = 0; i < tabs.length; i++) {
                if (!tabs[i].hasOwnProperty("url")) {
                    continue;
                }
                var url = new URL(tabs[i].url);
                var domain = url.hostname.substring(4);
                if (item["blacklistWebsites"].includes(domain)) {
                    if (item["time"] <= 0) {
                        var blockURL = chrome.runtime.getURL("block.html") + '?url=' + url.hostname;
                        chrome.tabs.update(tabs[i].id, { url: blockURL });
                    } else {
                        storage.decrTimeToUse();
                        break;
                    }
                }
            }
        })
    })  
}

function addListeners() {
    // when extension is installed, initialize storage for number of minutes you have + blacklisted websites
    chrome.runtime.onInstalled.addListener(function(details) {
        if (details.reason === "install") {
            // first check for user data
            storage.initBlacklistWebsites();
            storage.initTimeToUse();
        }
    });

    // once request to submit leetcode question is finished, make request to check the status of solution
    chrome.webRequest.onCompleted.addListener(function (details) {
        var url = details.url;
        var pattern = new RegExp("https:\/\/leetcode.com\/problems\/[^/]+\/submit\/");
        if (pattern.test(url)) {
            var problem = url.split("/")[4];
            leetcode.checkSubmission(problem)
            // call function to check if submission passed
        }
    }, {urls: ["<all_urls>"]})
    
    // detect if user is going to blacklisted site and if user has no time left
    chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
        console.log(tab);
        if (tab.hasOwnProperty("url")) {
            var url = new URL(tab.url);
            // reached blacklisted website with no time remaining
            chrome.storage.sync.get("time", function (item) {
                if (item["time"] == 0) {
                    console.log("time is zero")
                    chrome.storage.sync.get("blacklistWebsites", function (item) {
                        var domain = url.hostname.substring(4);
                        if (item["blacklistWebsites"].includes(domain)) {
                            var blockURL = chrome.runtime.getURL("block.html") + '?url=' + url.hostname;
                            chrome.tabs.update(tabID, { url: blockURL });
                        }
                    })
                }
            })
        }
    });
}

addListeners();
setInterval(checkCurrentPage, 1000);



