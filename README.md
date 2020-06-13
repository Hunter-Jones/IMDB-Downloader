Movie Downloader
==============

<!-- Build Status
-------------- -->
<!-- [![HunterJones](https://circleci.com/gh/<HunterJones>/MovieDownloader.svg?style=svg)](https://github.com/Hunter-Jones/IMDB-Downloader) -->

What is the purpose?
--------------
The concept of it is a website where the user enters genres they want to include or exclude from the search. They then click generate, and it creates a list of highest rated IMDB movies (with 25,000 votes or more) which the user can copy and paste. It also has the ability to generate links to torrent files, so that the user can just copy the link and paste it to download the movie easily (requires torrenting software).

Why was it created?
--------------
I watch a lot of horror movies, and often have a hard time finding new movies to watch. The idea of a website which generates movies based on a genre AND gives a download file seemed really convienient and seemed like it would be a fun thing to work on. I also have been reading a lot past what was in the computer science 1 half of my school textbook and wanted to work on a project so that I can use the information that I learn. I am learning C++ in class, but wanted to do a web development project since I have not worked on one in a long time.

What was this made with?
--------------
- HTML (ejs), CSS (Sass), and JS for front end
- Node.js for backend

Problems when creating:
--------------
- The biggest issue was trying to get the frontend genre's variable to Node.js. To solve this I used an unconventional and inefficient way of doing it by redirecting to a URL which contains the information, then redirecting back. Not the greatest soludtion, but it worked.
- Another problem is the long amount of time it takes for the torrent API to work for multiple torrents. The solution I came up with is to have the list be updated each time the user clicks a copy button. It might not include all of the files, but it will work to get the user as many as it can. 

Things I learned: 
--------------
- This was my first time creating a project by creating web scraping, which was fun to learn how to use, since it has so many practical uses. 
- This was also my first time using the CSS pre-processor, SASS, which I really enjoyed and plan to use in future projects after this.
- This was also project using git via command line and not using a GUI.
- This was lastly my first large project that isn't a portfolio website.