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
let selectedQuestionIndex = 1;
let checkSelectedQuestion = { isSelected: false, check: false };
let questions;
let nextBtn;
let getScore;

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
  nextBtn = document.querySelector("#next-btn");
  getScore = document.querySelector("#get-score");
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
  if (questions) options = questions[selectedQuestionIndex][3].split(";");

  optionsContainer.innerHTML = "";
  for (let i = 0; i < options.length; i++) {
    optionsContainer.innerHTML +=
      `<div class='unchosen option' id='${`option${i}`}' onclick='chooseOption(
        ${i},${`questions[${selectedQuestionIndex}]`},${`options[${i}]`}
        )'=><p class='text'>` +
      options[i] +
      "</p></div>";
  }
  let questionWrapper = document.querySelector(".question");
  questionWrapper.innerHTML = questions[selectedQuestionIndex][2];
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
  checkSelectedQuestion.isSelected = true;
  checkSelectedQuestion.check = i == j[4];
}

function myEval() {
  let checkMessage = document.querySelector("#check-message");
  nextBtn.style.display = "none";
  if (checkSelectedQuestion.isSelected) {
    if (checkSelectedQuestion.check) {
      checkMessage.innerHTML =
        "<p class='succes-par'>Congrats! Correct...👏</p>";
      nextBtn.style.display = "block";
    } else {
      checkMessage.innerHTML =
        "<p class='error-par'>Wrong Answer. Try Again!</p>";
      nextBtn.style.display = "block";
      console.log("keep trying!");
    }
  } else {
    checkMessage.innerHTML = "<p class='warning-par'>Choose an option!</p>";
  }
}

function next() {
  if (selectedQuestionIndex < questions.length - 1) {
    selectedQuestionIndex++;
    console.log("123");
    nextBtn.style.display = "none";
    newQuestion();
  } else if (selectedQuestionIndex == questions.length - 1) {
    console.log("end of questions");
    nextBtn.style.display = "none";
    getScore.style.display = "block";
  }
}
