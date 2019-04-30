// app.js 
// hw week 6 giftastic by Brenda Thompson

//***************** */
// globals
//***************** */

//***************** */
// objects
//***************** */
var giftastic = {
    topics: ['cat', 'dog', 'bird', 'simpsons'],
    parentButton: $('<div id="button-parent">'),

    initButtons: function() {
        // hang the parent button off of the body
        // prepend to ensure the buttons are at the top of the page
        $('.container').prepend(this.parentButton);
        this.renderButtons();
    },

    initForm: function() {
        var newButtonForm = $('<form id="new-button-form">');
        $('.container').append(newButtonForm);
     
        var newLabel = $('<label for="new-button-input">').text('Add a Button: ');
        $('#new-button-form').append(newLabel);
        var newInput = $('<input type="text" id="new-button-input" value="enter new button name">')
        $('#new-button-form').append(newInput);
        $('#new-button-form').append('<br>');
        newInput = $('<input id="add-new-button" type="submit" value="Add a Button, Yo!">')
        $('#new-button-form').append(newInput);
    },

    initGifArea: function() {
        var parentDivGif =  $('<div id="gifs-appear-here">');
        $('.container').append(parentDivGif);
    },

    createAndAppendNewButton: function(newButtonName) {
        // create a button
        var newButton = $('<button class="button" data-name="' + newButtonName + '">').text(newButtonName);
        // append it to the parent at end of the current buttons
        console.log(this);
        this.parentButton.append(newButton);
    },

    // Function for displaying buttons
    renderButtons: function() {
        this.topics.forEach(function(buttonName) {
            giftastic.createAndAppendNewButton(buttonName);
        });
    
    },

    addNewButton: function(newButtonName) {
        // add this name to button array
        this.topics.push(newButtonName);
        // remove old buttons
        $('#button-parent').empty();
        // create new buttons
        this.renderButtons();
    },


    // builds the query, sends it, processes and displays the results
    queryAPI: function(themeName) {
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        themeName + "&api_key=21pbXpSdx68vgJpuoB7wb0uQgVGGuGUg&limit=10&rating=g";
        //ubKLULw8MPJOnOQYC2FNHPGL4EWJLq64

        $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {
            var results = response.data;
            console.log(response);

            // go thru each gif
            for (var i = 0; i < results.length; i++) {

                var rating = results[i].rating;
                var title = results[i].title;
                var p = $('<p id="gif-info">').text('Title: ' + title + ' Rating: ' + rating);
                p.append('<br><br>');


                var gifDiv = $("<div>");
                var themeImage = $("<img>");
                themeImage.attr("src", results[i].images.fixed_height.url);
                themeImage.attr("alt", themeName + ' ' + title);

                gifDiv.prepend(themeImage);
                gifDiv.append(p);

                $("#gifs-appear-here").prepend(gifDiv);
            }
      });
    },

};


//***************** */
// run this code when we load the page
//***************** */
$(document).ready(function() {
    giftastic.initButtons();
    giftastic.initForm();
    giftastic.initGifArea();

    // Add a new button 
    $('#new-button-form').on("click", '#add-new-button', function(event) {
        // Using a submit button/input  instead of a regular button/input allows the user to hit
        // "Enter" instead of clicking the button if desired
        // the prevent default line prevents the form reload/action when this happens
        event.preventDefault();
        console.log("in click event.");

        // grab the text and clear the input field
        var inputButtonName = $('#new-button-input').val();
        $('#new-button-input').val("");
        // add the new button to the list
        if (inputButtonName) {
            giftastic.addNewButton(inputButtonName);
        }
    });

    // One of the buttons has been clicked - perform button's action
    $("#button-parent").on("click", '.button', function() {
        console.log('button clicked: ' + $(this).attr('data-name'));
        giftastic.queryAPI($(this).attr('data-name'));
    });
});