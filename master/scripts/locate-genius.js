// Check if the user has hit "genius" status. Check for this every second.
setTimeout(function () {
    const geniusFinder = document.querySelector("#pz-game-root > div > div.sb-status-box > div.sb-progress-box > span > div");
    if (geniusFinder) {
        const text = geniusFinder.textContent;
        chrome.runtime.sendMessage(text);
    }
}, 2000);