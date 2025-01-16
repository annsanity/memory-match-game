import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

class MemoryGame{
    constructor(size = 4){
        this.size = size;
        this.gridSize = size * size;
        this.cardTypes = this.gridSize / 2;

        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;

        this.boardElement = document.getElementById('game-board');
        this.movesElement = document.getElementById('moves');
        this.startButton = document.getElementById('start-btn');
        this.resetButton = document.getElementById('reset-btn');

        this.setupEventListeners();
    }

    setupEventListeners(){
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetButton());

    }

    startGame(){

        this.boardElement.innerHTML = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.movesElement.textContent = '0';

        const cardTypes = this.generateCardTypes();
        this.renderCards(cardTypes);

        this.startButton.disabled = true;
        this.resetButton.disabled = false;
    }

    generateCardTypes(){

        const types = Array.from({ length: this.cardTypes }, (_,i) => i);
    }
}

