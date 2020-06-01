var checkboxes = document.getElementsByClassName("genre-checkbox");
console.log(checkboxes);
for (var i = 0; i < checkboxes.length; ++i)
{
	checkboxes[i].indeterminate = true;
	console.log(checkboxes[i]);
}