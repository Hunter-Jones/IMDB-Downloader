const port = 3000;

const 	http            = require("http"),
      	express         = require("express"),
    	ejs             = require("ejs");
    	axios 			= require('axios');
    	cheerio 		= require('cheerio');

    	app             = express();

app.use(express.static(__dirname + "/public"));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

// var genre = "comedy";
// for genre = "action", it will show any movie with action
// "action,comedy,horror" will show only something that is ALL 3 of the genres
// var url = "https://www.imdb.com/search/title/?genres=" + genre + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
// IMDB list of top horror movies, sorted by number of votes, between 2000 and 2020




app.get("/", function(req, res){
    res.render("index");
    // getMovies();
})

// This url was used as a way to send the include and exclude variables to nodeJS so they can be used in the webscraper
app.get("/getmovie/*", function(req, res){

	url = req.headers.host + '/' + req.url;
	var movieDescriptionList = parseGenres(res, url)

    res.redirect("/");
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

    	url = url.substring(33);  // 33 - -1 is anything include= and beyond
		// console.log(url);
		// url becomes just a list of included and not included genres
		return getMovies(res, url);
	}
}
// Pre: requires request response and the variable genres which is a string with all of the IMDB movie genres included/excluded
// The format should be include= + includedGenres + &exclude= + excludedGenres
// ex include=comedy,horror&exclude=family,action
// In this example, it will show only comedy horror movies that do not include the genres family or action
//Post: Takes the genres list and adds it to the url, then webscrapes the url for the top 50 highest rated movies which include whats in genres variable, are feature films, and recieved 25k reviews
// For each movie it gets the name score and genre, then adds them to a description
// It then checks each movie to make sure it doesn't include an excluded genre 
//(The webscraper only gets access to the top 3 genres of a movie, so it isn't perfect, but IMDB doesn't include its own exclusion in advanced search and the webpage only shows the first 3 genres, so there is no other solution)
// At the end, it adds each non-exclude movie's genre, name, and score to the descriptionList variable and returns it 
function getMovies(res, genres)
{
	var url = "https://www.imdb.com/search/title/?genres=" + genres + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
	axios(url)
	.then(function(res){
		const html = res.data;
		const $ = cheerio.load(html);
		const horrorMoviesList = $(".lister-list > .lister-item");
		var descriptionList = "";

		horrorMoviesList.each(function(){
			const name = $(this).find(".lister-item-content > .lister-item-header > a").text();
			const genre = $(this).find(".lister-item-content > .text-muted > .genre").text();
			const score = $(this).find(".lister-item-content > .ratings-bar > .inline-block strong").text();
			var description = "The movie " + name + " had a score of " + score + " with the genres" + genre;

			var excludedGenres = genres.substring(genres.search("exclude="));
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
			// Loop to log description doesnt run if there are no exclusion, fixes
			console.log(descriptionList);
			return descriptionList;
		})
	})
	.catch(console.error);
}