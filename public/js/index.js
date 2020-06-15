// TODO: Find way to have the text change from loading whenever the contents of button-copy text change``

var genreCheckboxes = document.getElementsByClassName("genre-checkbox");
var generateButton = document.getElementById("button-generate");

var movieButton = document.getElementById("button-copy");  // Used for movie name
var moviesList = document.getElementById("button-copy-text");

var torrentButton = document.getElementById("button-copy-torrent"); // used for movie torrent
var torrentList = document.getElementById("button-copy-torrent-text");

setAllIndeterminate(genreCheckboxes);
generateButton.onclick = genButton;
movieButton.addEventListener("click", function(){copyText(moviesList, movieButton)});
torrentButton.addEventListener("click", function(){copyText(torrentList, torrentButton)});



// Pre: Runs immedietely, requires the checkboxes variable to be filled with an array of checkboxes
// Post: Sets the state of each checkbox to indeterminate initially
// Also sets 
// NOTE: Indeterminate checkboxes are in a state which is niether on or off
function setAllIndeterminate(checkboxes)
{
	for (var i = 0; i < genreCheckboxes.length; ++i)
	{
		checkboxes[i].ondblclick = setIndeterminate;
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