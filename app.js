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

const genre = "comedy";
const url = "https://www.imdb.com/search/title/?genres=" + genre + "&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=HH90Q1ZC6DWPQX6ZJD8F&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1";
// IMDB list of top horror movies, sorted by number of votes, between 2000 and 2020

axios(url)
.then(function(res){
	const html = res.data;
	const $ = cheerio.load(html);
	const horrorMoviesList = $(".lister-list > .lister-item");

	horrorMoviesList.each(function(){
		const name = $(this).find(".lister-item-content > .lister-item-header > a").text();
		const score = $(this).find(".lister-item-content > .ratings-bar > .inline-block strong").text();
		const description = "The movie " + name + " had a score of " + score;
		console.log(description);
	})
})
.catch(console.error);


app.get("/", function(req, res){
    res.render("index");
})

console.log("Server running");
app.listen(port);