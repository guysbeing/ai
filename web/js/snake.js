const {createApp} = Vue;
const app = createApp({
    data() {
        return {
            hardLevel: 1,
            width: 600,
            height: 600,
            blockSize: 20,
            widthInBlocks: 600 / 20,
            heightInBlocks: 600 / 20,
            score: 0,
            snake: null,
            apple: null,
            intervalId: null,
            style: null,
            headColor:"#FF0000",
            bodyColor:"#0000FF",
            appleColor:"#00FF00",
            directions: {
                "a": "left",
                "w": "up",
                "d": "right",
                "s": "down",
                "A": "left",
                "W": "up",
                "D": "right",
                "S": "down",
                "ArrowLeft": "left",
                "ArrowUp": "up",
                "ArrowRight": "right",
                "ArrowDown": "down"
            }
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleKeydown);
        const canvas = this.$refs.canvas;
        this.ctx = canvas.getContext('2d');
        this.snake = new Snake(this.widthInBlocks, this.heightInBlocks,this.blockSize,this.ctx);
        this.apple = new Apple(this.widthInBlocks, this.heightInBlocks,this.blockSize,this.ctx);
        this.startGame(this.hardLevel);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleKeydown);
    },
    beforeUnmount() {
        this.stopGame();
    },
    watch: {
        hardLevel(newValue) {
            this.game(newValue);
        }
    },
    methods: {
        game(hardLevel){
            this.stopGame();
            this.startGame(hardLevel);
        },
        handleKeydown(event){
            // console.log(event.key);
            this.changeSpeed(event.key);
            this.setDirection(event.key);
        },
        changeSpeed(key){
            console.log(key)
            if(key==="Shift") this.hardLevel++;
            else if(key === "Control") this.hardLevel--;
        },
        startGame(level) {
            this.intervalId = setInterval(() => {
                this.updateGame();
            }, this.calculateInterval(level));
            console.log(this.hardLevel);
        },
        stopGame() {
            clearInterval(this.intervalId);
        },
        updateGame() {
            this.clearCanvas();
            this.drawBorder();
            this.snake.move();
            this.checkEat();
            this.checkCollision();
            this.apple.draw(this.appleColor);
            this.snake.draw(this.headColor,this.bodyColor);
        },
        calculateInterval(level) {
            if(level>100) level=1;
            else level=101-level;
            const minDifficulty = 1;
            const maxDifficulty = 100;
            const minInterval = 50;
            const maxInterval = 1000;

            const difficultyRange = maxDifficulty - minDifficulty;
            const intervalRange = Math.log(maxInterval) - Math.log(minInterval);
            return Math.exp(Math.log(minInterval) + (intervalRange * (level - minDifficulty) / difficultyRange));
        },
        createApple(){
            this.apple.move();
            for (let i = 0; i < this.snake.segments.length; i++) {
                if (this.apple.position.equal(this.snake.segments[i])) {
                    this.apple.move();
                    this.createApple();
                    return;
                }
            }
        },
        checkEat(){
            if (this.snake.segments[0].equal(this.apple.position)) {
                this.score++;
                this.hardLevel++;
                this.createApple();
            } else {
                this.snake.segments.pop();
            }
        },
        checkCollision(){
            if (this.snake.checkCollision()) {
                this.snake = new Snake(this.widthInBlocks, this.heightInBlocks,this.blockSize,this.ctx);
                this.score=0;
                this.hardLevel=1;
                this.createApple();
            }
        },
        clearCanvas() {
            this.ctx.clearRect(0, 0, this.width, this.height);
        },
        drawBorder() {
            this.ctx.fillStyle = "Gainsboro";
            this.ctx.fillRect(0, 0, this.width, this.blockSize);
            this.ctx.fillRect(0, this.height - this.blockSize, this.width, this.blockSize);
            this.ctx.fillRect(0, 0, this.blockSize, this.height);
            this.ctx.fillRect(this.width - this.blockSize, 0, this.blockSize, this.height);
        },
        setDirection(event) {
            const newDirection = this.directions[event];
            if (newDirection !== undefined) {
                this.snake.setDirection(newDirection);
            }
        }
    }
});

class Block {
    constructor(col, row, ctx,blockSize) {
        this.col = col;
        this.row = row;
        this.ctx = ctx;
        this.blockSize=blockSize;
    }

    drawSquare(color) {
        const x = this.col * this.blockSize;
        const y = this.row * this.blockSize;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
    }

    drawCircle(color) {
        const centerX = this.col * this.blockSize + this.blockSize / 2;
        const centerY = this.row * this.blockSize + this.blockSize / 2;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.blockSize / 2, 0, Math.PI * 2, false);
        this.ctx.fill();
    }

    equal(otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    }
}

class Snake {
    constructor(widthInBlocks, heightInBlocks,blockSize,ctx) {
        this.ctx = ctx;
        this.blockSize=blockSize;
        this.segments = [new Block(7, 5,ctx,blockSize),
            new Block(6, 5,ctx,blockSize),
            new Block(5, 5,ctx,blockSize)];
        this.direction = "right";
        this.nextDirection = "right";
        this.widthInBlocks = widthInBlocks;
        this.heightInBlocks = heightInBlocks;
    }

    draw(head,body) {
        // console.log("snake",this.segments.length,this.segments[0]);
        this.segments[0].drawSquare(head);
        for (let i = 1; i < this.segments.length; i++) {
            this.segments[i].drawSquare(body);
        }
    }

    move() {
        const head = this.segments[0];
        let newHead;
        this.direction = this.nextDirection;
        if (this.direction === "right") {
            newHead = new Block(head.col + 1, head.row,head.ctx,this.blockSize);
        } else if (this.direction === "down") {
            newHead = new Block(head.col, head.row + 1,head.ctx,this.blockSize);
        } else if (this.direction === "left") {
            newHead = new Block(head.col - 1, head.row,head.ctx,this.blockSize);
        } else if (this.direction === "up") {
            newHead = new Block(head.col, head.row - 1,head.ctx,this.blockSize);
        }
        this.segments.unshift(newHead);

    }

    checkCollision() {
        var head = this.segments[0];
        const leftCollision = (head.col === 0);
        const topCollision = (head.row === 0);
        const rightCollision = (head.col === this.widthInBlocks - 1);
        const bottomCollision = (head.row === this.heightInBlocks - 1);
        const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
        let selfCollision = false;
        for (let i = 1; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    }

    setDirection(newDirection) {
        if (this.direction === "up" && newDirection === "down") {
            return;
        } else if (this.direction === "right" && newDirection === "left") {
            return;
        } else if (this.direction === "down" && newDirection === "up") {
            return;
        } else if (this.direction === "left" && newDirection === "right") {
            return;
        }
        this.nextDirection = newDirection;
    }
}

class Apple {
    constructor(widthInBlocks, heightInBlocks,blockSize, ctx) {
        this.widthInBlocks = widthInBlocks;
        this.heightInBlocks = heightInBlocks;
        this.blockSize=blockSize;
        this.ctx = ctx;
        this.position = null;
        this.move();
    }

    draw(color) {
        // console.log("apple",this.position)
        this.position.drawCircle(color);
    }

    move() {
        const randomCol = Math.floor(Math.random() * (this.widthInBlocks - 2)) + 1;
        const randomRow = Math.floor(Math.random() * (this.heightInBlocks - 2)) + 1;
        this.position = new Block(randomCol, randomRow, this.ctx,this.blockSize);
    }
}

app.mount("#app");