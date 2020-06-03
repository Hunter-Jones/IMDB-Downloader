var genreCheckboxes = document.getElementsByClassName("genre-checkbox");
var generateButton = document.getElementById("button-generate");

setAllIndeterminate(genreCheckboxes);
generateButton.onclick = genButton;


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
}

