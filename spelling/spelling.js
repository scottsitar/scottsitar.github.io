import { words as enWords } from './en-words.js'
import { words as frWords } from './fr-words.js'

// get references to all dom elements we need
let langSelect = document.getElementById('lang-select')
let voiceSelect = document.getElementById('voice-select')
let answerBox = document.getElementById('answerbox')
let showMeBox = document.getElementById('showmebox')

// module global variables
let wordsMap = {
    'en': enWords,
    'fr': frWords
}
let words = []

let synth = window.speechSynthesis
let allVoices = synth.getVoices()
let voiceMap = {
    'en': allVoices.filter(v => v.lang.startsWith('en-')),
    'fr': allVoices.filter(v => v.lang.startsWith('fr-'))
}
let nameToVoiceMap = {}

let utterance = new SpeechSynthesisUtterance('')
utterance.rate = 0.8
utterance.lang = 'en'

// initialization
initializeUI()


function initializeUI() {
    // create the buttons for entering special characters
    let specialLettersDiv = document.getElementById('special-letters-div')
    Array("à", "â", "é", "è", "ê", "ë", "î", "ï", "ô", "ö", "ù", "ç", "œ").forEach(c => {
        let btn = document.createElement('button')
        btn.className = 'char-button'
        btn.onclick = handleSpecialCharacterClick
        btn.innerHTML = c

        specialLettersDiv.appendChild(btn)
    })

    // populate the language dropdown
    langSelect.replaceChildren()
    Array('en', 'fr').forEach(lang => {
        let option = document.createElement('option')
        option.value = lang
        option.innerHTML = lang
        langSelect.appendChild(option)
    })

    // populate the voices dropdown
    updateVoiceSelect('en')

    // choose words based on language
    updateWords('en')

    // event handlers for language and voice changes
    langSelect.onchange = function(e) {
        let lang = e.target.value
        updateVoiceSelect(lang)
        updateWords(lang)
        utterance.lang = lang
    }

    voiceSelect.onchange = function(e) {
        utterance.voice = nameToVoiceMap[e.target.value]
    }

    // click handlers for the action buttons
    document.getElementById('next-word-btn').addEventListener('click', nextWord)
    document.getElementById('check-word-btn').addEventListener('click', checkWord)
    document.getElementById('say-again-btn').addEventListener('click', sayAgain)
    document.getElementById('show-me-btn').addEventListener('click', showMe)

    // pick a word
    nextWord()
}

function updateVoiceSelect(lang) {
    voiceSelect.replaceChildren()
    nameToVoiceMap = {}

    let voices = voiceMap[lang]
    voices.forEach(v => {
        let option = document.createElement('option')
        option.value = v.name
        option.innerHTML = v.name
        nameToVoiceMap[v.name] = v

        voiceSelect.appendChild(option)
    })

    utterance.voice = voices[0]
}

function updateWords(lang) {
    words = wordsMap[lang]
    utterance.text = words[0]
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

function resetTextBoxes() {
    answerBox.value = ''
    showMeBox.innerHTML = ''
    answerBox.className = 'typing-answer'
}

function nextWord() {
    let i = Math.floor(Math.random() * words.length)
    utterance.text = words[i]
    resetTextBoxes()
    sayAgain()
}

function checkWord() {
    let guess = answerBox.value
    if (guess == utterance.text) {
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
    showMeBox.innerHTML = utterance.text
}
