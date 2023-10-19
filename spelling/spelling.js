import { words } from './words.js'

let specialLettersDiv = document.getElementById('special-letters-div')
Array("à", "â", "é", "è", "ê", "ë", "î", "ï", "ô", "ö", "ù", "ç", "œ").forEach(c => {
    let btn = document.createElement('button')
    btn.className = 'char-button'
    btn.onclick = handleSpecialCharacterClick
    btn.innerHTML = c

    specialLettersDiv.appendChild(btn)
})

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

let voiceSelect = document.getElementById('voice-select')
voiceSelect.replaceChildren()

let voices = synth.getVoices().filter(v => v.lang.startsWith('en-'))
let voiceMap = {}
voices.forEach(v => {
    let option = document.createElement('option')
    option.value = v.name
    option.innerHTML = v.name
    voiceMap[v.name] = v

    voiceSelect.appendChild(option)
})
utterance.voice = voices[0]

voiceSelect.onchange = function(e) {
    utterance.voice = voiceMap[e.target.value]
}

function handleSpecialCharacterClick(e) {
    let btn = e.target
    let c = btn.innerHTML
    let text = answerBox.value
    let pos = answerBox.selectionStart
    let before = text.slice(0, pos)
    let after = text.slice(pos)

    answerBox.value = before + c + after
    answerBox.selectionStart = pos + 1
    answerBox.selectionEnd = pos + 1
    answerBox.focus()
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
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
