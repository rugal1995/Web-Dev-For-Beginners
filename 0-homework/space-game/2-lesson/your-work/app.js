// 游戏基本类
class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dead = false;
        this.type = '';
        this.width = 0;
        this.height = 0;
        this.img = undefined;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    rectFromGameObject() {
        return {
            top: this.y,
            left: this.x,
            bottom: this.y + this.height,
            right: this.x + this.width,
        }
    }
}

// 英雄
class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.type = 'Hero';
        this.speed = 1;
        this.width = 98;
        this.height = 50;
        this.cooldown = 0;
    }

    canFire() {
        return this.cooldown === 0;
    }

    fire() {
        // 创建激光
        gameObjects.push(new Laser(this.x + 45, this.y - 10));
        this.cooldown = 200;
        let id = setInterval(() => {
            if (this.cooldown > 0) {
                this.cooldown -= 100;
            } else {
                clearInterval(id);
            }
        }, 200);
    }

}

// 敌人
class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.type = 'Enemy';
        this.width = 98;
        this.height = 50;
        this.dead = false;
        // 定期移动
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5;
            } else {
                console.log("stop it", this.y);
                clearInterval(id);
            }
        }, 200);
    }
}

// 激光
class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 9;
        this.height = 33;
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15;
            } else {
                this.dead = true;
                clearInterval(id);
            }
        }, 100)
    }
}

// 发布订阅，监听消息
class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }

    emit(message, listener) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(l => l(message, listener));
        }
    }
}

function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = path
        img.onload = () => {
            resolve(img)
        }
    })
}

// 消息订阅
const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    //
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER", // 敌人碰撞激光
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO", // 敌人英雄碰撞
}

let heroImg,
    enemyImg,
    laserImg,
    canvas,
    ctx,
    gameObjects = [],
    hero,
    eventEmitter = new EventEmitter();

// ------------------事件--------------------------
function onKeyDown(e) {
    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40: // 方向鍵
        case 32:
            e.preventDefault();
            break; // 空白鍵
        default:
            break; // 不阻止其他按鍵
    }
}

window.addEventListener('keydown', onKeyDown);

// 移动英雄
window.addEventListener('keyup', (e) => {
    if (e.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (e.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (e.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (e.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (e.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});
window.addEventListener('keydown', (e) => {
    console.log("press");
    if (e.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (e.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (e.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (e.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (e.keyCode === 32) {
        eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});

// 创建敌人
function createEnemies() {
    // TODO draw enemies
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;
    for (let i = START_X; i < STOP_X; i += 98) {
        for (let j = 0; j < 50 * 5; j += 50) {
            const enemy = new Enemy(i, j);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

// 创建英雄
function createHero() {
    hero = new Hero(canvas.width / 2 - 45, canvas.height - canvas.height / 4);
    hero.img = heroImg;
    console.log(hero);
    gameObjects.push(hero);
}

// 初始化游戏
function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();

    // 加载英雄移动指令
    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -= 15;
    })
    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 15;
    })
    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 15;
    })
    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 15;
    })
    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    })
    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, {first, second}) => {
        first.dead = true;
        second.dead = true;
    });
    eventEmitter.on(Messages.COLLISION_ENEMY_HERO, (_, {enemy}) => {
        enemy.dead = true;
        // todo 英雄扣血
    })
}

function drawGameObjects(ctx) {
    gameObjects.forEach(e => {
        e.draw(ctx);
    })
}

// 碰撞方式
function intersectRect(r1, r2) {
    return !(r2.left > r1.right ||
        r2.bottom < r1.top ||
        r2.top > r1.bottom ||
        r2.right < r1.left
    );
}

window.onload = async () => {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    // TODO load textures
    heroImg = await loadTexture('/assets/player.png');
    enemyImg = await loadTexture('/assets/enemyShip.png');
    laserImg = await loadTexture('/assets/laserRed.png');

    initGame();
    start();
}

function start() {
    const gameLoop = (() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateGameObjects();
        drawGameObjects(ctx);
        requestAnimationFrame(gameLoop);

    });
    gameLoop();
}


function updateGameObjects() {
    const enemies = gameObjects.filter(x => x.type === 'Enemy');
    const lasers = gameObjects.filter(x => x.type === 'Laser');

    enemies.forEach(e => {
        console.log(e.rectFromGameObject(), hero.rectFromGameObject());
        if (intersectRect(e.rectFromGameObject(), hero.rectFromGameObject())) {
            eventEmitter.emit(Messages.COLLISION_ENEMY_HERO, {e});
        }
    })

    for (let enemy of enemies) {
        for (let laser of lasers) {
            if (intersectRect(enemy.rectFromGameObject(), laser.rectFromGameObject())) {
                console.log("敌人，激光")
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, ({
                    first: enemy,
                    second: laser,
                }));
            }
        }
    }
    gameObjects = gameObjects.filter(x => !x.dead);
}






