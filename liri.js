// Requiring axios, dotenv, spotify api, and fs, etc.
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

// Defining variables
var songName = "";
var movieName = "";

// Defining a function for a spotify api call since it is used twice
// Need to make sure default song is "The Sign" by Ace of Base. 
function spotifyCall() {

    if (process.argv[3] === undefined) {

        spotify.search({ type: 'track', query: "The Sign" }, function (err, response) {
            if (err) {
                return console.log(err);
            }

            spotifySong = response.tracks.items;

            for (i = 0; i < spotifySong.length; i++) {

                if (spotifySong[i].album.artists[0].name === "Ace of Base" && spotifySong[i].name === "The Sign") {

                    var artists = spotifySong[i].album.artists[0].name;
                    var songsName = spotifySong[i].name;
                    var previewLink = spotifySong[i].external_urls.spotify;
                    var albumName = spotifySong[i].album.name;

                    console.log("Artist(s): " + artists);
                    console.log("The song's name is: " + songsName);
                    console.log("Link to the song on Spotify: " + previewLink);
                    console.log("The album's name: " + albumName);
                }
            };

        })

    }

    else {

        songName = process.argv.slice(3).join(" ");

        spotify.search({ type: 'track', query: songName }, function (err, response) {
            if (err) {
                return console.log(err);
            }

            spotifySong = response.tracks.items;

            for (i = 0; i < spotifySong.length; i++) {

                var artists = spotifySong[i].album.artists[0].name;
                var songsName = spotifySong[i].name;
                var previewLink = spotifySong[i].external_urls.spotify;
                var albumName = spotifySong[i].album.name;

                console.log("RESULT " + parseInt(i + 1));
                console.log("Artist(s): " + artists);
                console.log("The song's name is: " + songsName);
                console.log("Link to the song on Spotify: " + previewLink);
                console.log("The album's name: " + albumName);
            }

        })
    }
}

    // If the user enters the "concert-this" command, then:
    if (process.argv[2] === "concert-this") {

        var artist = process.argv.slice(3).join(" ");

        axios
            .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")

            .then(function (response) {

                var concertData = response.data;

                for (i = 0; i < concertData.length; i++) {
                    var venueName = concertData[i].venue.name;
                    var venueLocation = concertData[i].venue.city + ", " + response.data[i].venue.country;
                    var date = concertData[i].datetime;

                    console.log("UPCOMING EVENT " + parseInt(i + 1));
                    console.log("Venue Name: " + venueName);
                    console.log("Venue Location: " + venueLocation);
                    console.log("Date: " + date.substring(0, 10));
                }
            });
    }

    // If the user enters "spotify-this-song" command, then call the spotifyCall function
    else if (process.argv[2] === "spotify-this-song") {
        spotifyCall();
    }

    // If the user enters the "movie-this" command, then:
    else if (process.argv[2] === "movie-this") {

        if (process.argv[3] === undefined) {
            movieName = "Mr. Nobody";
        }
        else {
            movieName = process.argv.slice(3).join(" ");
        };

        axios
            .get("http://www.omdbapi.com/?apikey=trilogy&t=" + movieName)

            .then(function (response) {

                var movieData = response.data;

                console.log("Movie title: " + movieData.Title);
                console.log("Year it came out: " + movieData.Year);
                console.log("IMDB Rating: " + movieData.imdbRating);

                // Loop through ratings to make sure only Rotten Tomatoes rating is printed
                for (i = 0; i < movieData.Ratings.length; i++) {

                    if (movieData.Ratings[i].Source === "Rotten Tomatoes") {
                        console.log("Rotten Tomatoes Rating: " + movieData.Ratings[i].Value);
                    }
                };

                console.log("Language: " + movieData.Language);
                console.log("Plot: " + movieData.Plot);
                console.log("Actors: " + movieData.Actors);

            });

    }

    // If the user enters the "do-what-it-says" command, then:
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