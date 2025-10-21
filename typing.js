const word = "In a world full of ambiguity and adversity, truly astute individuals remain undaunted by formidable challenges. Their resilience and tenacity allow them to navigate tumultuous circumstances with poise and clarity. They are not complacent or apathetic; rather, they are vigilant, articulate, and meticulous in every endeavor. Their benevolent nature inspires empathy, while their pragmatic mindset ensures efficiency and precision. In moments of turmoil, they avoid impulsive decisions and rely on rational judgment. Such discernment distinguishes them from the capricious or superficial thinkers who often succumb to delusion.Their eloquent speech and coherent reasoning foster camaraderie and credibility among peers.They remain steadfast in purpose, yet adaptable to evolving realities.Even in clandestine conflicts or volatile environments, they uphold integrity and honesty.Their lucid vision turns chaos into clarity, transforming obstacles into opportunities.They treat failure not as a catastrophe, but as a catalyst for innovation.While others grow despondent or melancholic, these resilient souls remain composed, diligent, and altruistic.Their profound insight, sagacious counsel, and audacious spirit make them formidable leaders who inspire reverence rather than fear.Ultimately, it is their humility, fortitude, and perseverance that define their legacy.They transform mediocrity into excellence, chaos into order, and aspiration into achievement.In a society often blinded by materialism and vanity, such virtuous, candid, and magnanimous individuals remind us that true greatness lies not in arrogance, but in authenticity and wisdom.".split(' ');
const game = document.getElementById('game');
const words = document.getElementById('words')
const wordCounts = word.length;


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









    // move our cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current')
    const cursor = document.getElementById('cursor')

    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';




});




newGame();










// =======================BackSpace porjonto hoiche==================












