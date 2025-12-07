function init() {
  let myButton = document.getElementById("btnAnswer");

  myButton.onclick = getAnswer;
}

onload = init;

function getAnswer() {
  let correctAnswer = "HTML";
  let correctAnswerLower = correctAnswer.toLowerCase();

  let htmlLang = document.getElementById("html").value;
  let htmlLangLower = htmlLang.toLowerCase();

  let cssLang = document.getElementById("css").value;
  let cssLangLower = cssLang.toLowerCase();

  let javaLang = document.getElementById("javascript").value;
  let javaLangLower = javaLang.toLowerCase();

  let pyLang = document.getElementById("python").value;
  let pyLangLower = pyLang.toLowerCase();

  let message = document.getElementById("message");

  if (correctAnswerLower == htmlLangLower) {
    let message = document.getElementById("hmessage");
    message.innerHTML = "You are correct";
  } else if (correctAnswerLower == cssLangLower) {
    let message = document.getElementById("cmessage");
    message.innerHTML = "You are correct";
  } else if (correctAnswerLower == javaLangLower) {
    let message = document.getElementById("jmessage");
    message.innerHTML = "You are correct";
  } else if (correctAnswerLower == pyLangLower) {
    let message = document.getElementById("pymessage");
    message.innerHTML = "You are correct";
  } else {
    message.innerHTML = "You are wrong, the correct answer is: ";
    message.innerHTML += correctAnswer;
  }
}
