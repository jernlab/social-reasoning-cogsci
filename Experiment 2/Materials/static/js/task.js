/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
    "instructions/instruct-1.html",
    "instructions/instruct-review.html",
    "stage.html",
    "postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
    "instructions/instruct-1.html",
];
var returnInstructions = [ // add as a list as many pages as you like
    "instructions/instruct-review.html",

];

/********************
 * HTML manipulation
 *
 * All HTML files in the templates directory are requested 
 * from the server when the PsiTurk object is created above. We
 * need code to get those pages from the PsiTurk object and 
 * insert them into the document.
 *
 ********************/

/********************
 * STROOP TEST       *
 ********************/

var InteractionsExperiment = function() {
    debug = 0;

    var wordon, // time word is presented
	listening = false;

    var availableNames = _.shuffle(['Jacob', 'David', 'Luke', 'Rebecca', 'Matt', 'Jack', 'Frank', 'Geoff', 'Robert', 'Emily', 'Zoe', 'Maria', 'Austin', 'Hannah', "Matthew", 'Gavin', 'William', "Logan", 'Ryan', 'Sydney', 'Lauren', 'Kate', 'Megan', 'Kaylee', 'Olivia', 'Daniel', 'Richmond', 'Gerald', 'Sally']);

    var attentionGame = {gameString:"attentionGame", game:[[8, 8],[12, 0],[0, 12],[4,4]], choices:_.shuffle([1])}       //???
    var pd = {gameString:"pd", game:[[8, 8],[0, 12],[12, 0],[4,4]], choices:_.shuffle([0 ,1, 3])}                            // 0 1 3
    var threat = {gameString:"threat", game:[[12, 6],[6, 12],[6, 0],[0,6]], choices:_.shuffle([ 0, 1, 2, 3])}                      //  0 1 2 3
    var disjunctive = {gameString:"disjunctive", game:[[12,12], [12,12], [12,12], [0,0]], choices:_.shuffle([0, 3])}      //  0 3
    var coordination = {gameString:"coordination", game:[[12,12], [0,0], [0,0], [12,12]], choices:_.shuffle([ 0, 1])}       //  0 1
    var singleControl = {gameString:"singleControl", game:[[6,6], [0,6], [6,6], [0,6]], choices:_.shuffle([0, 1])}              //  0 1

    var rowChoices = [0,1,2,3,4]
    var playerChoices = ["A","B"]
    var results = {}

    var buildFirstTableString = function(game, players, selected, pngSuffix){
	tablestr = "<table class=\"tg\"><tr><th class=\"tg-baqh\"></th><th class=\"tg-baqh\"></th><th class=\"tg-sysp\" colspan=\"2\">" + players[1] + "</th></tr><tr><td class=\"tg-baqh\"></td><td class=\"tg-baqh\"></td><td class=\"tg-sysp\">A</td><td class=\"tg-sysp\">B</td></tr><tr><td class=\"tg-zaau\" rowspan=\"2\">" + players[0] + "</td><td class=\"tg-zaau\">A</td><td class=\"tg-baqh\" colspan=\"2\" rowspan=\"2\"><img src=\"../static/game_images/" + game.gameString + selected + pngSuffix + ".PNG\"></td></tr><tr><td class=\"tg-zaau\">B</td></tr></table>";

	return tablestr;
    };
    
    var buildSecondTableString = function(game, players, selected){
	tablestr = "<table class=\"tg\"><tr><th class=\"tg-baqh\"></th><th class=\"tg-baqh\"></th><th class=\"tg-sysp\" colspan=\"2\">" + players[1] + "</th></tr><tr><td class=\"tg-baqh\"></td><td class=\"tg-baqh\"></td><td class=\"tg-sysp\">A</td><td class=\"tg-sysp\">B</td></tr><tr><td class=\"tg-zaau\" rowspan=\"2\">" + players[0] + "</td><td class=\"tg-zaau\">A</td><td class=\"tg-baqh\" colspan=\"2\" rowspan=\"2\"><img src=\"../static/game_images/" + game.gameString + selected + ".PNG\"></td></tr><tr><td class=\"tg-zaau\">B</td></tr></table>"

	return tablestr;
    };

    friendsAnswered1 = false 
    enemiesAnswered1 = false 
    justificationAnswered1 = false

    friendsAnswered2 = false 
    enemiesAnswered2 = false 
    justificationAnswered2 = false

    var gamesetup = function(names) {
	// This clears all state variables, generates the next scenario shown to the player, 
	// and generates some HTML elements to be displayed on page

	var pngSuffix = _.shuffle(["_h","_v"])[0]
	
	var firstP = (pngSuffix === "_h") ? names[0] : names[1]
	var firstC = (pngSuffix === "_h") ? playerChoices[Math.floor(game.choice/2)] : playerChoices[Math.floor(game.choice%2)]
	var firstColor = (pngSuffix === "_h") ? "<span style=\"color:#c55a11\">" : "<span style=\"color:#4472C4\">"
	var firstR = (pngSuffix === "_h") ? game.game[game.choice][0] : game.game[game.choice][1]

	var secondP = (pngSuffix === "_h") ? names[1] : names[0]
	var secondC = (pngSuffix === "_h") ? playerChoices[Math.floor(game.choice%2)] : playerChoices[Math.floor(game.choice/2)]
	var secondColor = (pngSuffix === "_h") ? "<span style=\"color:#4472C4\">" : "<span style=\"color:#c55a11\">"
	var secondR = (pngSuffix === "_h") ? game.game[game.choice][1] : game.game[game.choice][0]

	friendsAnswered1 = false 
	enemiesAnswered1 = false 
	justificationAnswered1 = false

	friendsAnswered2 = false 
	enemiesAnswered2 = false 
	justificationAnswered2 = false
	
	$("#friends1").click(function(){friendsAnswered1 = true; $("#friendsdiv1").css('background-color', "white")}) ;
	$("#enemies1").click(function(){enemiesAnswered1 = true; $("#enemiesdiv1").css('background-color', "white")}) ;
	$("#judgements1").click(function(){justificationAnswered1 = true; $("#judgements1").css('background-color', "white")}) ;
	
	$("#friends2").click(function(){friendsAnswered2 = true; $("#friendsdiv2").css('background-color', "white")}) ;
	$("#enemies2").click(function(){enemiesAnswered2 = true; $("#enemiesdiv2").css('background-color', "white")}) ;
	$("#judgements2").click(function(){justificationAnswered2 = true; $("#judgements2").css('background-color', "white")}) ;
	
	// Reset the instructions button, and add a listener that will reload 
	$("#instructionButton").off( 'click.someNamespace')
	$("#instructionButton").on( 'click.someNamespace', function(){
	    console.log("Setting up new trial");
	    state = $('body').html()
	    psiTurk.doInstructions(
		returnInstructions, // a list of pages you want to display in sequence
		function() { $('body').html(state);
			     gamesetup(names)} // what you want to do when you are done with instructions
            );
        })


	// Sets up sliders and gets the names of the fake players
	console.log(game.choice)

	d3.select('#attention1').html("");
	d3.select('#names1').html(firstP + " and " + secondP + " are playing the game shown below. " + firstP + " goes first and chooses option " + firstColor + firstC + "</span>.");
	d3.select("#table1").html(buildFirstTableString(game, names, game.choice, pngSuffix));
	d3.select("#prompt1").html("Based only on " + firstP + "'s choice, how likely is it that the two players are...");
	d3.select("#friends1").property('value',50)
	d3.select("#enemies1").property('value',50)
	d3.select("#judgements1").property('value','')
	
	d3.select('#attention2').html("");
	d3.select('#names2').html("Following " + firstP + "'s choice, " + secondP + " chooses option " + secondColor + secondC + "</span>. This resulted in "+firstP+" receiving $" + firstR + ", and "+secondP+" receiving $"+secondR +".");
	d3.select("#table2").html(buildSecondTableString(game, names, game.choice));
	d3.select("#prompt2").html("Now, based on both choices, how likely is it that the two players are...");
	d3.select("#friends2").property('value',50)
	d3.select("#enemies2").property('value',50)
	d3.select("#judgements2").property('value','')

	// Sets up click listeners for the continue button
	// verifies all of the logic, and makes sure that the user has made a judgement
	$("#moveon").off('click.someSpace');
	$("#moveon").on('click.someSpace', function () {
	    friendProb1 = d3.select("#friends1")[0][0].value
            enemyProb1 = d3.select("#enemies1")[0][0].value
            judgements1 = d3.select("#judgements1")[0][0].value

	    tocontinue = true
	    var judgement1 = $.trim($("#judgements1").val());
	    if (!debug) {
		if(!friendsAnswered1 && friendProb1==50 ){
		    console.log("A question was left unanswered.")
		    $("#friendsdiv1").css('background-color', "#ffe0e0")
		    tocontinue = false
		}
		if(!enemiesAnswered1 && enemyProb1==50 ){
		    console.log("A question was left unanswered.")
		    $("#enemiesdiv1").css('background-color', "#ffe0e0")
		    tocontinue = false
		}
		if(!justificationAnswered1 || judgement1.length <= 0){
		    console.log("A question was left unanswered.")
		    $("#judgements1").css('background-color', "#ffe0e0")
		    tocontinue = false
		}
		if(!tocontinue){
		    // alert("Please answer for all of the fields")
		    return
		}
            }
	    $("#trial1").hide();
	    window.scrollTo(0,0);
	    $("#trial2").show();
	    
	});
	

	// Sets up click listeners for the next button
	// verifies all of the logic, and makes sure that the user has made a judgement
	$("#nextbutton").off('click.someSpace');
	$("#nextbutton").on('click.someSpace', function () {
	    friendProb2 = d3.select("#friends2")[0][0].value
	    enemyProb2 = d3.select("#enemies2")[0][0].value
	    judgements2 = d3.select("#judgements2")[0][0].value
	    tocontinue = true
	    var judgement2 = $.trim($("#judgements2").val());
	    if(!debug){

		
		if(!friendsAnswered2 && friendProb2==50 ){
		    console.log("A question was left unanswered.")
		    $("#friendsdiv2").css('background-color', "#ffe0e0")
		    tocontinue = false
		}
		if(!enemiesAnswered2 && enemyProb2==50 ){
		    console.log("A question was left unanswered.")
		    $("#enemiesdiv").css('background-color', "#ffe0e0")
		    tocontinue = false
		}
		if(!justificationAnswered2 || judgement2.length <= 0){
		    console.log("A question was left unanswered.")
		    $("#judgements2").css('background-color', "#ffe0e0")
		    tocontinue = false
		}

		if(!tocontinue){
		    // alert("Please answer for all of the fields")
		    return
		}
            }


            
            results[[game.gameString,row]] = {'game':game.gameString,
					      'outcome':game.choice,
					      'friendProb1':friendProb1,
					      'enemyProb1':enemyProb1,
					      'judgements1':judgements1,
					      'friendProb2':friendProb2,
					      'enemyProb2':enemyProb2,
					      'judgements2':judgements2
					     }
            psiTurk.recordTrialData({'phase':'TRIAL',
				     'game':game.gameString,
				     'outcome':game.choice,
				     'firstPlayer':pngSuffix,
				     'choice1':firstC,
				     'friendsProb1':friendProb1,
				     'enemyProb1':enemyProb1,
				     'judgements1':judgements1,
				     'choice2':secondC,
				     'friendsProb2':friendProb2,
				     'enemyProb2':enemyProb2,
				     'judgements2':judgements2
				     // 'playerA':names[0],
				     // 'playerB':names[1]
				    })
            psiTurk.saveData()


            next();
	});
    }


    chosenNames = [0,0]
    nTrials = 13

    // Randomly generate trial order
    stims = _.shuffle(rowChoices);
    games = _.shuffle([pd, threat, disjunctive, coordination, singleControl])
    trials = []
    i=0
    for(i in games){
	console.log(games[i])
	for(j in games[i].choices){
	    trials.push({gameString:games[i].gameString,
			 game:games[i].game,
			 choice :games[i].choices[j]
			})
	}
    }
    games = trials

    // generate index of attention check after trial 9 (generates an index between 2 and 5)
    attention = Math.floor(Math.random() * (trials.length - 10) + 2);
    console.log(attention)
    console.log(trials)
    counter = 0
    game = null
    nTrials = trials.length + 1



    // generates the next scenario and chooses the fake player names
    var next = function() {
	window.scrollTo(0,0);
	counter++;
	d3.select("#trialNumber").html("Case "+counter+" of "+(nTrials))
	chosenNames = [availableNames.shift(),availableNames.shift()]
	row = Math.floor(Math.random() * 4 );

        // Reset all the forms
        d3.select("#friends1").property('value',50)
        d3.select("#enemies1").property('value',50)
        $("#friendsdiv1").css('background-color', "white")
        $("#enemiesdiv1").css('background-color', "white")
        $("#judgements1").css('background-color', "white")

	d3.select("#friends2").property('value',50)
        d3.select("#enemies2").property('value',50)
        $("#friendsdiv2").css('background-color', "white")
        $("#enemiesdiv2").css('background-color', "white")
        $("#judgements2").css('background-color', "white")

	$("#trial1").show();
	$("#trial2").hide();



        if (games.length == 0) {
            finish();
        } else if (games.length == attention) {
            game=attentionGame
	    d3.select('#names1').html("");
	    d3.select('#prompt1').html("");
            d3.select('#attention1').html("Please enter just a \"0\" in the text box and hit next, so that we know you are still paying attention.");
            d3.select("#judgements1").property('value','');
            d3.select("#table1").html(buildFirstTableString(game, chosenNames, row));
	    
            d3.select('#names2').html("");
	    d3.select('#prompt2').html("");
            d3.select('#attention2').html("Please enter just a \"0\" in the text box and hit next, so that we know you are still paying attention.");
            d3.select("#judgements2").property('value','');
            d3.select("#table2").html(buildSecondTableString(game, chosenNames, row));
            console.log("attention check")
            attention = 500
        } else {
            game = games.shift();
	    
	    wordon = new Date().getTime();
	    gamesetup(chosenNames)

	}
    };


    // Submits data when all scenarios are completed

    var finish = function() {
	strings = {attentionGame:"attentionGame", pd:"pd", threat:"threat", disjunctive:"disjunctive", coordination:"coordination", singleControl:"singleControl"}
	var rt = new Date().getTime() - wordon;    

	console.log(results)
	for(item in results){
	    console.log("item")
	    console.log(results[item[0]])
        }

        currentview = new Questionnaire();
    };

    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    // Start the test
    next();
};


/****************
 * Questionnaire *
 ****************/

var Questionnaire = function(data) {

    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

    prompt_resubmit = function() {
	document.body.innerHTML = error_message;
	$("#resubmit").click(resubmit);
    };

    resubmit = function() {
	document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
	reprompt = setTimeout(prompt_resubmit, 10000);
	
	psiTurk.saveData({
	    success: function() {
		clearInterval(reprompt); 
		psiTurk.computeBonus('compute_bonus', function(){finish()}); 
	    }, 
	    error: prompt_resubmit
	});
    };

    // Load the questionnaire snippet 
    psiTurk.showPage('postquestionnaire.html');
    psiTurk.recordTrialData({'phase':'END', 'status':'begin'});
    
    $("#next").click(function () {
	// record_responses();
	psiTurk.recordTrialData({'phase':'END', 'status':'submit'});
	psiTurk.saveData({
            success: function(){
		psiTurk.computeBonus('compute_bonus', function() { 
                    psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
    });

    
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
window.resizeTo(1024,900)
// experiment = new InteractionsExperiment();
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new InteractionsExperiment(); } // what you want to do when you are done with instructions
    );
});
