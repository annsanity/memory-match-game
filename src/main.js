import { Application, Assets, Text, Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';

(async () => {
    const app = new Application();
    await app.init({
        background: '#084c24',
        resizeTo: window,
    });

    const sounds = {
        flip: await Assets.load('mixkit-game-ball-tap-2073.wav'),
        match : await Assets.load('mixkit-winning-a-coin-video-game-2069.wav'),
        win: await Assets.load('src/assets/sounds/mixkit-casino-bling-achievement-2067.wav')
    };

    document.getElementById('game-container').appendChild(app.canvas);

    const gameContainer = new Container();
    gameContainer.x = app.screen.width / 2;
    gameContainer.y = app.screen.height / 2;
    app.stage.addChild(gameContainer);

    const title = new Text({
        text: 'Memory Match Game',
        style: {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xffffff,
        }
    });

    title.anchor.set(0.5);
    title.y = -200;
    gameContainer.addChild(title);  

    //State of game
    let flippedCards = [];
    let canFlip = true;
    let matchedPairs = 0;
    let moves = 0;

    // score
    const scoreText = new Text({
        text: 'Moves: 0',
        style: {
            fontFamily: 'Arial',
            fontSize: 24,
            fill:  0xffffff,
        }
    });

    scoreText.anchor.set(0.5);
    scoreText.y = -250;
    gameContainer.addChild(scoreText);

    //Reset Button
    const resetButton = new Container();
    const buttonBg = new Graphics();
    buttonBg.fill({ color: 0xffffff });
    buttonBg.roundRect(-50, -20, 100, 40, 10);

    const buttonText = new Text({
        text: 'Reset',
        style: {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x000000,
        }
    });
    buttonText.anchor.set(0.5);

    resetButton.addChild(buttonBg, buttonText);
    resetButton.y = -250;
    resetButton.x = -150;
    resetButton.interactive = true;
    gameContainer.addChild(resetButton);

    function resetGame() {
        flippedCards = [];
        canFlip = true;
        matchedPairs = 0;
        moves = 0;
        scoreText.text = 'Moves: 0';

        cardSymbols.sort(() => Math.random() - 0.5);

        gameContainer.children.forEach((child, index) => {
            if (child instanceof Container && child !== resetButton && child !== scoreText && child !== title) {
                child.children[0].visible = true;
                child.children[1].visible = false;
                child.revealed = false;
                child.symbol = cardSymbols[index - 3]; // Adjust for title, score, and reset button
            }
        });

    }

    resetButton.on('pointerdown', resetGame);

    resetButton.on('pointerover', () => {
        gsap.to(buttonBg.scale, {
            x: 1.1,
            y: 1.1,
            duration: 0.2
        });
    });
    
    resetButton.on('pointerout', () => {
        gsap.to(buttonBg.scale, {
            x: 1,
            y: 1,
            duration: 0.2
        });
    });


    // create card function
    function createCard(symbol) {

        const card = new Container();
        
        const cardFront = new Container();
        const cardBack = new Graphics();
        const frontBg = new Graphics();
        frontBg.fill({color: 0xffffff});
        frontBg.rect(-50, -75, 100, 150, 10)

        cardBack.fill({color: 0x0000ff});
        cardBack.roundRect(-50, -75, 100, 150, 10);

        const text = new Text({
            text: symbol,
            style: {
                fontSize: 60,
                fill: symbol === '♥' || symbol === '♦' ? '#FF0000' : '#000000'
            }
        });

        text.anchor.set(0.5);
        cardFront.addChild(frontBg, text);
        cardFront.visible = false;

        card.addChild(cardBack, cardFront);
        card.interactive = true;
        card.symbol = symbol;
        card.revealed = false;

        card.on('pointerdown', () => {
            if(canFlip && !card.revealed && flippedCards.length < 2){
                flipCard(card);
            }
        });

        card.on('pointerover', () => {
            if(!card.revealed && canFlip){
                gsap.to(card.scale, {
                    x: 1.05,
                    y: 1.05,
                    duration: 0.2
                });
            }
        })

        card.on('pointerout', () => {
            gsap.to(card.scale, {
                x: 1,
                y: 1,
                duration: 0.2
            });
        });

        return card;
    }

    function flipCard(card) {
        card.revealed = true;
        flippedCards.push(card);
        moves++;
        scoreText.text = `Moves: ${moves}`;

        // play sound
        sounds.flip.play(); 

        //using gsap to animate
        gsap.to(card.scale,{
            x: 0,
            duration: 0.15,
            onComplete: () => {
                card.children[0].visible = !card.children[0].visible;
                card.children[1].visible = !card.children[1].visible;
                gsap.to(card.scale, {
                    x: 1,
                    duration: 0.15,
                    onComplete: () => {
                        if (flippedCards.length === 2) {
                            checkMatch();
                        }
                    }
                })
            }
        }

        );
    }

    function checkMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;
    
        if (card1.symbol === card2.symbol) {

            // sound
            sounds.match.play();

            // Cards match
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
    
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    sounds.win.play();
                    showWinningScreen();
                }, 500);
            }
        } else {
            // Cards don't match
            setTimeout(() => {
                flippedCards.forEach(card => {
                    gsap.to(card.scale, {
                        x: 0,
                        duration: 0.15,
                        onComplete: () => {
                            card.children[0].visible = true;
                            card.children[1].visible = false;
                            card.revealed = false;
                            gsap.to(card.scale, {
                                x: 1,
                                duration: 0.15
                            });
                        }
                    });
                });
                flippedCards = [];
                canFlip = true;
            }, 1000); // Added timeout duration
        }
    }

    const symbols = ['♠', '♣', '♥', '♦', '★', '●'];
    let cardSymbols = [...symbols, ...symbols];

    cardSymbols.sort(() => Math.random() - 0.5)

    cardSymbols.forEach((symbol, index) => {
        const card = createCard(symbol);
        card.x = (index % 4 - 1.5) * 120;
        card.y = (Math.floor(index / 4) - 1) * 170;
        gameContainer.addChild(card);
    }
    );

    function showWinningScreen() {
        const winContainer = new Container();

        const overlay = new Graphics();
        overlay.fill({ color: 0x000000, alpha: 0.8 }); 
        overlay.rect(-app.screen.width/2, -app.screen.height/2, 
            app.screen.width, app.screen.height);

        const winText = new Text({
            text: `Congratulations!\nYou Won in ${moves} moves!`,
            style:{
                fontFamily: 'Arial',
                fontSize: 48,
                fill: 0xffffff,
                align: 'center'
            }
        });
        winText.anchor.set(0.5);

        winContainer.addChild(overlay, winText);
        gameContainer.addChild(winContainer);

        gsap.from(winText.scale, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'back.out'
        });
    }
})();