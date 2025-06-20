// 组合方式
const gameObject = {
    x: 0,
    y: 0,
    type: ""
};

const movable = {
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

// 组合 gameObject,movable
const moveableObject = {...gameObject, ...movable};

// 创建英雄
function createHero(x, y) {
    return {
        ...moveableObject,
        x,
        y,
        type: 'Hero'
    }
}

// 创建常驻物体
function createStatic(x, y, type) {
    return {
        ...gameObject,
        x, y, type,

    }
}



class EvenEmitter {
    constructor() {
        this.listeners = {};
    }
    // 接受消息
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    // 当消息发出是，附上负载发给监听者
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach(l => {
                l(message, payload);
            })
        }
    }
}

//設定訊息種類
const Messages = {
    HERO_MOVE_LEFT: 'HERO_MOVE_LEFT'
};
//調用你設定的 eventEmitter
const eventEmitter = new EventEmitter();
//設定英雄
const hero = createHero(100, 100);
const tree = createStatic(50, 50, 'Tree');
//讓 eventEmitter 監聽有關英雄往左移的訊息，並執行動作
eventEmitter.on(Messages.HERO_MOVE_LEFT, () => {
    hero.move(5, 0);
});

//設定遊戲視窗來監聽鍵盤事件，當左方向鍵按壓時，發出英雄往左移的訊息
window.addEventListener('keyup', (evt) => {
    if (evt.key === 'ArrowLeft') {
        eventEmitter.emit(Messages.HERO_MOVE_LEFT)
    }
});

























