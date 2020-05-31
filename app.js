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

const url = "https://www.imdb.com/list/ls026579006/?sort=num_votes,desc&st_dt=&mode=detail&page=1";
// IMDB list of top horror movies, sorted by number of votes, between 2000 and 2020

// axios(url)
// .then(function(res){
// 	const html = res;
// 	const $ = cheerio.load(html);
// 	const horrorMoviesList = ("lister-item mode-detail");
// 	console.log(horrorMoviesList.length);

// // Guide from : https://pusher.com/tutorials/web-scraper-node
// // Figure out why it is undefined
// // When you take out the > and lister-item it works 
// });


app.get("/", function(req, res){
    res.render("index");
})
// app.get("/about", function(req, res){
//     res.render("about");
// })
console.log("Server running");
app.listen(port);