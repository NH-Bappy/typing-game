const word = "In the heart of a mist-laden town stood a peculiar shop—'Harrow & Sons: Clockmakers Since 1821.' Time itself seemed to hesitate at its doorstep; the air smelled faintly of brass and old secrets. Inside, hundreds of clocks ticked in a fragile orchestra of precision, each one marking not merely the passage of hours but something far stranger. The master clockmaker, Edwin Harrow, was a man of quiet genius. His hands, steady as fate, could repair the tiniest cog with the same care one might reserve for a heartbeat. Yet behind his calm eyes lay a storm of regret—for every clock he built, he whispered, 'Another chance lost.' He was said to be working on a final masterpiece: a clock that could measure the moments you wish you’d lived differently. It would not show time in seconds or minutes, but in choices. Rumors spread that once the clock was complete, it could turn back a single decision—no more, no less. One night, as thunder rattled the windows and the town slept under the shroud of rain, Edwin finished his creation. The clock stood tall, dark wood gleaming, its pendulum swaying like a heartbeat trapped between guilt and hope. He placed his trembling hand on the dial and whispered, 'Bring her back.' The gears began to spin backward, and the world bent like molten glass. When Edwin opened his eyes, he stood again in the garden twenty years ago—his wife Elena laughing beneath the apple tree, her hair lit by the dying sun. She turned to him and said, 'Don’t be late tonight.' But in his chest, time shuddered. He realized too late the paradox of his own making: if he changed the past, he would never build the clock that brought him here. As the vision faded, so did he—his body dissolving into the wind like dust at dawn. The clock in the shop stopped ticking at exactly midnight, its hands frozen between yesterday and never again. The next morning, the townsfolk found the shop door open. Inside, every clock had fallen silent—except one. It ticked softly, steadily, whispering a secret rhythm: 'Not all time can be repaired.'".split(' ');
const game = document.getElementById('game');
const words = document.getElementById('words')
const wordCounts = word.length;


function addClass(element , name){
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

game.addEventListener('keyup' , ev => {
    // console.log(ev)
    const key = ev.key;
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter.innerHTML;


    console.log({ key, expected });
})




newGame();























