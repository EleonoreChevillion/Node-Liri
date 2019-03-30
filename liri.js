require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var command = process.argv[2];
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var searchString = "";
for (var i = 3; i < process.argv.length; i++) {
  if (i == process.argv.length - 1) {
    searchString += process.argv[i];
  } else {
    searchString += process.argv[i] + "+";
  }
}
if (command === "concert-this") {
  findConcert(searchString);
} else if (command === "spotify-this-song") {
  findMusic(searchString);
} else if (command === "movie-this") {
  findMovie(searchString);
} else if (command === "do-what-it-says") {
  readText();
}

function findMusic(input) {
  if (!searchString) {
    spotify.search({ type: "track", query: "The Sign Ace of Base" }, function(
      err,
      data
    ) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.log("No song provided: Here is a default track");
      console.log("Song:", data.tracks.items[0].name);
      console.log("Artist(s):", data.tracks.items[0].artists[0].name);
      if (data.tracks.items[i].preview_url === null) {
        console.log("No Preview URL");
      } else {
        console.log("Preview URL:", data.tracks.items[0].preview_url);
      }
      console.log("Album:", data.tracks.items[0].album.name);
      console.log("---------");
    });
  } else {
    spotify.search({ type: "track", limit: 1, query: input }, function(
      err,
      data
    ) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      console.log("---------");
      for (var i = 0; i < data.tracks.items.length; i++) {
        console.log("Song:", data.tracks.items[i].name);
        console.log("Artist(s):", data.tracks.items[i].artists[0].name);
        if (data.tracks.items[i].preview_url === null) {
          console.log("No Preview URL");
        } else {
          console.log("Preview URL:", data.tracks.items[i].preview_url);
        }
        console.log("Album:", data.tracks.items[i].album.name);
        console.log("---------");
      }
    });
  }
}
function findConcert(input) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        searchString +
        "/events?app_id=codingbootcamp"
    )
    .then(function(response) {
      console.log("Here are the upcoming events for " + searchString);
      console.log("---------");
      response.data.forEach(function(event) {
        console.log("Venue Name:", event.venue.name);
        console.log(
          "Venue Location:",
          event.venue.city +
            " " +
            event.venue.region +
            " " +
            event.venue.country
        );
        console.log(
          "Venue Time: ",
          moment(event.datetime).format("MM/DD/YYYY, h:mm a")
        );
        console.log("---------");
      });
    });
}
function findMovie(input) {
  axios
    .get(
      "http://www.omdbapi.com/?t=" +
        searchString +
        "&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      console.log("Title:", response.data.Title);
      console.log("Year:", response.data.Year);
      console.log("IMDB Rating:", response.data.imdbRating);
      console.log("Rotten Tomatoes Rating:", response.data.Metascore);
      console.log("Country:", response.data.Country);
      console.log("Language(s):", response.data.Language);
      console.log("Plot:", response.data.Plot);
      console.log("Actors:", response.data.Actors);
      console.log("---------");
    });
}

function readText() {
  fs.readFile("random.txt", "utf8", (err, data) => {
    if (err) throw err;
    var text = data;
    var res = data.split(",");
    console.log(res);
    process.argv[2] = res[0];
    searchString = res[1];
    findMusic(searchString);
  });
}

var input = command + " " + searchString + "\n";

fs.appendFile("log.txt", input, err => {
  if (err) {
    return console.log(err);
  }

  console.log("Action complete");
});
