// Initialize Firebase
var config = {
    apiKey: "AIzaSyD9aUZw5C2_CDQbhRnqgMO4qC13CDDxsRY",
    authDomain: "rockpaperscissors-153fb.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-153fb.firebaseio.com",
    projectId: "rockpaperscissors-153fb",
    storageBucket: "",
    messagingSenderId: "363148191598"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var playerCount = 0;

var playerName = "";
var playerNumber = 0;

var player1Connected = false;
var player1Name = "";
var player1Choice = "";
var player1Wins = 0;
var player1Losses = 0;

var player2Connected = false;
var player2Name = "";
var player2Choice = "";
var player2Wins = 0;
var player2Losses = 0;

var gameRunning = false;
var gameDone = false;

var chat = [];
var alerted = false;

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected")

var buttonMaker = function(choice) {
    var choiceBtn = $("<button>").addClass("btn btn-primary choiceBtn").text(choice).attr("data-type", choice);
    if (playerNumber === 1){
        $(".choices1").append(choiceBtn);
    }
    if (playerNumber === 2) {
        $(".choices2").append(choiceBtn);
    }
}

var runGame = function() {
    gameDone = false;
    $(".choices1").empty();
    $(".choices2").empty();
    buttonMaker("Rock");
    buttonMaker("Paper");
    buttonMaker("Scissors");
    $(".choiceBtn").on("click", function() {
        var that = $(this).attr("data-type");
        if (playerNumber === 1) {
            player1Choice = that;
            database.ref("/players/player1/Choice").set(player1Choice);
            $(".choices1").empty();
        }
        if (playerNumber === 2) {
            player2Choice = that;
            database.ref("/players/player2/Choice").set(player2Choice);
            $(".choices2").empty();
        }
    })
}

connectedRef.on("value", function(snapshot) {
    if (snapshot.val()) {
        var con = connectionsRef.push(true);
        con.onDisconnect().remove();
        if (playerNumber === 1) {
            database.ref("/players/player1").onDisconnect().remove();
        }
    }
}) 

database.ref().on("value", function(snapshot){

    player1Connected = snapshot.val().playersConnected.player1.connected;
    player2Connected = snapshot.val().playersConnected.player2.connected;

    if (snapshot.val().players.player1) {
    player1Name = snapshot.val().players.player1.playerName;
    player1Choice= snapshot.val().players.player1.Choice;
    player1Wins = snapshot.val().players.player1.Wins;
    player1Losses = snapshot.val().players.player1.Losses;
    }
    if (snapshot.val().players.player2) {
    player2Name = snapshot.val().players.player2.playerName;
    player2Choice= snapshot.val().players.player2.Choice;
    player2Wins = snapshot.val().players.player2.Wins;
    player2Losses = snapshot.val().players.player2.Losses;
    }
    if (playerNumber === 1) {
        database.ref("/players/player1").onDisconnect().remove();
        database.ref("/chat/").onDisconnect().remove();
        database.ref("/playersConnected/player1").onDisconnect().set({
            connected: false,
        })
    }
    if (playerNumber === 2) {
        database.ref("/players/player2").onDisconnect().remove();
        database.ref("/chat/").onDisconnect().remove();
        database.ref("/playersConnected/player2").onDisconnect().set({
            connected: false,
        })
    }
    if (playerNumber === 3) {
        if (player1Connected === false || player2Connected === false) {
            $("#login").slideToggle();
        }
    }
 
    if (player1Connected === false) {
        if (gameRunning === true && alerted === false) {
            alerted = true;
            database.ref("/chat/").push({
                name: "ALERT",
                message: "Player 1 Has Disconnected"
            })
            $(".choices2").empty();
            gameRunning = false;
        }
        else {
            $(".player1Name").text("Waiting for Player1..");
        }
                $(".choices2").empty();
    }
    else {
        $(".player1Name").text(player1Name);

    }
    if (player2Connected === false) {
        if (gameRunning === true & alerted === false) {
            alerted = true;
            database.ref("/chat/").push({
                name: "ALERT",
                message: "Player 2 Has Disconnected"
            })
            $(".choices1").empty();
            gameRunning = false;

        }
        else {
            $(".player2Name").text("Waiting for Player2..")
        }        
    }
    else {
        $(".player2Name").text(player2Name);

    }
    
    $(".player1Wins").text(player1Wins);
    $(".player2Wins").text(player2Wins);


    if (player1Connected && player2Connected) {
        if (gameRunning === false) {
            gameRunning = true;
            alerted = false;
            runGame();
        }
    }
    if (player1Choice && player2Choice && gameDone === false) {
        if (player1Choice === "Rock" && player2Choice === "Paper") {
            gameDone = true;
            $(".middleSpace").text(player2Name + " Wins!");
            $(".middleSpace").slideToggle();
            player2Wins++;
            database.ref("/players/player2/Wins").set(player2Wins);
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000) 
        }   
        if (player1Choice === "Rock" && player2Choice === "Scissors") {
            gameDone = true;
            $(".middleSpace").text(player1Name + " Wins!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            player1Wins++;
            database.ref("/players/player1/Wins").set(player1Wins);
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();

            },2000)
        }  
        if (player1Choice === "Rock" && player2Choice === "Rock") {
            gameDone = true;
            $(".middleSpace").text("Tie!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000)
        }
        if (player1Choice === "Paper" && player2Choice === "Scissors") {
            gameDone = true;
            $(".middleSpace").text(player2Name + " Wins!");
            $(".middleSpace").slideToggle();
            player2Wins++;
            database.ref("/players/player2/Wins").set(player2Wins);
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000) 
        }   
        if (player1Choice === "Paper" && player2Choice === "Rock") {
            gameDone = true;
            $(".middleSpace").text(player1Name + " Wins!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            player1Wins++;
            database.ref("/players/player1/Wins").set(player1Wins);
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000)
        }  
        if (player1Choice === "Paper" && player2Choice === "Paper") {
            gameDone = true;
            $(".middleSpace").text("Tie!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000)
        }
        if (player1Choice === "Scissors" && player2Choice === "Rock") {
            gameDone = true;
            $(".middleSpace").text(player2Name + " Wins!");
            $(".middleSpace").slideToggle();
            player2Wins++;
            database.ref("/players/player2/Wins").set(player2Wins);
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000) 
        }   
        if (player1Choice === "Scissors" && player2Choice === "Paper") {
            gameDone = true;
            $(".middleSpace").text(player1Name + " Wins!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            player1Wins++;
            database.ref("/players/player1/Wins").set(player1Wins);
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000)
        }  
        if (player1Choice === "Scissors" && player2Choice === "Scissors") {
            gameDone = true;
            $(".middleSpace").text("Tie!");
            $(".middleSpace").slideToggle();
            database.ref("/players/player1/Choice").set("");
            database.ref("/players/player2/Choice").set("");
            setTimeout(function() {
                runGame();
                $(".middleSpace").slideToggle();
                $(".middleSpace").empty();
            },2000)
        }
    }

    chat = snapshot.val().chat;
    $("#chatbox").empty();
    for (let key in chat) {
        var newMessage = $("<div>").text(chat[key].name + ": " + chat[key].message);
        $("#chatbox").append(newMessage);
      }
    $("#chatbox").scrollTop($("#chatbox").height());

   

})

