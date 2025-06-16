function displayCandy(){
	let candy = ['jellybeans'];
	function addCandy(candyType) {
		candy.push(candyType)
	}
	addCandy('gumdrops');
}
displayCandy();
console.log(candy)

// 改写
// 方式1: 使用闭包
function displayCandy() {
    let candy = ['jellybeans'];
    
    function addCandy(candyType) {
        candy.push(candyType);
    }
    
    addCandy('gumdrops');
    return candy; // 返回 candy 数组
}
// 改写
// 方式2: 使用闭包和返回对象
function displayCandy() {
    let candy = ['jellybeans'];

    function addCandy(candyType) {
        candy.push(candyType);
    }

    return {
        addCandy: addCandy,
        getCandy: function() {
            return candy; // 返回 candy 数组
        }
    };
}
const display = displayCandy();
display.addCandy('gumdrops'); // 添加糖果
console.log(display.getCandy());
