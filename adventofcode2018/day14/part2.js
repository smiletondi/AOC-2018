
let input=`990941`;


const part2=(input) => {
    const limit = Math.trunc(Number(input));
    const len = input.length;
    const mod = 10 ** len;  // ** est l'exponentiation (ES6)
    const recipes = [3, 7];
    const elves = [0, 1];
    let value = 37;
    while (true) {
        let a = recipes[elves[0]];
        let b = recipes[elves[1]];
        let sum = a + b;
        let toAdd = (sum < 10) ? [sum] : [1, sum - 10];
        for (let r of toAdd) {
            recipes.push(r);
            value = (value * 10 + r) % mod;
            if (value === limit) {
                return recipes.length - len;
            }
        }
        elves[0] = (elves[0] + 1 + a) % recipes.length;
        elves[1] = (elves[1] + 1 + b) % recipes.length;
    }
};
console.log(part2(input));
