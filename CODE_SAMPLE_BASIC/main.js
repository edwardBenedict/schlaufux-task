// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted.
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt
const API_KEY = "AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

let options = ["this", "this not", "this either"];
let states = [false, false, false];
let correct_answer_index = 0;
let questions;

function handleClientLoad() {
  gapi.load("client", initClient);
}

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    })
    .then(
      function () {
        getExerciseData();
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

function getExerciseData() {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
      range: "Learning!A1:F10",
    })
    .then(
      function (response) {
        console.log(response);
        questions = response.result.values;
        console.log("Questions", questions);
        questions && newQuestion();
      },
      function (response) {
        console.log("Error: " + response.result.error.message);
      }
    );
}

document.addEventListener("DOMContentLoaded", init);

function init() {
  let optionsContainer = document.querySelector("#options-wrapper");
  for (let i = 0; i < options.length; i++) {
    optionsContainer.innerHTML +=
      "<div class='unchosen option'><p class='text'>" +
      options[i] +
      "</p></div>";
  }
}

function newQuestion() {
  let optionsContainer = document.querySelector("#options-wrapper");
  if (questions) options = questions[1][3].split(";");

  optionsContainer.innerHTML = "";
  for (let i = 0; i < options.length; i++) {
    optionsContainer.innerHTML +=
      `<div class='unchosen option' id='${`option${i}`}' onclick='chooseOption(
        ${i},${"questions[1]"},${`options[${i}]`}
        )'=><p class='text'>` +
      options[i] +
      "</p></div>";
  }
  let questionWrapper = document.querySelector(".question");
  questionWrapper.innerHTML = questions[1][2];
}

function toggleChoice(i) {
  states[i] = true;

  // ...
}

function myEvaluation() {
  let evMessage = document.querySelector("#evaluation-message");
  for (let i = 0; i < options.length; i++) {
    if (states[i] && i == correct_answer_index) {
      evMessage.innerHTML = "<p>Awesome!</p>";
      // console.log('awesome')
      break;
    } else {
      evMessage.innerHTML = "<p>Keep trying!</p>";
      // console.log('tryAgain')
      break;
    }
  }
}

function chooseOption(i, j, k) {
  console.log("i", i, j, k);
  for (let x = 0; x < options.length; x++) {
    let option = document.querySelector(`#option${x}`);
    if (x == i) {
      option.classList.add("chosen");
      option.classList.remove("unchosen");
    } else {
      option.classList.add("unchosen");
      option.classList.remove("chosen");
    }
  }
  // let selectedOption = document.querySelector(`#option${i}`);
  // selectedOption.classList.add("chosen");
  // console.log("selectedOption", selectedOption.innerHTML);
  if (i == j[4]) console.log("point: ", j[5]);
}
