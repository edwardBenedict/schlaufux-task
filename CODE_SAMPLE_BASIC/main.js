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
let correctAnswerIndex;
let selectedAnswerIndex;

let question;
let getSecureQuestionIndex = 2;
let point;
let totalPoints = 0;

let resultDiv;
let nextBtn;
let questionDiv;
let optionsContainer;
let checktBtn;

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
        getExerciseData(`D${getSecureQuestionIndex}`);
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

async function getExerciseData(end) {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
    range: `Learning!A${getSecureQuestionIndex}:${end}`,
  });
  console.log(response.result.values);
  question = response.result.values[0][2];
  options = response.result.values[0][3].split(";");
  try {
    correctAnswerIndex = response.result.values[0][4];
    point = response.result.values[0][5];
  } catch (error) {}
  console.log("question", question, options);
  question && options ? init() : console.log("no data");
  return point;
}

document.addEventListener("DOMContentLoaded", init);

function init() {
  questionDiv = document.querySelector("#question");
  nextBtn = document.querySelector("#next-btn");
  optionsContainer = document.querySelector("#options-wrapper");
  resultDiv = document.querySelector("#result");
  checktBtn = document.querySelector("#check-btn");

  questionDiv.innerHTML = question;
  optionsContainer.innerHTML = "";
  for (let i = 0; i < options.length; i++) {
    optionsContainer.innerHTML +=
      `<div class='unchosen option' id='${`option${i}`}' onclick='chooseOption(
        ${i},${`options[${i}]`}
        )'=><p class='text'>` +
      options[i] +
      "</p></div>";
  }
  //   for (let i = 0; i < options.length; i++) {
  //     optionsContainer.innerHTML +=
  //       "<div class='unchosen option'><p class='text'>" +
  //       options[i] +
  //       "</p></div>";
  //   }
  // ...
}

function toggleChoice(i) {
  states[i] = true;
  // ...
}

function myEvaluation() {
  console.log("checkAnswer", point, correctAnswerIndex);
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

async function checkAnswer() {
  await getExerciseData(`F${getSecureQuestionIndex}`);
  if (selectedAnswerIndex == undefined) {
    resultDiv.innerHTML = `<p class="warning">Please select an option!</p>`;
  } else if (selectedAnswerIndex == correctAnswerIndex) {
    totalPoints += Number(point);
    resultDiv.innerHTML = `<p>You got ${totalPoints} points!</p>`;
    nextBtn.style.display = "block";
    checktBtn.style.display = "none";
  } else if (selectedAnswerIndex != correctAnswerIndex) {
    resultDiv.innerHTML = `<p class="error">Wrong answer! Try again!</p>`;
    nextBtn.style.display = "block";
    checktBtn.style.display = "none";
  }
  selectedAnswerIndex = undefined;
  correctAnswerIndex = undefined;
}

function chooseOption(i) {
  console.log("i", i);
  selectedAnswerIndex = i;
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
}

function nextQuestion() {
  console.log(getSecureQuestionIndex);
  getSecureQuestionIndex += 1;
  getExerciseData(`D${getSecureQuestionIndex}`);
  resultDiv.innerHTML = "";
}
