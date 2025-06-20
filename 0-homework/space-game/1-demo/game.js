// 基础游戏对象
const gameObject = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    type: "",
    color: "gray",
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// 可移动对象混入
const movable = {
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    },
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
};

// 组合创建英雄
function createHero(x, y) {
    return {
        ...gameObject,
        ...movable,
        x,
        y,
        width: 40,
        height: 60,
        type: 'Hero',
        color: 'blue'
    };
}

// 创建静态物体
function createStatic(x, y, type, color = 'green') {
    return {
        ...gameObject,
        x,
        y,
        type,
        color
    };
}

// 游戏渲染器
class GameRenderer {
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];
    }

    addObject(obj) {
        this.gameObjects.push(obj);
    }

    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 渲染所有对象
        this.gameObjects.forEach(obj => {
            if (obj.render) {
                obj.render(this.ctx);
            }
        });
    }

    start() {
        const gameLoop = () => {
            this.render();
            // 关键点：requestAnimationFrame 实现平滑动画
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// 事件发射器类
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

    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(l => l(message, payload));
        }
    }
}

// 消息类型
const Messages = {
    HERO_MOVE_LEFT: 'HERO_MOVE_LEFT',
    HERO_MOVE_RIGHT: 'HERO_MOVE_RIGHT',
    HERO_MOVE_UP: 'HERO_MOVE_UP',
    HERO_MOVE_DOWN: 'HERO_MOVE_DOWN'
};

// 初始化游戏
function initGame() {
    const renderer = new GameRenderer('gameCanvas');
    const eventEmitter = new EventEmitter();

    // 创建游戏对象
    const hero = createHero(100, 100);
    const tree = createStatic(200, 150, 'Tree', 'green');
    const rock = createStatic(300, 300, 'Rock', 'gray');

    // 添加到渲染器
    renderer.addObject(tree);
    renderer.addObject(rock);
    renderer.addObject(hero);

    // 设置事件监听
    eventEmitter.on(Messages.HERO_MOVE_LEFT, () => hero.move(-5, 0));
    eventEmitter.on(Messages.HERO_MOVE_RIGHT, () => hero.move(5, 0));
    eventEmitter.on(Messages.HERO_MOVE_UP, () => hero.move(0, -5));
    eventEmitter.on(Messages.HERO_MOVE_DOWN, () => hero.move(0, 5));

    // 键盘控制
    window.addEventListener('keydown', (evt) => {
        switch(evt.key) {
            case 'ArrowLeft':
                eventEmitter.emit(Messages.HERO_MOVE_LEFT);
                break;
            case 'ArrowRight':
                eventEmitter.emit(Messages.HERO_MOVE_RIGHT);
                break;
            case 'ArrowUp':
                eventEmitter.emit(Messages.HERO_MOVE_UP);
                break;
            case 'ArrowDown':
                eventEmitter.emit(Messages.HERO_MOVE_DOWN);
                break;
        }
    });

    // 开始游戏循环
    renderer.start();
}
// 页面加载后初始化游戏
window.onload = initGame;
