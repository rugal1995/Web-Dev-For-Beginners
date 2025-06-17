// 在檔案 script.js 中
// 所有的引文內容
const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
    'ok'
];

let words = [];
let wordIndex = 0;
const quoteE = document.getElementById('quote');
const messageE = document.getElementById('message');
const typedValueE = document.getElementById('typed-value');

let startTime = Date.now();

// 开始游戏
document.getElementById('start').addEventListener('click', () => {
    // 随机选择一段文字
    const quoteIndex = Math.floor(Math.random() * (quotes.length - 1));
    const quote = quotes[7];
    words = quote.split(' ');

    const spanWords = words.map((word) => {
        return `<span>${word} </span>`
    });
    quoteE.innerHTML = spanWords.join('');

    // 设置第一个字符高亮
    quoteE.childNodes[0].className = 'highlight';

    // 清除内容，初始
    messageE.innerText = '';
    typedValueE.value = '';
    typedValueE.focus();
    wordIndex = 0;

    startTime = new Date().getTime();
    console.log(startTime)

})

// 打字逻辑
document.getElementById('typed-value').addEventListener('input', () => {
    // 获取打字内容
    const typedvalue = typedValueE.value;
    // 当前单词
    const curWord = words[wordIndex];

    if (typedvalue === curWord && wordIndex === words.length - 1) {
        let endTime = new Date().getTime();
            console.log(startTime)

            console.log(endTime)

        const seconds = (endTime - startTime) / 1000;
        const msg = `恭喜你,输入正确,用时:${seconds}秒`;
        messageE.innerText = msg;
    } else if (typedvalue.endsWith(' ') && typedvalue.trim() === curWord) {
        // 到下个单词
        wordIndex++;
        quoteE.childNodes.forEach((node, idx) => {
            node.className = '';
            if (idx === wordIndex) {
                node.className = 'highlight';
            }
        });
        typedValueE.value = '';
    } else if (curWord.startsWith(typedvalue)) {
        // 输入正确
        typedValueE.className = '';
        messageE.innerText = '';
    } else {
        // 输入错误
        typedValueE.className = 'error'
        messageE.innerText = `输入错误，重新输入单词${curWord}`;
    }

})
