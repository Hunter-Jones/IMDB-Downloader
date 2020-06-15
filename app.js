const port = 3000;

const 	http            = require("http"),
      	express         = require("express"),
    	ejs             = require("ejs"),

    	app             = express(),

    	// Used for web crawling
    	axios 			= require('axios'),
    	cheerio 		= require('cheerio'),

    	debug 			= require('debug'),
    	TorrentSearchApi= require("torrent-search-api");

app.use(express.static(__dirname + "/public"));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

// Sets the search website to any torrent site which is free
TorrentSearchApi.enablePublicProviders();

// var genre = "comedy";
// for genre = "action", it will show any movie with action
// "action,comedy,horror" will show only something that is ALL 3 of the genres
// var url = "https://www.imdb.com/search/title/?genres=" + genre + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
// IMDB list of top horror movies, sorted by number of votes, between 2000 and 2020

// Variable for all of the movies

// Description variable which includes the names of every horror movie
var movieDescriptionList = "";
var movieLinkList = "";
var statusMessage;

// Can not be above 49, because the website only has 50 movies, and it will cause the page to infinitely scroll
const MAX_MOVIES = 10;


app.get("/", function(req, res){
    res.render("index", {movieDescriptionList:movieDescriptionList, movieLinkList:movieLinkList});
});

// This url was used as a way to send the include and exclude variables to nodeJS so they can be used in the webscraper
app.get("/getmovie/*", function(req, res){

	url = req.headers.host + '/' + req.url;
	parseGenres(res, url);    

	    movieDescriptionList = "";
    // movieLinkList = "";  // Remove to make the list continuously grow
    // This works because even if there are duplicates, when added to qbt they are combined \
    // It is put here, so the only time that the moveLinkList is refreshed is when the user reclicks the generate button
})

console.log("Server running");
app.listen(port);


// Pre: Requires request and response, plus the url
// Post: Takes the URL and makes sure first it includes include= to ensure that it includes the genres
// It then takes the substring of URL that excludes everything uneccesary and passes it to getMovies
// It then returns getMovie's movieList variable, which includes a description of every movie that the user wants
function parseGenres(res, url)
{
	if (url.includes("include="))
	{

    	url = url.substring(33);  // 33 -1 is anything include= and beyond
		// url becomes just a list of included and not included genres
		getMovies(res, url);
	}
}
// Pre: requires request response and the variable genres which is a string with all of the IMDB movie genres included/excluded
// The format should be include= + includedGenres + &exclude= + excludedGenres
// ex include=comedy,horror&exclude=family,action
// In this example, it will show only comedy horror movies that do not include the genres family or action
//Post: Takes the genres list and adds it to the url, then webscrapes the url for the top 50 highest rated movies which include whats in genres variable, are feature films, and recieved 25k reviews
// It will then run the scrapeMovie and getTorrent functions for each movie 
// Finally, it redirects the webpage back to the default URL, which has the descriptionList variable updated to be passed
function getMovies(res, genres)
{
	var url = "https://www.imdb.com/search/title/?genres=" + genres + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
	descriptionList = "";

	axios(url)
	.then(async function(res){
		const html = res.data;
		const $ = cheerio.load(html);
		const moviesList = $(".lister-list > .lister-item");

		var listSize = moviesList.length  // Makes the max movie list size of MAX_MOVIES
		if (listSize > MAX_MOVIES) {listSize = MAX_MOVIES}

		for (var i = 0; i < listSize; ++i)
		{
			var movieName = scrapeMovie($, moviesList[i], genres);
			if (i +1 == moviesList.length)
			{
				// Adds the extra parameter to end if last movie
				// Needs to be done in the async function because otherwise it would run before the async function finishes
				await torrentMovie(movieName, res);
			}
			else
			{
				torrentMovie(movieName, res);
			}
			
		}	
	})
	.then(function(){
		movieDescriptionList = descriptionList;
		res.redirect("/");
		// Promise chain used with res.redirect to fix error where rederict happens before movieDescriptionList 
	})
	.catch(console.error);
}

// Pre requires $ which is the cheerio keyword for the loaded HTML
// It also requires a movie from IMDB's website to webscrape and the list of genres from the URL, which need to be parsed
// For each movie it gets the name score and genre, then adds them to a description
// It then checks each movie to make sure it doesn't include an excluded genre 
//(The webscraper only gets access to the top 3 genres of a movie, so it isn't perfect, but IMDB doesn't include its own exclusion in advanced search and the webpage only shows the first 3 genres, so there is no other solution)
// At the end, it adds each non-exclude movie's genre, name, and score to the descriptionList variable and returns it 
function scrapeMovie($, movie, unparsedGenres)
{
	const name = $(movie).find(".lister-item-content > .lister-item-header > a").text();
	const genre = $(movie).find(".lister-item-content > .text-muted > .genre").text();
	const score = $(movie).find(".lister-item-content > .ratings-bar > .inline-block strong").text();
	var description = "The movie " + name + " had a score of " + score;
	
	// Used to see the movie name VIA console
	// console.log(name);

	var excludedGenres = unparsedGenres.substring(unparsedGenres.search("exclude="));
	excludedGenres = excludedGenres.substring(8);
	var excludedGenresList = excludedGenres.split(",");
	// Checks if genres includes excluded genre
	
	// The excluded genres list always has at least element (even if empty)
	// When empty the list only consists of 
	if (excludedGenresList[0] != " ")
	{
		descriptionList += description + "\n";
	}
	else 
	{
		for (var i = 0; i < excludedGenresList.length; ++i)
		{
			if (!genre.includes(excludedGenresList[i]))
			{
				descriptionList += description + "\n";
				// Only shows non-excluded genres
			}
		} 
	}
	return name;
}

// Pre: Requires the name for a movie
// Post asynchronously goes and finds the name for a torrented movie and returns the link if it exists
// NOTE: This will take a LONG time (multiple minutes for 50) 
async function torrentMovie(name, res)
{
	// console.log("Torrenting " + name);
	const movieLink = await TorrentSearchApi.search(name, 'Movies', 1);
	// console.log(movieLink[0].link);

	try
	{
		if (movieLink[0].link != undefined) 
		{
			movieLinkList += name +  ": " + movieLink[0].link;
			movieLinkList += "\n";
		}
		else
		{
			movieLinkList += name + " wasn't found\n";
		}
	}
	catch(error)
	{
		console.log("Error adding " + name);
	}
	
}