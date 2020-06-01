var genreCheckboxes = document.getElementsByClassName("genre-checkbox");

// Gives each genre-checkbox the indeterminate state, which is neither on or off
for (var i = 0; i < genreCheckboxes.length; ++i)
{
	genreCheckboxes[i].indeterminate = true;
}