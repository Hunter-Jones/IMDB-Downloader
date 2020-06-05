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
app.get("/getmovie/*", function(req, res){

	url = req.headers.host + '/' + req.url;
	if (url.includes("include="))
	{

    	url = url.substring(33);  // 33 - -1 is anything include= and beyond
		// console.log(url);
		// url becomes just a list of included and not included genres
		getMovies(req, res, url);
	}

    res.redirect("/");
})

console.log("Server running");
app.listen(port);

function getMovies(req, res, genres)
{
	var url = "https://www.imdb.com/search/title/?genres=" + genres + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
	axios(url)
	.then(function(res){
		const html = res.data;
		const $ = cheerio.load(html);
		const horrorMoviesList = $(".lister-list > .lister-item");

		horrorMoviesList.each(function(){
			const name = $(this).find(".lister-item-content > .lister-item-header > a").text();
			const genre = $(this).find(".lister-item-content > .text-muted > .genre").text();
			const score = $(this).find(".lister-item-content > .ratings-bar > .inline-block strong").text();
			const description = "The movie " + name + " had a score of " + score + " with the genres" + genre;

			var excludedGenres = genres.substring(genres.search("exclude="));
			excludedGenres = excludedGenres.substring(8);
			var excludedGenresList = excludedGenres.split(",");
			// Checks if genres includes excluded genre
			for (var i = 0; i < excludedGenresList.length; ++i)
			{
				if (!genre.includes(excludedGenresList[i]))
				{
					console.log(description);
					// Only shows non-excluded genres
				}
			}
			
		})
	})
	.catch(console.error);
}