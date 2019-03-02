let input=`addi 4 16 4
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


input = input.toString().split('\n').map(e => e.trim())
const operationSet = {
    addr: (a, b, c, reg) => { reg[c] = reg[a] + reg[b]; },
    addi: (a, b, c, reg) => { reg[c] = reg[a] + b; },
    mulr: (a, b, c, reg) => { reg[c] = reg[a] * reg[b]; },
    muli: (a, b, c, reg) => { reg[c] = reg[a] * b; },
    banr: (a, b, c, reg) => { reg[c] = reg[a] & reg[b]; },
    bani: (a, b, c, reg) => { reg[c] = reg[a] & b; },
    borr: (a, b, c, reg) => { reg[c] = reg[a] | reg[b]; },
    bori: (a, b, c, reg) => { reg[c] = reg[a] | b; },
    setr: (a, b, c, reg) => { reg[c] = reg[a]; },
    seti: (a, b, c, reg) => { reg[c] = a; },
    gtri: (a, b, c, reg) => { reg[c] = reg[a] > b ? 1 : 0; },
    gtir: (a, b, c, reg) => { reg[c] = a > reg[b] ? 1 : 0; },
    gtrr: (a, b, c, reg) => { reg[c] = reg[a] > reg[b] ? 1 : 0; },
    eqir: (a, b, c, reg) => { reg[c] = a == reg[b] ? 1 : 0; },
    eqri: (a, b, c, reg) => { reg[c] = b == reg[a] ? 1 : 0; },
    eqrr: (a, b, c, reg) => { reg[c] = reg[a] == reg[b] ? 1 : 0; }
}

const regs = [0, 0, 0,0,0, 0]
const instructionReg = 4;

const instructions = input.map(e => ({
    instr: e.split(' ')[0],
    a: Number(e.split(' ')[1]),
    b: Number(e.split(' ')[2]),
    c: Number(e.split(' ')[3])
}))

const getDivisors = (num) => {
    let res = [];

    for (let i = 0; i < num; i++) {
        if (num % i === 0) res.push(i);
    }
    return res;
}

while (regs[instructionReg] >= 0 && regs[instructionReg] < input.length) {
    operationSet[instructions[regs[instructionReg]].instr](
        instructions[regs[instructionReg]].a, 
        instructions[regs[instructionReg]].b,
        instructions[regs[instructionReg]].c, regs);

    regs[instructionReg]++;
}

console.log(`Answer1: ${regs[0]}`);

