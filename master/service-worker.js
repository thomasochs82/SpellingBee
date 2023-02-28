// Listen to messages from the payload.js script and write to popup.html
chrome.runtime.onMessage.addListener(function (message) {
    document.getElementById('words').innerHTML = message;
});

// Automatically update the list of words every second
setInterval(function () {
    chrome.tabs.executeScript({
        file: 'scripts/content-script.js'
    });
}, 1000);

// Automatically update the genius status every second
setInterval(function () {
    chrome.tabs.executeScript({
        file: 'scripts/locate-genius.js'
    });
}, 1000);
