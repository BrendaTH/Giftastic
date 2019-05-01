// app.js 
// hw week 6 giftastic by Brenda Thompson

//***************** */
// globals
//***************** */
var theContainer = document.querySelector(".container");
var giphyInfoLocation = document.getElementById('giphy-data');
//***************** */
// objects
//***************** */
var giftastic = {
    topics: ['lisa simpson', 'bart simpson', 'marge simpson', 'maggie simpson', 'simpsons'],

    initButtons: function() {
        // hang the parent button off of the body
        // prepend to ensure the buttons are at the top of the page
        var divNode = document.createElement('div');
        divNode.setAttribute('id', 'button-parent');
        giphyInfoLocation.appendChild(divNode);
        this.renderButtons();
    },

    initForm: function() {
        var newButtonForm = document.createElement('form');
        newButtonForm.setAttribute('id', 'new-button-form');
        giphyInfoLocation.appendChild(newButtonForm);

        var newLabel = document.createElement('label');
        newLabel.setAttribute('for', 'new-button-input');
        newLabel.textContent = 'Add a Button: ';
        newButtonForm.appendChild(newLabel);

        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('id', 'new-button-input');
        newInput.setAttribute('value', 'enter new button name');
        newButtonForm.appendChild(newInput);

        newButtonForm.appendChild(document.createElement('br'));

        // var newInputButton = document.createElement('input');
        var newInputButton = document.createElement('input');
        newInputButton.setAttribute('id', 'add-new-button');
        newInputButton.setAttribute('type', 'submit');
        newInputButton.setAttribute('value', 'Add a Button, Doh!');
        newButtonForm.appendChild(newInputButton);
    },

    initGifArea: function() {
        var parentDivGif = document.createElement('div');
        parentDivGif.setAttribute('id', 'gifs-appear-here');
        giphyInfoLocation.appendChild(parentDivGif);
    },

    createAndAppendNewButton: function(newButtonName) {
        // create a button
        var newButton = document.createElement('button');
        newButton.setAttribute('class', 'button');
        newButton.setAttribute('data-name', newButtonName);
        newButton.textContent = newButtonName;
        document.getElementById('button-parent').appendChild(newButton);
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
        var btnParent = document.getElementById('button-parent');
        while (btnParent.firstChild) {
            btnParent.removeChild(btnParent.firstChild);
        }
        // create new buttons
        this.renderButtons();
    },


    // builds the query, sends it, processes and displays the results
    queryAPI: function(themeName) {
        var characterStr = themeName.split(" ").join("+");

        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        characterStr + "&api_key=21pbXpSdx68vgJpuoB7wb0uQgVGGuGUg&limit=10&rating=g";
        //ubKLULw8MPJOnOQYC2FNHPGL4EWJLq64
        console.log("queryURL: " + queryURL);
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