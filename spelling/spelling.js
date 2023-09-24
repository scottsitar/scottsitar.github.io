var words = [
    'today',
    'tomorrow',
    'yesterday',
    'complicated',
    'stairs',
    'computer',
    'mountain',
]

var word = words[0]
var synth = window.speechSynthesis
var utterance = new SpeechSynthesisUtterance(word)
utterance.rate = 0.8
utterance.lang = "en"

var answerBox
var showMeBox

function initialize() {
    answerBox = document.getElementById('answerbox')
    showMeBox = document.getElementById('showmebox')
    answerBox.className = 'typing-answer'
}

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
