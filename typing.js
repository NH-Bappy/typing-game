const word = "In the ephemeral landscape of modern existence, only the most astute, resilient, and discerning minds can navigate the labyrinthine complexities of life. They confront adversity with equanimity, transforming tribulation into triumph through fortitude and ingenuity. Their eloquence transcends mere speech, reflecting a lucid, articulate, and coherent intellect that commands both admiration and credibility. Unlike the capricious and impetuous, they are meticulous, methodical, and strategic, always maintaining composure amid turmoil. Their tenacity emanates from conviction, not conceit, and their benevolence stems from empathy, not obligation.Such individuals cultivate perspicacity, perceiving subtle nuances where others see only ambiguity.They remain undaunted by formidable opposition, wielding rationality and foresight as their most potent instruments.In moments of chaos, their cogent reasoning and pragmatic judgment restore cohesion and clarity.They possess a magnanimous disposition, blending humility with audacity, caution with courage, and discipline with innovation.Their visionary nature transforms mediocrity into excellence, entropy into order, and aspiration into attainment.Ultimately, their legacy endures not through ostentation or affluence, but through the authenticity of their character and the integrity of their purpose.In an era dominated by pretension, narcissism, and transience, such sagacious, altruistic, and formidable spirits illuminate the path toward genuine wisdom, virtue, and enlightenment".split(' ');
const game = document.getElementById('game');
const words = document.getElementById('words')
const info = document.getElementById('info');
const wordCounts = word.length;
const gameTimer = 30 * 1000;
let timer = null; // Changed from window.timer to let (better practice)
let gameStart = null; // Changed from window.gameStart to let (better practice)
let wpmInterval = null;

function addClass(element, name) {
    element.classList.add(name);
}

function removeClass(element, name) {
    element.classList.remove(name);
}

function randomWord() {
    const randomIndex = Math.floor(Math.random() * wordCounts);
    return word[randomIndex];
}

function formatWord(word) {
    return `<div class="word">
        <span class="letter">${word.split('').join('</span><span class="letter">')}</span>
    </div>`;
}

function resetGame() {
    // Clear any existing intervals
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (wpmInterval) {
        clearInterval(wpmInterval);
        wpmInterval = null;
    }

    gameStart = null;
    removeClass(game, 'over');
    words.style.marginTop = '0px';
}

function newGame() {
    resetGame();
    words.innerHTML = '';

    // Generate words
    for (let i = 0; i < 200; i++) {
        words.innerHTML += formatWord(randomWord());
    }

    // Select the FIRST word and letter after generating all content
    const firstWord = document.querySelector('.word');
    const firstLetter = document.querySelector('.letter');
    if (firstWord && firstLetter) {
        addClass(firstWord, 'current');
        addClass(firstLetter, 'current');

        // Position cursor at start
        const cursor = document.getElementById('cursor');
        cursor.style.top = firstLetter.getBoundingClientRect().top + 2 + 'px';
        cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';
    }

    // Reset timer display
    info.innerHTML = Math.round(gameTimer / 1000) + '';
}

function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    if (!lastTypedWord) return 0;

    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.classList.contains('incorrect'));
        const correctLetters = letters.filter(letter => letter.classList.contains('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });

    if (!gameStart) return 0;
    const timeElapsed = (new Date()).getTime() - gameStart;
    if (timeElapsed === 0) return 0;

    return Math.round((correctWords.length / timeElapsed) * 60000);
}

function gameOver() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    if (wpmInterval) {
        clearInterval(wpmInterval);
        wpmInterval = null;
    }

    addClass(game, 'over');
    const result = getWpm();
    info.innerHTML = `WPM: ${result}`;
}

game.addEventListener('keyup', ev => {
    // Prevent default behavior for space key to avoid scrolling
    if (ev.key === ' ') {
        ev.preventDefault();
    }

    const key = ev.key;
    const currentWord = document.querySelector('.word.current');

    // If game is over, don't process input
    if (game.classList.contains('over')) {
        return;
    }

    // If there's no current word, something went wrong - restart game
    if (!currentWord) {
        newGame();
        return;
    }

    const currentLetter = currentWord.querySelector('.letter.current');
    const expected = currentLetter?.textContent || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstElementChild;

    // Start timer on first valid input
    if (!timer && (isLetter || isSpace)) {
        gameStart = (new Date()).getTime();

        timer = setInterval(() => {
            if (gameStart) {
                const currentTime = (new Date()).getTime();
                const milliseconds = currentTime - gameStart;
                const seconds = Math.floor(milliseconds / 1000);
                const sLeft = Math.round(gameTimer / 1000) - seconds;

                info.innerHTML = sLeft + '';

                if (sLeft <= 0) {
                    gameOver();
                }
            }
        }, 1000);
    }

    // Letter logic
    if (isLetter) {
        if (currentLetter) {
            if (key === expected) {
                addClass(currentLetter, 'correct');
                removeClass(currentLetter, 'incorrect');
            } else {
                addClass(currentLetter, 'incorrect');
                removeClass(currentLetter, 'correct');
            }
            removeClass(currentLetter, 'current');

            if (currentLetter.nextElementSibling) {
                addClass(currentLetter.nextElementSibling, 'current');
            }
        } else {
            // Extra letter (typed after finishing the word)
            const incorrectLetter = document.createElement('span');
            incorrectLetter.textContent = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }

    // Space logic
    if (isSpace) {
        if (expected !== ' ') {
            // Mark all uncorrected letters as incorrect
            const lettersToInvalidate = [...currentWord.querySelectorAll('.letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }

        removeClass(currentWord, 'current');

        const nextWord = currentWord.nextElementSibling;
        if (nextWord) {
            addClass(nextWord, 'current');

            // Clear current letter from previous word
            if (currentLetter) {
                removeClass(currentLetter, 'current');
            }

            // Set first letter of next word as current
            const firstLetterOfNextWord = nextWord.querySelector('.letter');
            if (firstLetterOfNextWord) {
                addClass(firstLetterOfNextWord, 'current');
            }
        }
    }

    // Backspace logic
    if (isBackspace) {
        // Case 0: remove extra letters
        const extraLetter = currentWord.querySelector('.letter.extra:last-of-type');
        if (extraLetter) {
            extraLetter.remove();

            // Move cursor to the new last letter
            const newLastLetter = currentWord.lastElementChild;
            if (newLastLetter) {
                document.querySelectorAll('.letter.current').forEach(l => removeClass(l, 'current'));
                addClass(newLastLetter, 'current');
            }
            return;
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

    // Scroll logic - move lines up when needed
    if (currentWord.getBoundingClientRect().top > 250) {
        const margin = parseInt(words.style.marginTop || '0');
        words.style.marginTop = (margin - 35) + 'px'; // Reduced from 40 to 35 for smoother scrolling
    }

    // Move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');

    if (cursor && (nextLetter || nextWord)) {
        const targetElement = nextLetter || nextWord;
        const rect = targetElement.getBoundingClientRect();

        cursor.style.top = (rect.top + 2) + 'px';

        if (nextLetter) {
            cursor.style.left = rect.left + 'px';
        } else {
            cursor.style.left = rect.right + 'px';
        }
    }
});

// Prevent spacebar from scrolling the page
game.addEventListener('keydown', (ev) => {
    if (ev.key === ' ') {
        ev.preventDefault();
    }
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    gameOver();
    newGame();
});

// Initialize the game
newGame();