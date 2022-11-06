import getData from './utils/getData'
import './css/style.css'

let GENERALDATA = getData()
const TRUTH = new Array
const DARE = new Array
const containerBtn = document.querySelector('.container-btn')
const display = document.querySelector('#display-text')
const inputLang = document.querySelector('#lang')
const containerSetting = document.querySelector('#setting')
const containerType = document.querySelector('#type')
const inputFont = document.querySelector('#font-family')
const body = document.querySelector('body')
const progress = document.querySelector('.progress-bar')
const containerProgress = document.querySelector('.container-progress')
const btnPlay = document.querySelector('#btn-play')
const sound = document.getElementById('sound')
const customLevel = []
let timeActual

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
  containerType.innerText = '😃'
  display.innerText = textInit;
  animateText()
}

const getRandomIndex = (max) => {
  return Math.floor(Math.random() * parseInt(max));
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

const soundTime = () => {
  sound.muted = false
  sound.play()
  
  setTimeout(()=> {
    sound.muted = true
    document.querySelector('.container-progress').style.display = ''
    progress.style.width = '0%'
  }, 4000)
}

const upDatedView = (type, text) => {
  if (type != undefined || text != undefined) {
    let lang = inputLang.value;
    let newType

    if (lang === 'es' && type === 'Truth ❗❓') newType = 'Verdad ❗❓';
    if (lang === 'es' && type === 'Dare 🔥') newType = 'Reto 🔥';

    display.innerText = text
    containerType.innerText = newType || type
    animateText()
  }
}

const getRandomLevel = () => {
  let levelSelected
  let randomLevel
  let defaultLevel = 6

  if (customLevel.length != 0) {
    let indexLevelCustom = getRandomIndex(customLevel.length)
    levelSelected = customLevel[indexLevelCustom]
    randomLevel = levelSelected

    return randomLevel
  }

  return randomLevel = getRandomIndex(defaultLevel)
}

const getRandomOutput = (optionQuery, level, lang) => {
  let optionSelect = optionQuery
  let newType
  let newText
  
  if ( optionSelect === 'random') {
    let option = ['truth','dare']
    let randomIndex = getRandomIndex(option.length)
    
    optionSelect = option[randomIndex]
    
  }

  if ( optionSelect === 'truth') {
    const filterByLevel = TRUTH.filter(item => item.level == level)
    if (filterByLevel.length === 0) return;

    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary, time } = filterByLevel[indexFilter]

    if(time !== '') {
      timeActual = time
      containerProgress.style.display = 'grid'
      btnPlay.style.display = 'block' 
    } else {
      containerProgress.style.display = ''
      sound.muted = true
    }

    newText = lang === 'en' ? summary.en : summary.es
    newType = `${type} ❗❓`
  }

  if ( optionSelect === 'dare') {
    const filterByLevel = DARE.filter(item => item.level == level)
    if (filterByLevel.length === 0) return;

    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary, time } = filterByLevel[indexFilter]

    if(time !== '') {
      timeActual = time
      containerProgress.style.display = 'grid'
      btnPlay.style.display = 'block' 
    } else {
      containerProgress.style.display = ''
      sound.muted = true
    }

    newText = lang === 'en' ? summary.en : summary.es
    newType = `${type} 🔥`
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
const onChangeFont = ({target}) => {
  body.style.fontFamily = target.value
}

const barProgress = () => {
  btnPlay.style.display = 'none'
  let countTime = 0

  let interval = setInterval(()=> {
  if(countTime !== parseInt(timeActual) + 1) {
      let percentage = countTime * 100 / timeActual
      progress.style.width = `${percentage}%`
      progress.innerText = `${parseInt(percentage)}%`
      countTime++
    } else {
      soundTime()
      clearInterval(interval)
    }
    },1000)
}


containerBtn.addEventListener('click', onClickAction)
inputLang.addEventListener('change', onChangeLang)
containerSetting.addEventListener('click', getCustomLevel)
inputFont.addEventListener('change', onChangeFont)
btnPlay.addEventListener('click', barProgress)

getTruthAndDare()

