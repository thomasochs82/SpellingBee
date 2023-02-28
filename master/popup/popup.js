let twoLetterList = [];
let genius = 0;
let rand = Math.floor(Math.random() * 20).toString();

// Format the current date
const date = new Date();
var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
	.toISOString()
	.split("T")[0];

// Fetch two letter list from the website
fetch("https://www.nytimes.com/" + dateString.split("-").join("/") + "/crosswords/spelling-bee-forum.html")
	.then(response => response.text())
	.then(data => {
		// Locate and fetch the correct paragraph from the hints website
		const parser = new DOMParser();
		const html = parser.parseFromString(data, "text/html");
		const twoLetterListNode = html.querySelector("#story > section");
		// Format the "letterletter-number" strings into the proper configuration so we can modify the number
		// of words that we've found with those two starting letters.
		var fullStr = twoLetterListNode.textContent.split("Two letter list:")[1].split("Further Reading")[0];
		var full = fullStr.replace(/(\r\n|\n|\r)/gm, "").split(" ");
		twoLetterList = full.filter((str) => str !== '');
	})
	.catch(error => console.error(error));

// On the load of the extension, try to see the words that the user has already found
window.addEventListener("load", function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(
		null,
		{ file: "../scripts/content-script.js" }
	);
	rand = Math.floor(Math.random() * 20).toString();
});

// When recieving a message, if the message is a string, the user has hit genius. 
// If the message is an object, the user has found some words.
chrome.runtime.onMessage.addListener(function (message) {
	const words = message;
	// Since the user has hit genius, set the genius variable to true 
	if (typeof words == "string" && genius == 0 && words.includes("Genius")) {
		genius = 1;
	}
	// Update the body of the popup with the words
	if (typeof words == "object") {
		// Modify the words id in the popup.html file to be the list of words found by the user so far.
		const wordsNode = document.querySelector("#words");
		document.getElementById('words').innerHTML = "";
		words.forEach(word => {
			const wordNode = document.createElement("li");
			wordNode.textContent = word;
			wordsNode.appendChild(wordNode);
		});

		// Modify the hints id in the html file to update based on the words already found by the user.
		const hints = twoLetterList
		const hintsNode = document.querySelector("#hints");
		document.getElementById('hints').innerHTML = "";
		total_num_words = 0
		hints.forEach(hint => {
			letters = hint.slice(0, 2);
			num_words = parseInt(hint.split("-")[1]);
			// For each hint, show the number of words that the user has not yet found for the corresponding starting letters.
			words.forEach(word => {
				first_letters = word.slice(0, 2);
				if (first_letters == letters) {
					num_words = num_words - 1;
				}
			});
			total_num_words = total_num_words + num_words
			const hintNode = document.createElement("li");
			hintNode.textContent = letters + "-" + num_words.toString();

			// If the word exists in the two letter list, cross it off
			if (num_words == 0) {
				hintNode.style.textDecoration = "line-through";
				hintNode.style.textDecorationThickness = "4px";
			}
			// Add the hint to the popup.
			hintsNode.appendChild(hintNode);
		});
		// Show the user how many total words are left that they have not yet found.
		const wordCountSpan = document.querySelector("#wordCount");
		wordCountSpan.textContent = total_num_words;

		// If the user has hit genius, put the gif under the hints and found words.
		if (genius == 1) {
			// Randomize the gif that the user sees.
			document.getElementById("theGIF").src = "../icons/0.gif";
			document.getElementById("theGIF").style.display = "block";
			genius = 2;
		}
	}
});
