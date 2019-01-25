'use strict';

function updateScore(score) {
  $('#score').text(score);
}

function generateStartHTML() {
  return `
  <div class="container">
  <p>J.R.R. Tolkien is an internationally renowned fantasy writer, best known for authoring 'The Lord of the Rings' trilogy.  Whether you've read the books or watched the hit movies, we can all appreciate the deep and intricate world he created.  But how well do you know the “lore” of the rings?</p> 
  <p>Take the quiz and find out!</p>
  <button id="startQuizButton">Start Quiz</button>
  </div>
  `;
}

function generateAnswerHTML(answer, index) {
  return `<li><input type="radio" id="answer${index}" name="answer" value="${index}" required><label for="answer${index}">${answer.text}</label></li>`;
}

function generateQuestionHTML(question, questionNumber) {
  return `
      <h2>Question ${questionNumber + 1}</h2>    
      <form role="form" class="quiz">
        <fieldset>
          <legend>
            ${question.text}
           </legend>
              <ol type="A">
                ${question.answers.map(generateAnswerHTML).join("\n")}
              </ol>
                    <button id="submitAnswer">Submit</button>
        </fieldset> 
      </form>
  `;
}

function generateFeedBackHTML(selectedAnswer, correctAnswer) {
    const message = selectedAnswer.isCorrect ? "Well done, that is correct!" : "Sorry, thats incorrect... but don't give up!";
    const correctAnswerMessage = selectedAnswer.isCorrect ? "": `<p>The correct answer is: ${correctAnswer.text}.</p>`;
    const buttonText = isLastQuestion(1) ? "Quiz Score" : "Next Question"
    return `
      <h2>${message}</h2>
      ${correctAnswerMessage}
      <button id="nextQuestionButton">${buttonText}</button>
      `;
}

function generateFinalMessage(score) {
  let message = "";
  switch (score) {
    case 0:
      message = "Deeds will not be less valient because they are unpraised. - J.R.R. Tolkein";
      break;  
    case 1:
      message = "Little by little, one travels far. - J.R.R. Tolkein";
      break;   
    case 2:
      message = "It's the job that's never started as takes longest to finish. - J.R.R. Tolkein";
      break;   
    case 3:
      message = "Courage is found in unlikely places. - J.R.R. Tolkein"
      break;
      default:   
      message = "For victory is victory, however small, nor is its worth only from what follows from it. - J.R.R. Tolkein"
      break;
  }
  return message;
}

function generateFinalHTML(score, maxScore) {
      return `
      <h2>Congratulations! You've reached the end of your journey!</h2>
      <p>You scored ${score} out of ${maxScore} questions correctly!</p>
      <p>${generateFinalMessage(score)}<p>
      <button id="restartQuizButton">Restart Quiz</button>
      `;
}
 
function renderStartPage() {
  $('section').html(generateStartHTML());
}

function renderFinalPage(score, maxScore) {
  $('section').html(generateFinalHTML(score, maxScore));
}

function renderFeedBackPage(selectedAnswer, correctAnswer) {
  $('section').html(generateFeedBackHTML(selectedAnswer, correctAnswer));
}

function getCurrentQuestion() {
  return QUIZ.questions[QUIZ.answers.length];  
}

function renderCurrentQuestion() {
  renderQuestionPage(getCurrentQuestion(), QUIZ.answers.length);
}

function renderQuestionPage (question, questionNumber) {
  $('section').html(generateQuestionHTML(question, questionNumber));
}

function handleStartQuiz() {
  $('section').on('click','#startQuizButton', function(event) {
    renderCurrentQuestion();
  });
}

function findCorrectAnswer(question) {
  return question.answers.find(function(answer) {
    return answer.isCorrect;
  })
}

function handleQuestionFormSubmit() {
  $('section').on('submit', 'form', function(event) {   
    event.preventDefault();
    const selectedAnswerIndex = parseInt($("input[name='answer']:checked").val());
    const selectedAnswer = getCurrentQuestion().answers[selectedAnswerIndex]
    renderFeedBackPage(selectedAnswer, findCorrectAnswer(getCurrentQuestion()));
    QUIZ.answers.push(selectedAnswer);
    showCurrentScore();  
  });
}

function calculateScore() {
  return QUIZ.answers.filter(function(answer) {
    return answer.isCorrect;
  }).length;
}

function isLastQuestion(offset=0) {
  return !(QUIZ.answers.length + offset < QUIZ.questions.length);
}

function handleNextQuestion() {
  $('section').on('click', '#nextQuestionButton', function(event) {
    if (!isLastQuestion()) {
        renderCurrentQuestion();
    } else {
        renderFinalPage(calculateScore(), QUIZ.questions.length);
    }
  });
}

function showCurrentScore() {
  updateScore(calculateScore());   
}

function restartQuiz() {
  QUIZ.answers = [];
  showCurrentScore();
  renderStartPage();
}

function handleRestartQuiz() {
  $('section').on('click', '#restartQuizButton', function(event) {
    restartQuiz();
  });
}
 
function setUpEventHandlers() {
  handleStartQuiz();
  handleQuestionFormSubmit();
  handleNextQuestion();
  handleRestartQuiz();
}

function initializeQuiz() {
  setUpEventHandlers();
  renderStartPage();
}
  
$(initializeQuiz);

