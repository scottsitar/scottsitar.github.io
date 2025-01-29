import { words as enWordsEverything } from './words/en/everything.js'

import { words as frVerbsEtreImparfait } from './words/fr/verbs-etre-imparfait.js'
import { words as frVerbsAvoirImparfait } from './words/fr/verbs-avoir-imparfait.js'
import { words as frVerbsParlerImparfait } from './words/fr/verbs-parler-imparfait.js'
import { words as frVerbsMangerImparfait } from './words/fr/verbs-manger-imparfait.js'
import { words as frVerbsDormirImparfait } from './words/fr/verbs-dormir-imparfait.js'
import { words as frVerbsChoisirImparfait } from './words/fr/verbs-choisir-imparfait.js'
import { words as frVerbsVouloirImparfait } from './words/fr/verbs-vouloir-imparfait.js'
import { words as frVerbsPrendreImparfait } from './words/fr/verbs-prendre-imparfait.js'


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
        'être (imparfait)': frVerbsEtreImparfait,
        'avoir (imparfait)': frVerbsAvoirImparfait,
        'parler (imparfait)': frVerbsParlerImparfait,
        'manger (imparfait)': frVerbsMangerImparfait,
        'dormir (imparfait)': frVerbsDormirImparfait,
        'choisir (imparfait)': frVerbsChoisirImparfait,
        'vouloir (imparfait)': frVerbsVouloirImparfait,
        'prendre (imparfait)': frVerbsPrendreImparfait,
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
