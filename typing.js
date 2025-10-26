const word = "In the ephemeral landscape of modern existence, only the most astute, resilient, and discerning minds can navigate the labyrinthine complexities of life. They confront adversity with equanimity, transforming tribulation into triumph through fortitude and ingenuity. Their eloquence transcends mere speech, reflecting a lucid, articulate, and coherent intellect that commands both admiration and credibility. Unlike the capricious and impetuous, they are meticulous, methodical, and strategic, always maintaining composure amid turmoil. Their tenacity emanates from conviction, not conceit, and their benevolence stems from empathy, not obligation.Such individuals cultivate perspicacity, perceiving subtle nuances where others see only ambiguity.They remain undaunted by formidable opposition, wielding rationality and foresight as their most potent instruments.In moments of chaos, their cogent reasoning and pragmatic judgment restore cohesion and clarity.They possess a magnanimous disposition, blending humility with audacity, caution with courage, and discipline with innovation.Their visionary nature transforms mediocrity into excellence, entropy into order, and aspiration into attainment.Ultimately, their legacy endures not through ostentation or affluence, but through the authenticity of their character and the integrity of their purpose.In an era dominated by pretension, narcissism, and transience, such sagacious, altruistic, and formidable spirits illuminate the path toward genuine wisdom, virtue, and enlightenment".split(' ');
const game = document.getElementById('game');
const words = document.getElementById('words')
const info = document.getElementById('info');
const wordCounts = word.length;
const gameTimer = 30 * 1000
window.timer = null;
window.gameStart = null;



function addClass(element, name) {
    element.classList.add(name);
}

function removeClass(element, name) {
    if (name && typeof name === 'string') {
        element.classList.remove(name);
    }
}


function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordCounts);
    return word[randomIndex];
}

function formatWord(word) {
    return `<div class = "word">
        <span class="letter">
            ${word.split('').join('</span><span class="letter">')} 
        </span>
    </div>`
}



function newGame() {
    words.innerHTML = '';
    for (let i = 0; i < 200; i++) {
        words.innerHTML += formatWord(randomWord())
    }

    // Select the FIRST word and letter after generating all content
    const firstWord = document.querySelector('.word');
    const firstLetter = document.querySelector('.letter');
    addClass(firstWord, 'current');
    addClass(firstLetter, 'current');
    window.timer = null;
}

game.addEventListener('keyup', ev => {
    // console.log(ev)
    const key = ev.key;
    // Finds the current letter:
    const currentWord = document.querySelector('.word.current')
    const currentLetter = document.querySelector('.letter.current');
    // Gets the text content of the current letter element
    const expected = currentLetter?.textContent || ' ';
    // This line of JavaScript code is checking if a variable key represents a single letter character
    // key.length === 1 - Checks if the key string has exactly 1 character
    // key !== ' ' - Checks that this single character is NOT a space
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstElementChild;


    // console.log({ expected });[expected letter]
    // console.log({key})[what letter you are typing]
    console.log({ key, expected });

    if (!window.timer && isLetter){
        window.timer = setInterval(() => {
            if(!window.gameStart){
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const mileSecond = currentTime - window.gameStart;
            const second = Math.round(mileSecond / 1000);
            const sLeft = (gameStart / 1000) - second;
            info.innerHTML = sLeft + ''
        } , 1000);
    }

    //letter logic
    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key.trim() === expected.trim() ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');

            if (currentLetter.nextElementSibling) {
                addClass(currentLetter.nextElementSibling, 'current');
            }

        } else {
            //Extra letter (typed after finishing the word)
            const incorrectLetter = document.createElement('span');
            incorrectLetter.textContent = key; // show the actual letter typed
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    // for space
    if (isSpace) {
        if (expected !== ' ') {
            // “Find all letters in the current word that are not correct yet, and store them in an array.”
            const letterToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            // console.log(letterToInvalidate)
            // return
            letterToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect')
            });
        }
        removeClass(currentWord, 'current')
        addClass(currentWord.nextElementSibling, 'current')
        if (currentLetter) {
            removeClass(currentLetter, 'current')
        }
        addClass(currentWord.nextElementSibling?.firstElementChild, 'current')
    }

    //BackSpace
    if (isBackspace) {
        // Case 0: remove extra letters
        const extraLetter = currentWord.querySelector('.letter.extra:last-of-type');
        if (extraLetter) {
            extraLetter.remove();

            // Move cursor to the new last letter
            const newLastLetter = currentWord.lastElementChild;
            if (newLastLetter) {
                // clear previous .current first
                document.querySelectorAll('.letter.current').forEach(l => removeClass(l, 'current'));
                addClass(newLastLetter, 'current');
            }

            //  Recalculate cursor position immediately
            const nextLetter = document.querySelector('.letter.current');
            const nextWord = document.querySelector('.word.current');
            const cursor = document.getElementById('cursor');
            cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
            cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[
                nextLetter ? 'right' : 'right'
            ] + 'px';

            return; // stop here
        }

        // Case 1: inside word but not first letter
        if (currentLetter && !isFirstLetter) {
            const prev = currentLetter.previousElementSibling;
            removeClass(currentLetter, 'current');
            if (prev) {
                addClass(prev, 'current');
                removeClass(prev, 'incorrect');
                removeClass(prev, 'correct');
            }
        }

        // Case 2: at first letter of current word → move to previous word
        else if (currentLetter && isFirstLetter) {
            const prevWord = currentWord.previousElementSibling;
            if (prevWord) {
                removeClass(currentWord, 'current');
                addClass(prevWord, 'current');
                removeClass(currentLetter, 'current');
                const lastLetter = prevWord.lastElementChild;
                if (lastLetter) {
                    addClass(lastLetter, 'current');
                    removeClass(lastLetter, 'incorrect');
                    removeClass(lastLetter, 'correct');
                }
            }
        }

        // Case 3: no current letter (after space)
        else if (!currentLetter) {
            const lastLetter = currentWord.lastElementChild;
            if (lastLetter) {
                addClass(lastLetter, 'current');
                removeClass(lastLetter, 'incorrect');
                removeClass(lastLetter, 'correct');
            }
        }
    }


// move lines to up word / words 

// getBoundingClientRect() is a method that gives you the size and position of an element relative to the viewport
// (the visible part of the browser window).
if(currentWord.getBoundingClientRect().top > 250 ){
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 40) + 'px';
}






    // move our cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current')
    const cursor = document.getElementById('cursor')

    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';




});




newGame();










// =======================BackSpace porjonto hoiche==================