$("#nameSubmit").on("click", function() {
    event.preventDefault();
    if (player1Connected === false) {
        player1Name = $("#nameInput").val().trim();
        $("#login").slideToggle();
        $(".middleSpace").text("Hello " + player1Name + "! You are player 1.");
        $(".middleSpace").slideToggle();
        playerNumber = 1;
        database.ref("/playersConnected/player1").set({
            connected: true,
        })
        database.ref("/players/player1").set({
            playerName: player1Name,
            Choice: "",
            Wins: 0,
            Losses: 0
        })
        setTimeout(function() {
            $(".middleSpace").slideToggle();
        },2000)
        
    }
    else if (player2Connected === false) {
        player2Name = $("#nameInput").val().trim();
        $("#login").slideToggle();
        $(".middleSpace").text("Hello " + player2Name + "! You are player 2.");
        $(".middleSpace").slideToggle();

        playerNumber = 2;
        database.ref("/playersConnected/player2").set({
            connected: true,
        })
        database.ref("/players/player2").set({
            playerName: player2Name,
            Choice: "",
            Wins: 0,
            Losses: 0
        })
        setTimeout(function() {
            $(".middleSpace").slideToggle();
        },2000)

    }
    else {
        $("#login").slideToggle();
        $("#topDiv").text("There are currently two players playing.");
        playerNumber = 3;
    }
    
}) 

$("#chatSubmit").on("click", function() {
    event.preventDefault();
    var message = $("#chatInput").val().trim();
    $("#chatInput").val("");
    if (playerNumber === 1) {
        database.ref("/chat/").push({
            name: player1Name,
            message: message,
        })
    }
    else if (playerNumber === 2) {
        database.ref("/chat/").push({
            name: player2Name,
            message: message,
        })
    }
    else {
        var alertMessage = $("<div>").text("You must be signed in to chat!")
        $("#chatbox").append(alertMessage);
    }
})


