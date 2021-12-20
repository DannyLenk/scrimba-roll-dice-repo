"use strict"

window.onload = function() {
   document.querySelector('#rollBtn').addEventListener('click', controller.rollDice);
}

let view = {

   displayResult: function(player) {
      const diceList = document.getElementsByClassName('dice');
      diceList[player].innerHTML = model.players[player].dice;
      this.displayShade(diceList, player)
   },

   displayShade: function(list, player) {
      let nextPlayer = player + 1;
      for (let i = 0; i < model.players.length; i++) {
         list[i].removeAttribute('role');
      }
      if (nextPlayer < model.players.length) {
         list[nextPlayer].setAttribute('role', 'active');
      } else {
         list[0].setAttribute('role', 'active');
      }
   },

   displayScore: function(player) {
      const scoreboardList = document.getElementsByClassName('scoreboard');
      scoreboardList[player].innerHTML = model.players[player].score;
      this.displayMessage(playerTurn(), model.roundNum);
   },

   displayMessage: function(playerNum, roundNum) {
      document.querySelector('#message').innerHTML = `Player ${playerNum} Turn`;
      if (roundNum) {
         document.querySelector('#roundEl').innerHTML = `Round # ${roundNum}`;
      }
   },

   displayVictoryMessage: function(winner) {
      document.querySelector('#message').innerHTML = `Congrats! Player ${winner + 1} won!`;
   }
};

//
//    end of view object
//

let model = {
   players: [
      {score: 0, dice: 0},
      {score: 0, dice: 0}
   ],
   clicks: 0,
   turns: 0,
   roundNum: 1,

   manageClicks: function() {
      let hitScore = this.checkScore();
      let playerScores = collectScores();
      this.clicks++;
      this.turns++;
      if (this.clicks === (this.players.length - 1) && hitScore) {
         defineWinnerName(playerScores, checkWinner(playerScores));
      }
      if (this.turns === (this.players.length - 1)) {
         this.roundNum++;
         this.turns = -1;
         this.clicks = 0;
      }
   },

   getRandomNum: function() {
      return Math.floor(Math.random() * 6 + 1);
   },

   sumPlayerScore: function(player) {
      let dice = this.getRandomNum();
      this.players[player].dice = dice;
      this.players[player].score += dice;
   },

   countPlayerTurn: function() {
      let playerNum = 1;
      function counter() {
         if (playerNum < model.players.length) {
            playerNum++;
         } else {
            playerNum = 1;
         }
         return playerNum;
      }
      return counter;
   },

   checkScore: function() {
      for (let i = 0; i < this.players.length; i++) {
         let player = this.players[i];
         if (player.score >= 20) {
            return true;
         }
      }
      return false;
   },
};
let playerTurn = model.countPlayerTurn();

// 
//    end of model object
// 

let controller = {
   player: 0,

   rollDice: function() {
      model.sumPlayerScore(controller.player);
      view.displayResult(controller.player);
      view.displayScore(controller.player);
      controller.changePlayer();
      model.manageClicks();
   },

   changePlayer: function() {
      if (this.player < (model.players.length - 1)) {
         this.player++;
      } else {
         this.player = 0;
      }
   }
};

function collectScores() {
   let playerScores = [];
   for (let i = 0; i < model.players.length; i++) {
      playerScores.push(model.players[i].score);
   }
   return playerScores;
}
function checkWinner(scores) {
   let bestScore = 0;
   for (let i = 0; i < scores.length; i++) {
      if (scores[i] > bestScore) {
         bestScore = scores[i];
      }
   }
   return bestScore;
}
function defineWinnerName(scores, best) {
   let winnerNumber = 0
   for (let i = 0; i < scores.length; i++) {
      if (best === scores[i]) {
         winnerNumber = i;
      }
   }
   view.displayVictoryMessage(winnerNumber);
}