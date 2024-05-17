import { words as enWordsEverything } from './words/en/everything.js'

import { words as frWordsEverything } from './words/fr/everything.js'
import { words as frWordsDictee20240129 } from './words/fr/dictee-2024-01-29.js'
import { words as frWordsDictee20240205 } from './words/fr/dictee-2024-02-05.js'
import { words as frWordsDictee20240212 } from './words/fr/dictee-2024-02-12.js'
import { words as frWordsDictee20240226 } from './words/fr/dictee-2024-02-26.js'
import { words as frWordsDictee20240304 } from './words/fr/dictee-2024-03-04.js'
import { words as frWordsDictee20240408 } from './words/fr/dictee-2024-04-08.js'
import { words as frWordsDictee20240415 } from './words/fr/dictee-2024-04-15.js'
import { words as frWordsDictee20240422 } from './words/fr/dictee-2024-04-22.js'
import { words as frWordsDictee20240506 } from './words/fr/dictee-2024-05-06.js'
import { words as frWordsDictee20240513 } from './words/fr/dictee-2024-05-13.js'

// get references to all dom elements we need
let langSelect = document.getElementById('lang-select')
let listSelect = document.getElementById('list-select')
let voiceSelect = document.getElementById('voice-select')
let answerBox = document.getElementById('answerbox')
let showMeBox = document.getElementById('showmebox')

// module global variables
let wordsMap = {
    'en': {
        'Everything': enWordsEverything,
    },
    'fr': {
        'Everything': frWordsEverything,
        'Dictee 2024/05/13': frWordsDictee20240513,
        'Dictee 2024/05/06': frWordsDictee20240506,
        'Dictee 2024/04/22': frWordsDictee20240422,
        'Dictee 2024/04/15': frWordsDictee20240415,
        'Dictee 2024/04/08': frWordsDictee20240408,
        'Dictee 2024/03/04': frWordsDictee20240304,
        'Dictee 2024/02/26': frWordsDictee20240226,
        'Dictee 2024/02/12': frWordsDictee20240212,
        'Dictee 2024/02/05': frWordsDictee20240205,
        'Dictee 2024/01/29': frWordsDictee20240129,
    }
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

let currentWordIndex = 0

// initialization
initializeUI()


function initializeUI() {
    // create the buttons for entering special characters
    let specialLettersDiv = document.getElementById('special-letters-div')
    Array("à", "â", "é", "è", "ê", "ë", "î", "ï", "ô", "ö", "ù", "û", "ç", "œ").forEach(c => {
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

    // event handlers for language, word list, and voice changes
    langSelect.onchange = function(e) {
        let lang = e.target.value
        updateVoiceSelect(lang)
        updateWords(lang)
        utterance.lang = lang
    }

    // TODO: a little messy
    listSelect.onchange = function(e) {
        let lang = langSelect.value
        let wordList = wordsMap[lang][e.target.value]
        words = wordList
        currentWordIndex = 0
        utterance.text = words[currentWordIndex]
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
    listSelect.replaceChildren()
    for (let wordList in wordsMap[lang]) {
        let option = document.createElement('option')
        option.value = wordList
        option.innerHTML = wordList
        listSelect.appendChild(option)
    }

    words = wordsMap[lang]['Everything']
    currentWordIndex = 0
    utterance.text = words[currentWordIndex]
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
    currentWordIndex = (currentWordIndex + 1) % words.length
    utterance.text = words[currentWordIndex]
    resetTextBoxes()
    sayAgain()
}

function checkWord() {
    let guess = answerBox.value.toLowerCase()
    if (guess == utterance.text.toLowerCase()) {
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
