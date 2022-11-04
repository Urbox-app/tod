import getData from './utils/getData'
import './css/style.css'

let GENERALDATA = getData()
const TRUTH = new Array
const DARE = new Array
const containerBtn = document.querySelector('.container-btn')
const display = document.querySelector('#display-text')
const inputLang = document.querySelector('#lang')
const containerSetting = document.querySelector('#setting')
const customLevel = []

let textInit = inputLang.value === 'en' ? 'They are ready?' : '¿Están listos?'

window.onload = () => {
  display.innerText = textInit
  animateText()
};


const getTruthAndDare = () => {
  GENERALDATA.forEach(item => {
    if (item.type === 'Dare') {
      DARE.push(item)
    }

    if (item.type === 'Truth') {
      TRUTH.push(item)
    }
  })
}

const onChangeLang = () => {
  textInit = inputLang.value === 'en' ? 'They are ready?' : '¿Están listos?'
  display.innerText = textInit;
  animateText()
}

const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);

}

const animateText = () => {
  display.animate([
    { transform: 'rotate(0) scale(0)' },
    { transform: 'rotate(0) scale(1)' }
  ], {
    duration: 300,
    iterations: 1,
  })
}

const upDatedView = (type, text) => {
  if (type != undefined || text != undefined) {
    let template = `
    <p> <b>${type}:</b> ${text}</p>
    `

    display.innerHTML = template
    animateText()
  }
}

const getRandomLevel = () => {
  let levelSelected

  if (customLevel.length !== 0) {
    let indexLevelCustom = getRandomIndex(customLevel.length)
    levelSelected = customLevel[indexLevelCustom]
  }
  let defaultLevel = 5
  let randomLevel = getRandomIndex(levelSelected || defaultLevel)

  return randomLevel
}

const getRandomOutput = (optionQuery, level, lang) => {
  let newType
  let newText
  if (optionQuery === 'truth') {
    const filterByLevel = TRUTH.filter(item => item.level == level)
    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary } = filterByLevel[indexFilter]

    newText = lang === 'en' ? summary.en : summary.es
    newType = type
  }

  if (optionQuery === 'dare') {
    const filterByLevel = DARE.filter(item => item.level == level)
    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary } = filterByLevel[indexFilter]

    newText = lang === 'en' ? summary.en : summary.es
    newType = type
  }

  upDatedView(newType, newText)
}

const onClickAction = ({ target: { dataset } }) => {
  let level = getRandomLevel()
  getRandomOutput(dataset.action, level, inputLang.value)
}

const getCustomLevel = (e) => {
  if (e.target.id !== '') {
    let elementSelect = document.querySelector('#' + e.target.id)

    if (elementSelect.checked) {
      customLevel.push(elementSelect.dataset.level)
    } else {
      let index = customLevel.indexOf(elementSelect.dataset.level)
      customLevel.pop(index)
    }
  }
}

containerBtn.addEventListener('click', onClickAction)
inputLang.addEventListener('change', onChangeLang)
// containerSetting.addEventListener('click', getCustomLevel)

getTruthAndDare()

