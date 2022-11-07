import getData from './utils/getData'
import './css/style.css'
import './utils/jquery.fortune.min.js'

let GENERALDATA = getData()
const TRUTH = new Array
const DARE = new Array
// const containerBtn = document.querySelector('.container-btn')
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
const game = document.querySelector('#game')
const setting = document.querySelector('#setting')
const title = document.querySelector('#title')
const myTab = document.querySelector('#myTab')
const btnBackSetting = document.querySelector('#btn-back-setting')
const btnBackGame = document.querySelector('#btn-back-game')
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

  setTimeout(() => {
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

  if (optionSelect === 'p') {
    // let newText = lang === 'en' ? 'Take off one piece of clothing for the rest of the game.' : 'Quitate un prenda por el resto de juego.'

    // upDatedView('Dare', newText)

  }

  if (optionSelect === 'truth') {
    const filterByLevel = TRUTH.filter(item => item.level == level)
    if (filterByLevel.length === 0) return;

    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary, time } = filterByLevel[indexFilter]

    if (time !== '') {
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

  if (optionSelect === 'dare') {
    const filterByLevel = DARE.filter(item => item.level == level)
    if (filterByLevel.length === 0) return;

    const indexFilter = getRandomIndex(filterByLevel.length)
    const { type, summary, time } = filterByLevel[indexFilter]

    if (time !== '') {
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

const onClickAction = ({ dataset }) => {
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
const onChangeFont = ({ target }) => {
  body.style.fontFamily = target.value
}

const barProgress = () => {
  btnPlay.style.display = 'none'
  let countTime = 0

  let interval = setInterval(() => {
    if (countTime !== parseInt(timeActual) + 1) {
      let percentage = countTime * 100 / timeActual
      progress.style.width = `${percentage}%`
      progress.innerText = `${parseInt(percentage)}%`
      countTime++
    } else {
      soundTime()
      clearInterval(interval)
    }
  }, 1000)
}

const changeView = (e) => {
  if (e.target.id === 'game-tap' || 'setting-tap') {
    title.style.display = 'none'
    myTab.style.display = 'none'
  }
}

// let option = {
//   speed: 10,
//   duration: 3,
//   stopImageNumber: getRandomIndex(5),
//   startCallback: function () {
//     console.log('start');
//   },
//   slowDownCallback: function () {
//     console.log('slowDown');
//   },
//   stopCallback: function ($stopElm) {
//     console.log('stop');
//     onClickAction($stopElm[0])
//   }
// }

// let rouletter = $('.roulette').roulette(option);

// $('.start').click(function () {
//   option['stopImageNumber'] = getRandomIndex(5)
//   rouletter.roulette('option', option);
//   rouletter.roulette('start');

// });

const onClickBackSetting = () => {
  setting.classList.remove('active')
  setting.classList.remove('show')

  title.style.display = ''
  myTab.style.display = ''

}

const onClickBackGame = () => {
  game.classList.remove('active')
  game.classList.remove('show')

  title.style.display = ''
  myTab.style.display = ''
}


// containerBtn.addEventListener('click', onClickAction)
inputLang.addEventListener('change', onChangeLang)
containerSetting.addEventListener('click', getCustomLevel)
inputFont.addEventListener('change', onChangeFont)
btnPlay.addEventListener('click', barProgress)
// myTab.addEventListener('click', changeView)
// btnBackSetting.addEventListener('click', onClickBackSetting)
// btnBackGame.addEventListener('click', onClickBackGame)

getTruthAndDare()