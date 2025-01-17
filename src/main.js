import { Application, Assets, Text, Container, Ticker, Graphics } from 'pixi.js';
import { gsap } from 'gsap';

(async () => {
    const app = new Application();
    await app.init({
        background: '#084c24',
        resizeTo: window,
    });

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

    // create card functio
    function createCard(symbol) {

        const card = new Container();
        
        const cardFront = new Graphics();
        const frontBg = new Graphics();
        frontBg.fill(0xffffff);
        frontBg.rect(-50, -75, 100, 150, 10)
        frontBg.fill();

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

        return card;
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

    app.ticker.add((time) => {

    });
})();