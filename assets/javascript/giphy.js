var baseURL = "https://api.giphy.com/v1/gifs/search?q=";
var apiKey = "dc6zaTOxFJmzC";
var inputVal = "";
var topics = ["Family Guy", "King of the Hill", "Adventure Time", "Bob's Burgers", "Archer", "Aqua Teen Hunger Force", "Home Movies"];
var queryURL = "";
var imgURL = "";

/* ------------------------------------------------------------------------ */

function resetSearch () {
    $("#search-input").val("");
}

/* clicking 'submit' creates a new topic button */
function searchGiphy (event) {
    event.preventDefault();

    inputVal = $("#search-input").val().trim();

    // Prob don't wanna do anything if the input is empty or if the value has already been added so just short circuit it and return
    if (inputVal.length == 0) return;

    if (topics.indexOf(inputVal) > -1) {
        resetSearch();
        return;
    }

    // add search to topics array for future duplication checks defined right above this
    topics.push(inputVal);
    createButtons();
    // Reset input after clicking search
    resetSearch();
}

function searchKeypress (event) {
    if (event.keyCode === 13) {  //checks whether the pressed key is "Enter"
        searchGiphy(event);
    }
}

/* adding new buttons, adding new topics to the topics array, and adding a space between new buttons */

function createButtons() {
    // this is kinda cheating but since you are adding the new input value to topics array everytime why not just clear out buttons
    // and regenerate with new topic included? seems simpler and like less code. There's arguments for both sides but the performance
    // hit is going to be unnoticable in this particular case.
    $("#queries").empty();

	for (var i=0; i<topics.length; i++) {
		var newButton = $("<button>");
		newButton.addClass("query-button");
		newButton.attr("data", topics[i]);
		newButton.text(topics[i]);
		$("#queries").append(newButton).append(" ").append(" ");
	}
}
createButtons();

// simple stuff like this is nice to have as it's own function as it can be much more descriptive
function resetGiphyResults () {
    $("#giphy-results").empty();
}

function showClickCallout () {
    $(".click-callout").show();
}

/* when a button is clicked, the api fetches 6 giphs and displays them as still images */

$(document).on("click", ".query-button", function(event) {
    event.preventDefault();

    showClickCallout();
    var topic = $(this).attr("data");
    var resultCount = 6;
    queryURL = baseURL + topic +"&limit=" + resultCount + "&api_key=" + apiKey;
    console.log(queryURL);
    resetGiphyResults();

    $.ajax({
	    url: queryURL,
	    method: "GET"
  	}).done(function(response) {
  		console.log(response);

  		var imgElem;
  		for (var i=0; i<6; i++) {
  			imgURL = response.data[i].images.fixed_width_still.url;
  			gifURL = response.data[i].images.fixed_width.url;
  			imgElem = $("<img>");
  			imgElem.attr("src", imgURL);
  			imgElem.attr("data-still", imgURL);
  			imgElem.attr("data-animate", gifURL);
  			imgElem.attr("data-state", "still");
  			imgElem.addClass("image-result");
  			$("#giphy-results").append(imgElem);
  		}
  	});
  });


/* if the image is clicked, the gif will animate */
$(document).on("click", ".image-result", function(event) {
    event.preventDefault();

    var state = $(this).attr("data-state");
    if (state === "still") {
    	$(this).attr("src", $(this).attr("data-animate"));
    	$(this).attr("data-state", "animate");
    } else {
    	$(this).attr("src", $(this).attr("data-still"));
    	$(this).attr("data-state", "still");
    }

    });
