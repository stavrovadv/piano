(function() {
    const main = document.querySelector('.main');
    const btnsModeContainer = document.querySelector('.btn-container');
    const piano = document.querySelector('.piano');
    const pianoKeys = document.querySelectorAll('.piano-key');
    const fullscreen = document.querySelector('.fullscreen');

    let isDown = false;
    let pressedKeys = new Set(); // для кодов нажатых клавиш

    piano.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    btnsModeContainer.addEventListener('click', (e) => changeMode(e));

    piano.addEventListener('mousedown', function (e) {
        // Звук при нажатии по клавише
        start(e.target);
        isDown = true;
    });

    piano.addEventListener('mouseover', function (e) {
        // Звук при проведении по клавишам с зажатой кнопкой мыши
        if (e.target.classList.contains('piano-key') && isDown) {
            start(e.target);
        }
    });

    main.addEventListener('mouseup', function (e) {
        pianoKeys.forEach(el => {
            if (el.classList.contains('piano-key-active')) {
                stop(el);
            }
        });
        isDown = false;
    });
    piano.addEventListener('mouseout', (e) => stop(e.target));

    function stop(keyEl) {
      keyEl.classList.remove('piano-key-active');
    }

    window.addEventListener('keydown', (e) => playFromKeyboard(e));

    function playFromKeyboard(e){
      pianoKeys.forEach(el => {
        // key, а не code, чтобы не срабатывало на кириллицу
          if (el.dataset.letter === e.key.toUpperCase()) {
              if (!pressedKeys.has(e.code)) {
                  pressedKeys.add(e.code);
                  start(el);
              }
          }
      });
    }

    window.addEventListener('keyup', function (e) {
        if (pressedKeys.has(e.code)) {
            pianoKeys.forEach(el => {
                if (el.dataset.letter === e.code.slice(-1)) {
                    stop(el);
                }
            });
            pressedKeys.delete(e.code);
        }
    });

    fullscreen.addEventListener('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });

    function changeMode(e) {
        let btnsMode = Object.values(btnsModeContainer.children);
        btnsMode.forEach(element => {
            element.classList.remove('btn-active');
        });
        piano.classList.remove('letters');

        let selectedBtnMode = e.target;
        selectedBtnMode.classList.add('btn-active');
        if (selectedBtnMode.classList.contains('btn-letters')) {
            piano.classList.add('letters');
        }
    }

    function playAudio(src) {
        const audio = new Audio();
        audio.src = src;
        audio.currentTime = 0;
        audio.play();
    };

    function start(el) {
        el.classList.add('piano-key-active');
        let curr = el.dataset.note;
        playAudio(`./assets/audio/${curr}.mp3`);
    };
}())
