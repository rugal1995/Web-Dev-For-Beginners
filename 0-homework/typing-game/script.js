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
    'ok f12'
];
// 单词列表，目前需要输入的索引
let words = [];
let wordIndex = 0;
// 开始时间
let startTime = Date.now();
// 元素
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
typedValueElement.conte

// 点击开始
document.getElementById('start').addEventListener('click', () => {
    console.log('开始游戏');
    // 获取一段引文
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[7];
    // 将引文分割成单词
    words = quote.split(' ');
    // 重置索引
    wordIndex = 0;

    // 更新使用者界面
    // 简历span元素，是定class
    const spanWords = words.map(function (word) {
        return `<span>${word} </span>`;
    })
    console.log(spanWords);
    // 将span元素连接成字符串
    quoteElement.innerHTML = spanWords.join('');
    // 标记第一个单词
    quoteElement.childNodes[0].className = 'highlight';
    // 清空消息框
    messageElement.innerText = '';

    // 设置文字框
    // 清除文字框
    typedValueElement.value = '';
    // 设置焦点
    typedValueElement.focus();

    // 记录开始时间
    startTime = new Date().getTime();
    console.log(startTime);
})

// 打字逻辑
typedValueElement.addEventListener('input', () => {
    // 获取目前的单词
    const currentWord = words[wordIndex];
    // 获取目前输入的数值
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        console.log('结束')
        // 游戏结束，显示成功
        let endTime = new Date().getTime();
        console.log(startTime);
        console.log(endTime);
        const seconds = (endTime - startTime) / 1000;
        messageElement.innerText = `1恭喜你，输入正确！用时 ${seconds} 秒。`;
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        console.log('尾巴')
        // 单词末尾，清除输入的值
        typedValueElement.value = '';
        // 移动到下个单词
        wordIndex++;
        // 清除高亮,标记新单词
        quoteElement.childNodes.forEach((span, index) => {
            span.className = '';
            if (index === wordIndex) {
                span.className = 'highlight';
            }
        });
    } else if (currentWord.startsWith(typedValue)) {
        // 输入正确
        typedValueElement.className = '';
        // 清除错误消息
        messageElement.innerText = '';
    } else {
        // 输入错误
        typedValueElement.className = 'error';
        // 显示错误消息
        messageElement.innerText = `输入错误，请重新输入单词 "${currentWord}"。`;
    }
})