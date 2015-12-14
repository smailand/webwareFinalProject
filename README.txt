For the technical achievement portion of this assignment I found an online (and free) API that returns JSON data, which I use to search for movies.

I do all of the searching on the client side (the server only serves up the initial html).  I also use the IMDb ID that the API
provides to dynamically create a link to the IMDb page.

I decided to do this to continue the theme that we have been working on this whole term (movies). The three templates that I use are
three different amounts of information that is shown when a movie is searched, described below:

Summary: A brief summary of a movie, with only the most basic information

Some detail: A bit more details than the 'summary', such as the actors, but still not a full description of the movie.

Everything: This displays all of the information that the API that I was using gave back. This includes IMDb ratings, with how many
            votes had been cast, awards the show/movie has won, the run time, and other info.

I also decided to keep previous searches on the page as a type of search history
(as I don't have the URL changing so that it can be searched with again).

It also prints out an error message if the movie isn't found or if there is any other error with the API.

Found at:

https://sfmailand-cs4241.herokuapp.com/assignment7
