let data=`#ip 4
addi 4 16 4
seti 1 3 5
seti 1 1 3
mulr 5 3 1
eqrr 1 2 1
addr 1 4 4
addi 4 1 4
addr 5 0 0
addi 3 1 3
gtrr 3 2 1
addr 4 1 4
seti 2 8 4
addi 5 1 5
gtrr 5 2 1
addr 1 4 4
seti 1 3 4
mulr 4 4 4
addi 2 2 2
mulr 2 2 2
mulr 4 2 2
muli 2 11 2
addi 1 6 1
mulr 1 4 1
addi 1 18 1
addr 2 1 2
addr 4 0 4
seti 0 3 4
setr 4 5 1
mulr 1 4 1
addr 4 1 1
mulr 4 1 1
muli 1 14 1
mulr 1 4 1
addr 2 1 2
seti 0 1 0
seti 0 4 4`;


let ops = {
    addr: (reg, a, b) => reg[a] + reg[b],
    addi: (reg, a, b) => reg[a] + b,
    mulr: (reg, a, b) => reg[a] * reg[b],
    muli: (reg, a, b) => reg[a] * b,
    banr: (reg, a, b) => reg[a] & reg[b],
    bani: (reg, a, b) => reg[a] & b,
    borr: (reg, a, b) => reg[a] | reg[b],
    bori: (reg, a, b) => reg[a] | b,
    setr: (reg, a, b) => reg[a],
    seti: (reg, a, b) => a,
    gtir: (reg, a, b) => a > reg[b] ? 1 : 0,
    gtri: (reg, a, b) => reg[a] > b ? 1 : 0,
    gtrr: (reg, a, b) => reg[a] >  reg[b] ? 1 : 0,
    eqir: (reg, a, b) => a === reg[b] ? 1 : 0,
    eqri: (reg, a ,b) => reg[a] === b ? 1 : 0,
    eqrr: (reg, a, b) => reg[a] === reg[b] ? 1 : 0
}
let lines = data.split('\n');
    let ipLine = lines.shift();
    let ip = +(ipLine.split(' ')[1]);

    let instructions = [];
    for(let line of lines) {
        instructions.push(line.split(' ').map(x => {
            if(isNaN(+x)) {
                return x;
            }
            return +x;
        }));
    }

    let registers = [1, 0, 0, 0, 0, 0];

    //The input program will not finish for a very long time, so we'll have to shortcut
    //First, let the program finish its "initialization" logic, which is done
    //once it's about to execute instruction 1
    while(registers[ip] !== 1)
    {
        let current = instructions[registers[ip]];

        let result = ops[current[0]](registers, current[1], current[2]);

        registers[current[3]] = result;

        registers[ip]++;
    }

    //Now the program has put a large number in some register.
    //It proceeds to very inefficiently calculate the sum of that number's factors
    //we're going to do so more efficiently
    let target = Math.max(...registers);
    let sqrt = Math.sqrt(target);
    let sum = 0;

    for(let i = 1; i < sqrt; i++) {
        if(target % i === 0) {
            sum += i + target / i;
        }
    }

    if(sqrt === Math.floor(sqrt)) {
        sum += sqrt;
    }

console.log(sum);