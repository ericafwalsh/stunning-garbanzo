

require("dotenv").config();
var keys = require("./keys.js");


// require axios
var axios = require("axios");

// require spotify
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var fs = require("fs");

var songName = "";
var movieName = "";

// Defining a function for a spotify function
// Need to make sure default song is "The Sign" by Ace of Base. and make it work with spaces
function spotifyCall() {

    if (process.argv[3] === undefined) {
        songName = "The Sign";
    }
    else {
        songName = process.argv[3];
    };

    spotify.search({ type: 'track', query: songName }, function (err, response) {
        if (err) {
            return console.log(err);
        }


        var artists = response.tracks.items[0].album.artists[0].name;
        var songsName = response.tracks.items[0].name;
        var albumName = response.tracks.items[0].album.name;
        var previewLink = response.tracks.items[0].external_urls.spotify;

        console.log("Artist(s): " + artists);
        console.log("The song's name is: " + songsName);
        console.log("Link to the song on Spotify: " + previewLink);
        console.log("The album's name: " + albumName);

    });
};

// make it OK with less than 10 events
if (process.argv[2] === "concert-this") {

    var artist = process.argv[3];

    axios
        .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")

        .then(function (response) {

            // If there are more than 10 upcoming events, only show the next 10
            for (i = 0; i < 10; i++) {
                var venueName = response.data[i].venue.name;
                var venueLocation = response.data[i].venue.city + ", " + response.data[i].venue.country;
                var date = response.data[i].datetime;

                console.log("Upcoming Event " + (i + 1));
                console.log("Venue Name: " + venueName);
                console.log("Venue Location: " + venueLocation);
                console.log("Date: " + date.substring(0, 10));
            }
        });

}


else if (process.argv[2] === "spotify-this-song") {

    spotifyCall();

}

// Need to make it work with spaces
// Need to fix rotten tomatoes rating
else if (process.argv[2] === "movie-this") {

    if (process.argv[3] === undefined) {
        movieName = "Mr. Nobody";
    }
    else {
        movieName = process.argv[3];
    };

    axios
        .get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)

        .then(function (response) {

            console.log("Movie title: " + response.data.Title);
            console.log("Year it came out: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            // Need to fix rating
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

        });

}

else if (process.argv[2] === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        process.argv[2] = dataArr[0];
        process.argv[3] = dataArr[1];
        spotifyCall();


    });

}