var genreCheckboxes = document.getElementsByClassName("genre-checkbox");
var generateButton = document.getElementById("button-generate");
var copyButton = document.getElementById("button-copy");
var moviesList = document.getElementById("button-copy-text");

setAllIndeterminate(genreCheckboxes);
generateButton.onclick = genButton;
copyButton.addEventListener("click", function(){copyText(moviesList, copyButton)});


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

	copyButton.innerHTML = "Loading";

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

function copyText(message, thisButton)
{
	message.select();
  	message.setSelectionRange(0, 99999); /*For mobile devices*/

	/* Copy the text inside the text field */
	navigator.clipboard.writeText(message.value);

	/* Alert the copied text */
	// alert("Copied the text: " + message.value);

	/* Change the text of the botton for 5 seconds */
	thisButton.innerHTML = "Copied";
	setTimeout(function(){
		thisButton.innerHTML = "Copy";
	}, 5000);
}