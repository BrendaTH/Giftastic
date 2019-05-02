// app.js 
// hw week 6 giftastic by Brenda Thompson

//***************** */
// globals
//***************** */
var giphyInfoLocation = document.getElementById('giphy-data');
//***************** */
// objects
//***************** */
var giftastic = {
    topics: ['lisa simpson', 'bart simpson', 'marge simpson', 'maggie simpson', 'ned flanders', 'homer simpson', 'krusty the clown', 'simpsons'],
    newInputValue: 'enter your own character here',
    initButtons: function() {
        // create instructions for buttons and form
        var instructionNode = document.createElement('p');
        instructionNode.textContent = 'Click on a conveniently, already made button, ' 
                + 'or create your own button with your favorite character!';
        giphyInfoLocation.appendChild(instructionNode);

        // hang the parent button off of the body
        // prepend to ensure the buttons are at the top of the page
        var divNode = document.createElement('div');
        divNode.setAttribute('id', 'button-parent');
        giphyInfoLocation.appendChild(divNode);
        this.renderButtons();
    },

    initForm: function() {
        // <form id='new-button-form'>
        var newButtonForm = document.createElement('form');
        newButtonForm.setAttribute('id', 'new-button-form');
        giphyInfoLocation.appendChild(newButtonForm);

        // <div class='form-group'>
        var divGroup = document.createElement('div');
        divGroup.className = 'form-group';
        newButtonForm.appendChild(divGroup);

        // <label for='new-button-input'>More characters: 
        var newLabel = document.createElement('label');
        newLabel.setAttribute('for', 'new-button-input');
        newLabel.textContent = 'More characters: ';
        divGroup.appendChild(newLabel);

        // <input type='text' id='new-button-input' class='form-control'/>
        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('id', 'new-button-input');
        newInput.className = 'form-control bg-primary text-light input-fields';

        newInput.setAttribute('onfocus', "this.value=''");
        newInput.setAttribute('value', this.newInputValue);
        newInput.setAttribute('data-toggle', 'tooltip');
        newInput.setAttribute('data-placement', 'top');
        newInput.setAttribute('title', 'Input your own favorite character here');
        divGroup.appendChild(newInput);

        // <input type='submit' class='form-control' id='add-new-button' value='Submit here, Doh!/>
        var newInputButton = document.createElement('input');
        newInputButton.setAttribute('type', 'submit');
        newInputButton.className = 'form-control bg-primary text-light input-fields';
        newInputButton.setAttribute('id', 'add-new-button');
        newInputButton.setAttribute('value', 'Submit here, Doh!');
        divGroup.appendChild(newInputButton);
    },

    initGifArea: function() {
        // create the parent div for the gifs
        var parentDivGif = document.createElement('div');
        parentDivGif.className = 'container text-muted';
        
        // create the row div for the gifs
        var rowDivGif = document.createElement('div');
        rowDivGif.setAttribute('id', 'gifs-appear-here');
        rowDivGif.setAttribute('class', 'row');
        // append the row to the parent
        parentDivGif.appendChild(rowDivGif);
        // append the parent to the giphy area
        giphyInfoLocation.appendChild(parentDivGif);

    },

    createAndAppendNewButton: function(newButtonName) {
        // create a button
        var newButton = document.createElement('button');
        newButton.setAttribute('type', 'button');
        newButton.className = 'button btn btn-primary';
        
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
        characterStr + "&api_key=21pbXpSdx68vgJpuoB7wb0uQgVGGuGUg&limit=10";
        //ubKLULw8MPJOnOQYC2FNHPGL4EWJLq64  (try this key if the other one fails )
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
                // h3 <== title text
                var title = document.createTextNode("Title: " + results[i].title);
                var headerTitle = document.createElement('h3');
                headerTitle.setAttribute('class', 'card-title');
                headerTitle.appendChild(title);

                // p <== rating text
                var rating = document.createTextNode("Rating: " + results[i].rating);
                var headerPara = document.createElement('p');
                headerPara.appendChild(rating);

                var gifBlock = document.createElement('div');
                gifBlock.className = 'card-block border border-primary';
                gifBlock.append(headerTitle);
                gifBlock.append(headerPara);


                var themeImage = document.createElement('img');
                themeImage.setAttribute('src', results[i].images.fixed_height.url);
                themeImage.className = 'card-image-top img-fluid';

                var gifColumn = document.createElement('div');
                gifColumn.className = 'col-md-3';
                gifColumn.append(themeImage);
                gifColumn.append(gifBlock);

                $("#gifs-appear-here").prepend(gifColumn);
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
        // add the new button to the list
        if (inputButtonName && inputButtonName !== giftastic.newInputValue) {
            giftastic.addNewButton(inputButtonName);
            $('#new-button-input').val("");
        }
    });

    // One of the buttons has been clicked - perform button's action
    $("#button-parent").on("click", '.button', function() {
        console.log('button clicked: ' + $(this).attr('data-name'));
        giftastic.queryAPI($(this).attr('data-name'));
    });
});