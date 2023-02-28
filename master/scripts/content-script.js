// Fetch the list of words that the user has found already. Update this list every second.
setTimeout(function () {
    const sbWordListWindow = document.querySelector("#pz-game-root > div > div.sb-status-box > div.sb-wordlist-box > div.sb-wordlist-drawer > div > div.sb-wordlist-pag > ul");
    if (sbWordListWindow) {
        const words = [...sbWordListWindow.querySelectorAll("li")].map(wordNode => wordNode.textContent);
        chrome.runtime.sendMessage(words);
    }
}, 2000);