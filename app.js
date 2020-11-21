/**
 * Author: Ghislain Bugingo
 *
 * This app.js file is a program that plays Rock Paper Scissors with the client
 * side inputs data, and returns result to the body.
 */

'use strict';
const { WSA_E_NO_MORE } = require('constants');
const express = require('express');
const app = express();

let gameElement = ['rock', 'paper', 'scissors'];
let leaderBoard = [];

/**
 * Gets a user play and play name and sends a string
 * that says wether or not the player won/lost/tied
 * against the computer. The text format is:
 * <Player Name> wins/loses/ties the round.
 */
app.get('/shoot/:play/:player_name', function(req, res) {
  try {
    let play = req.params.play;
    let playerName = req.params.player_name;
    if (gameElement.includes(play) && playerName) {
      let result = gameRules(play, playerName, gameElement[genRandom()]);
      res.status(200).type('text').send(result);
    } else {
      res.status(400).type('text')
        .send('Accepted play are: rock, paper, or scissors');
    }
  } catch (err) {
    res.status(500).type("text")
    .send("server error");
  }
});

/**
 * Sends the leaderboard data to the body in form of an array of JSON objects.
 * Each object contains a name (name of the player) property and a roundsWon
 * (number of victory) property. The leaderboard data is returned in descending
 * order of number of victory won.
 */
app.get('/leaderboard', function(req, res) {
  try {
    leaderBoard.sort(function(a, b) {return b.roundsWon - a.roundsWon});
    res.json({leaderBoard});
  } catch (err) {
    res.status(500).type("text")
    .send("server error");
  }
});

/**
 * Returns a randomly generated number between 0 and 2
 * @returns {integer} integer between 0 and 2.
 */
function genRandom() {
  return Math.floor(Math.random() * 3);
}

/**
 * Returns whether or not the player has won/lost/tied the round.
 * @param {string} player - what the player plays
 * @param {string} playerName - player name
 * @param {string} computer - computer
 */
function gameRules(player, playerName, computer) {
  if (player === computer) {
    return playerName + ' ties the round';
  }
  let won = playerName + ' wins the round';
  if (player === gameElement[0] && computer === gameElement[2]) {
      updatesBoard(playerName);
      return won;
  } else if (player === gameElement[2] && computer === gameElement[1]) {
      updatesBoard(playerName);
      return won;
  } else if (player === gameElement[1] && computer === gameElement[0]) {
      updatesBoard(playerName);
      return won;
  }
  return playerName + ' loses the round';
}

/**
 * Updates board with a new player information
 * or updates the number of victory for an existing player.
 * @param {string} playerName - player name
 */
function updatesBoard(playerName) {
  if (leaderBoard.length <= 0) {
    leaderBoard.push({"name": playerName, "roundsWon": 1});
  } else {
    if (!playerExist(playerName)){
      leaderBoard.push({"name": playerName, "roundsWon": 1});
    } else {
      for (let i = 0; i < leaderBoard.length; i++) {
        if (leaderBoard[i]["name"] === playerName) {
          leaderBoard[i]["roundsWon"]++;
          return;
        }
      }
    }
  }
}

/**
 * Returns true if the player already exists in the
 * leaderboard. Returns false otherwise.
 * @param {string} playerName - player name
 */
function playerExist(playerName) {
  for (let i = 0; i < leaderBoard.length; i++) {
    if (leaderBoard[i]['name'] === playerName) {
      return true;
    }
  }
  return false;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);

module.exports = app; // for testing