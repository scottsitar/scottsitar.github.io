import { words } from './words.js'

let word = words[0]
let synth = window.speechSynthesis
let utterance = new SpeechSynthesisUtterance(word)
utterance.rate = 0.8
utterance.lang = "en"

let answerBox = document.getElementById('answerbox')
let showMeBox = document.getElementById('showmebox')
answerBox.className = 'typing-answer'

document.getElementById('next-word-btn').addEventListener('click', nextWord)
document.getElementById('check-word-btn').addEventListener('click', checkWord)
document.getElementById('say-again-btn').addEventListener('click', sayAgain)
document.getElementById('show-me-btn').addEventListener('click', showMe)

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function resetUI() {
    answerBox.value = ''
    showMeBox.innerHTML = ''
    answerBox.className = 'typing-answer'
}

function nextWord() {
    let i = getRandomInt(words.length)
    word = words[i]
    utterance.text = word
    resetUI()
    sayAgain()
}

function checkWord() {
    let guess = answerBox.value
    if (guess == word) {
        answerBox.className = 'correct-answer'
    } else {
        answerBox.className = 'incorrect-answer'
    }
}

function sayAgain() {
    answerBox.className = 'typing-answer'
    synth.speak(utterance)
    answerBox.focus()
}

function showMe() {
    showMeBox.innerHTML = word
}
