// TODO: Find way to have the text change from loading whenever the contents of button-copy text change``

var genreCheckboxes = document.getElementsByClassName("genre-checkbox");
var generateButton = document.getElementById("button-generate");

var movieButton = document.getElementById("button-copy");  // Used for movie name
var moviesList = document.getElementById("button-copy-text");

var torrentButton = document.getElementById("button-copy-torrent"); // used for movie torrent
var torrentList = document.getElementById("button-copy-torrent-text");

var showTextButton = document.getElementById("button-show-text");
var showFaqButton = document.getElementById("button-show-faq");

var faqDiv = document.getElementsByClassName("menu-faq")[0];
var textDiv = document.getElementsByClassName("menu-list")[0];

var interval = setInterval(function() {
    if(performance.navigation.type != 1) {
        // movieButton.innerHTML = "READY";
    }    
}, 100);

setAllIndeterminate(genreCheckboxes);
generateButton.onclick = genButton;

// Lets both buttons copy from their respective lists
movieButton.addEventListener("click", function(){copyText(moviesList, movieButton)});
torrentButton.addEventListener("click", function(){copyText(torrentList, torrentButton)});
 
// Lets both buttons hide their respective element
showTextButton.addEventListener("click", function(){toggleShow(faqDiv, textDiv, "inline")})
showFaqButton.addEventListener("click", function(){toggleShow(textDiv, faqDiv, "inline-block")})




// Pre: Runs immedietely, requires the checkboxes variable to be filled with an array of checkboxes
// Post: Sets the state of each checkbox to indeterminate initially
// Also sets 
// NOTE: Indeterminate checkboxes are in a state which is niether on or off
function setAllIndeterminate(checkboxes)
{
	for (var i = 0; i < genreCheckboxes.length; ++i)
	{
		checkboxes[i].onauxclick = setIndeterminate;  // Auxclick is RMB or middle click
		checkboxes[i].indeterminate = true;
		// some reason it just sets it at start, 
		/*TODO*/
	}

	// for (var i = 0; i < genreCheckboxes)
}

// Pre: requires to be called on an HTML checkbox object
// Post: sets the checkbox to indeterminate
function setIndeterminate()
{
	this.indeterminate = true;
}

// Pre: Runs when you click the button to generate the movie list
// Post: Sends the genres for the movies
function genButton()
{
	var includedGenres = "";
	var excludedGenres = "";

	movieButton.innerHTML = "Loading";
	torrentButton.innerHTML = "Loading";
	movieButton.disabled = true;
	torrentButton.disabled = true;
	generateButton.disabled = true;

	// loop through array and adds movies to included or excluded list
	for (var i = 0; i < genreCheckboxes.length; ++i)
	{
		if (genreCheckboxes[i].checked == true)
		{  // Include
			includedGenres += genreCheckboxes[i].name + ",";
		}
		else if (genreCheckboxes[i].checked == false && genreCheckboxes[i].indeterminate == false)
		{  // Exclude
			excludedGenres += genreCheckboxes[i].name + ",";
		}
	}
	window.location.href = "/getmovie/include=" + includedGenres + "&exclude=" + excludedGenres;
}

// Pre: Requires any string of text (message) and a HTML clickable button object
// Post: Reloads the page, resetting any variables
// then copies the string from message to the users clipboard to CTRL+V
// Finally, it sets the innerHTML of button to copied for 5 seconds before changing it to the again to let the user know it worked
function copyText(message, thisButton)
{
	location.reload();  // Reloads the page, rechecking the variables first
	location.reload();
	message.select();
  	message.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	navigator.clipboard.writeText(message.value);

	/* Alert the copied text */
	// alert("Copied the text: " + message.value);

	/* Change the text of the botton for 5 seconds */
	originalText = thisButton.innerHTML;
	thisButton.innerHTML = "Copied";

	setTimeout(function(){
		thisButton.innerHTML = originalText;
	}, 5000);
}

// Pre: UnselectedObjects is an array of ALL elements that should be hidden when the selectedElement is toggled
// SelectedElement is the element to be toggled
// Display is the CSS display property that the selectedObject should be when displayed
function toggleShow(unselectedObjects, selectedObject, display)
{
	// Hides non-selected element
	unselectedObjects.style.visibility = "hidden";
	unselectedObjects.style.setProperty("display", "none", "important");

	// Toggles visibility on the main object
	if (selectedObject.style.visibility != "visible")
	{
		selectedObject.style.visibility = "visible";
		selectedObject.style.setProperty("display", display, "important");
	}
	else
	{
		selectedObject.style.visibility = "hidden";
		selectedObject.style.setProperty("display", "none", "important");
	}
	
}