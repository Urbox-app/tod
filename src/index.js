import getData from './utils/getData'
import './utils/jquery.fortune.min.js'
import ProgressBar from'./utils/progressbar.min.js'
import './css/style.css'

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
const gameTab = document.querySelector('#game-tab')
const settingTab = document.querySelector('#setting-tab')
const title = document.querySelector('#title')
const myTab = document.querySelector('#myTab')
const btnBackSetting = document.querySelector('#btn-back-setting')
const btnBackGame = document.querySelector('#btn-back-game')
const container1 = document.querySelector('#container1')
const customLevel = []

let languageBrowser
let timeActual

let textInit = inputLang.value === 'en' ? 'Are they ready?' : '¿Están listos?'

window.onload = () => {
  sessionStorage.setItem('isNewGame', true)
  display.innerText = textInit
  languageBrowser = window.navigator.language.split('-')[0]
  
  inputLang.value = languageBrowser
  onChangeLang()
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

let tuluzz = new ProgressBar.Circle(container1, {
  strokeWidth: 6,
  easing: 'easeInOut',
  color: '#21abe9',
  trailColor: '#f4f4f4',
  trailWidth: 1,
  svgStyle: null
});


const onChangeLang = () => {
  textInit = inputLang.value === 'en' ? 'Are they ready?' : '¿Están listos?'
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
  randomLevel = getRandomIndex(defaultLevel)
  return randomLevel
}

const getRandomOutput = (optionQuery, level, lang) => {
  let optionSelect = optionQuery
  let newType
  let newText

  if (optionSelect === 'p') {
    // let newText = lang === 'en' ? 'Take off one piece of clothing for the rest of the game.' : 'Quitate un prenda por el resto de juego.'

    // upDatedView('Dare', newText)
    display.style.textShadow = '0px 0px 20px #c82333'

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

    display.style.textShadow = '0px 0px 20px #33c2ff'

    newText = lang === 'en' ? summary.en : summary.es
    newType = lang === 'en' ? `${type} ❓` : 'Verdad ❓'
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

    display.style.textShadow = '0px 0px 20px #ff0000'

    newText = lang === 'en' ? summary.en : summary.es
    newType = lang === 'en' ? `${type} 🔥` : 'Reto 🔥'
  }

  upDatedView(newType, newText)
}

const onClickAction = ({ dataset }) => {
  let level = getRandomLevel()
  getRandomOutput(dataset.action, level, inputLang.value)
}

const getCustomLevel = (e) => {
  if (e.target.id.includes('check')) {
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
  btnPlay.style.display = ''
  let countTime = 0
  timeActual = 5
  let interval = setInterval(() => {
    if (countTime !== parseInt(timeActual) + 1) {
      let percentage = countTime / timeActual
      tuluzz.animate(percentage);
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

const onClickBackSetting = () => {
  setting.style.display = 'none'

  title.style.display = ''
  myTab.style.display = ''

}

const onClickBackGame = () => {
  game.style.display = 'none'

  title.style.display = ''
  myTab.style.display = ''
}

const onClickGame = () => {
  let rouletter
  let option
  game.style.display = ''

  if (sessionStorage.getItem('isNewGame') === 'true') {
    // tuluzz._container.appendChild('<img data - action="p" src = "./images/1p.png" /> ')
    option = {
      speed: 10,
      duration: 3,
      stopImageNumber: getRandomIndex(5),
      startCallback: function () {
        console.log('start');
      },
      slowDownCallback: function () {
        console.log('slowDown');
      },
      stopCallback: function ($stopElm) {
        onClickAction($stopElm[0])
        document.querySelector('.start').disabled = false
        console.log('stop', $stopElm[0]);
      }
    }
    rouletter = $('#c-roulette').roulette(option);

    $('.start').click(function () {
      this.disabled = true;
      option['stopImageNumber'] = getRandomIndex(5)
      rouletter.roulette('option', option);
      rouletter.roulette('start');
    });
    sessionStorage.setItem('isNewGame', false)
  }
}

  settingTab.addEventListener('click', () => {
    setting.style.display = ''
  })

// containerBtn.addEventListener('click', onClickAction)
inputLang.addEventListener('change', onChangeLang)
containerSetting.addEventListener('click', getCustomLevel)
inputFont.addEventListener('change', onChangeFont)
btnPlay.addEventListener('click', barProgress)
myTab.addEventListener('click', changeView)
btnBackSetting.addEventListener('click', onClickBackSetting)
btnBackGame.addEventListener('click', onClickBackGame)
gameTab.addEventListener('click', onClickGame)

getTruthAndDare()

$(document).ready(function () {
  let optionRuleta = [
  {
    title: 'Truth',
    color: '#1f60a2',
    id: 'truth'
  },
  {
    title: 'Dare',
    color: '#dc3545',
    id: 'dare'
  },
  {
    title: 'Truth',
    color: '#1f60a2',
    id: 'truth'
  },
  {
    title: 'Dare',
    color: '#dc3545',
    id: 'dare'
  },
  {
    title: 'Truth',
    color: '#1f60a2',
    id: 'truth'
  },
  {
    title: 'Dare',
    color: '#dc3545',
    id: 'dare'
  },
  {
    title: 'Truth',
    color: '#1f60a2',
    id: 'truth'
  },
  {
    title: 'Dare',
    color: '#dc3545',
    id: 'dare'
  },
]
  let tamanyoRuleta = 300;
  let numeroCasillas = optionRuleta.length;
  let anguloCasillas = 360 / numeroCasillas;
  let grados = (180 - anguloCasillas) / 2;
  let alturaCasilla = Math.tan(grados * Math.PI / 180) * (tamanyoRuleta / 2);


  $(".ruleta").css({
    'width': tamanyoRuleta + 'px',
    'height': tamanyoRuleta + 'px'
  })

  $(".contenedor-ruleta").css({
    'width': tamanyoRuleta + 'px',
    'height': tamanyoRuleta + 'px',
    'margin':' 0 auto'
  })

  $('head').append('<style id="afterNumero"></style>');

  optionRuleta.forEach((item, i) => {
    $(".ruleta").append('<div class="opcion opcion-' + i + '"></div>');
    let clasS = '.opcion-' + i;

    $(clasS)
      .attr('data-action', item.id) 
      .attr('data-content', i)
      .attr('data-ancho', (tamanyoRuleta / 2) + 'px')
      .attr('data-line', (tamanyoRuleta / 2) + 'px');

    $(clasS).css({
      'transform': 'rotate(' + anguloCasillas * i + 'deg)',
      'border-bottom-color': item.color
    });

    $('#afterNumero').append('.opcion-' + i + '::before {content: "' + item.title + '"}');

  })

  $(".opcion").css({
    'border-bottom-width': alturaCasilla + 'px',
    'border-right-width': (tamanyoRuleta / 2) + 'px',
    'border-left-width': (tamanyoRuleta / 2) + 'px'
  })

  $('.ruleta').before().click(function () {
    let num;
    let numID = 'number-';
    num = 0 + Math.round(Math.random() * (numeroCasillas - 1));
    numID += num;

    $('#animacionRuleta').remove();

    $('head').append('<style id="animacionRuleta">' +
      '#number-' + num + ' { animation-name: number-' + num + '; } ' +
      '@keyframes number-' + num + ' {' +
      'from { transform: rotate(0); } ' +
      'to { transform: rotate(' + (360 * (numeroCasillas - 1) - anguloCasillas * num) + 'deg); }' +
      '}' +
      '</style>'
    );

    $('.ruleta').removeAttr('id').attr('id', numID);

    setTimeout(()=> {
      onClickAction($('.opcion-' + num)[0])
    },6000)
  });

});