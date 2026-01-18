import { verbData } from './verb-data.js'

const tenseSelect = document.getElementById('tense-select')
const letterIndex = document.getElementById('letter-index')
const letterWords = document.getElementById('letter-words')

const checkButton = document.getElementById('button-check')
const showMeButton = document.getElementById('button-show-me')
const nextButton = document.getElementById('button-next')

const testNameDiv = document.getElementById('test-name')
const showMeDiv = document.getElementById('show-me')
const pronounSpan = document.getElementById('pronoun')
const answerInput = document.getElementById('input-answer')
const specialLettersDiv = document.getElementById('special-letters')

tenseSelect.addEventListener('change', resetTest)
checkButton.addEventListener('click', handleCheck)
showMeButton.addEventListener('click', handleShowMe)
nextButton.addEventListener('click', handleNext)

let currentIndexLetter
let currentWord
let currentTest
let currentTestIndex
let currentAnswer

Array("à", "â", "é", "è", "ê", "ë", "î", "ï", "ô", "ö", "ù", "û", "ç", "œ").forEach(c => {
    let btn = document.createElement('button')
    btn.className = 'char-button'
    btn.onclick = handleSpecialCharacterClick
    btn.innerHTML = c

    specialLettersDiv.appendChild(btn)
})


letterIndex.replaceChildren()
verbData.forEach(d => {
    let indexDiv = document.createElement('div')
    indexDiv.innerHTML = d.key
    if (d.words.length > 0) {
        indexDiv.classList.add('index-tab')
        indexDiv.addEventListener('click', () => updateIndexLetter(d))
    } else {
        indexDiv.classList.add('index-tab-empty')
    }
    letterIndex.appendChild(indexDiv)
})

updateIndexLetter(verbData[0])

function updateIndexLetter(keyObject) {
    currentIndexLetter = keyObject.key
    letterWords.replaceChildren()
    if (keyObject.words.length > 0) {
        keyObject.words.forEach(w => {
            let wordDiv = document.createElement('div')
            wordDiv.innerHTML = w.name
            wordDiv.classList.add('word-list-item')
            wordDiv.addEventListener('click', () => updateCurrentWord(w))
            letterWords.appendChild(wordDiv)
        })

        updateCurrentWord(keyObject.words[0])
    }
}

function resetTest() {
    showMeDiv.innerHTML = ''
    answerInput.className = 'answer-typing'
    answerInput.value = ''

    let tenseName
    switch (tenseSelect.value) {
        case 'present': tenseName = 'présent'; break
        case 'past': tenseName = 'passé composé'; break
        case 'imperfect': tenseName = 'imparfait'; break
    }
    testNameDiv.innerHTML = currentWord.name + ': ' + tenseName

    currentTest = currentWord[tenseSelect.value]
    currentTestIndex = 0
    computeAnswer()

    answerInput.focus()
}

function updateCurrentWord(wordObject) {
    currentWord = wordObject
    resetTest()
}

function computeAnswer() {
    let s = currentTest[currentTestIndex]
    for (let i = 0; i < s.length; i++) {
        if (s[i] == ' ') {
            pronounSpan.innerHTML = s.substring(0, i)
            currentAnswer = s.substring(i + 1)
            break
        } else if (s[i] == "'") {
            pronounSpan.innerHTML = s.substring(0, i + 1)
            currentAnswer = s.substring(i + 1)
            break
        }
    }
}

function handleCheck() {
    if (answerInput.value === currentAnswer) {
        answerInput.className = 'answer-correct'
    } else {
        answerInput.className = 'answer-incorrect'
    }
}

function handleShowMe() {
    showMeDiv.innerHTML = currentAnswer
}

function handleNext() {
    showMeDiv.innerHTML = ''
    answerInput.className = 'answer-typing'
    answerInput.value = ''
    currentTestIndex = (currentTestIndex + 1) % currentTest.length
    computeAnswer()
    answerInput.focus()
}

function handleSpecialCharacterClick(e) {
    let btn = e.target
    let c = btn.innerHTML
    let text = answerInput.value
    let pos = answerInput.selectionStart
    let before = text.slice(0, pos)
    let after = text.slice(pos)

    answerInput.value = before + c + after
    answerInput.selectionStart = pos + 1
    answerInput.selectionEnd = pos + 1
    answerInput.focus()
}
