function onlyUnique(value, index, self) { 
	return self.indexOf(value) === index;
}

const INF = 99999999;
let rawInput = `################################
#########...####################
#########...###########.########
#########G..##########....######
##########..###########...######
#########G...##########...######
#########..G.###########..######
########...#.##########..#######
#######G#..###E######....#######
#######G.....#.######....#######
######...G......##E......#######
####...##.#..G..G.........######
###..........G#####.......####.#
####........G#######...........#
####..G.....#########......#...#
###.........#########........###
##.....G.G..#########......#####
#...G.......#########.........##
#.G.........#########.E.##...###
##.....G.....#######....G#.E...#
##............#####...E.......##
#.G...........E.......#E...##.##
#....G........###########.....##
#......##...#.##################
#.#.........E..##.##############
#.#.......G.......##############
#.###........E....##############
#.####.....###....##############
#.#####......E..################
#######..........###############
#########..####.################
################################`;

// part 1: 184206, part 2: 41804 (with AP = 27)

let LOG = true;

// rawInput = `#######
// #.G...#
// #...EG#
// #.#.#G#
// #..G#E#
// #.....#
// #######` // 27730

// rawInput = `#######   
// #G..#E#
// #E#E.E#
// #G.##.#
// #...#E#
// #...E.#
// #######`; // should be 36334

// rawInput = `#########
// #G..G..G#
// #.......#
// #.......#
// #G..E..G#
// #.......#
// #.......#
// #G..G..G#
// #########`;

// returns the score, or -1 is elves die and the flag is set
let simulate = (AP, stopIfElvesDie) => {
	let input = rawInput.split('\n').map(l=>l.split(''));
	let units = {};

	for (let i = 0; i < input.length; ++i) {
		for (let j = 0; j < input[i].length; ++j) {
			if (input[i][j] == 'E' || input[i][j] == 'G') {
				units[i * 1000 + j] = {
					type: input[i][j],
					x: j,
					y: i,
					hp: 200,
					ap: input[i][j] == 'E' ? AP : 3
				};
			}
		}
	}

	let targetsOf = t => {
		let unitsArr = [];
		for (let u in units) {
			unitsArr.push(units[u]);
		}
		return unitsArr.filter(u=>u.type != t);
	}

	let fieldsInRangeFor = (tar, sourceUnit) => {
		let possibleSquares = [];
		for (let u of tar) {
			possibleSquares.push({x: u.x, y: u.y + 1});
			possibleSquares.push({x: u.x, y: u.y - 1});
			possibleSquares.push({x: u.x + 1, y: u.y});
			possibleSquares.push({x: u.x - 1, y: u.y});
		}
		possibleSquares = possibleSquares.filter(p => p.x >= 0 && p.y >= 0 && p.y < input.length && p.x < input[0].length);
		possibleSquares = possibleSquares.filter(p => input[p.y][p.x] == '.' || (p.x == sourceUnit.x && p.y == sourceUnit.y));
		return possibleSquares;
	}

	let dij = (src, tar, onlyScore) => {
		let source = src.y * 1000 + src.x;
		let target = tar.y * 1000 + tar.x;
		let Q = [];
		let dist = {};
		let prev = {};
		for (let i = 0; i < input.length; ++i) {
			o: for (let j = 0; j < input[i].length; ++j) {
				if (input[i][j] != '.') {
					if (i * 1000 + j != source && i * 1000 + j != target)
						continue;
				}
				let p = i * 1000 + j;
				Q.push(p);
				dist[p] = INF;
				prev[p] = {};
			}
		}
		dist[source] = 0;
		while (Q.length > 0) {
			let minDist = INF;
			let ui = -1;
			for (let i = 0; i < Q.length; ++i) {
				if (dist[Q[i]] < minDist) {
					minDist = dist[Q[i]];
					ui = i;
				}
			}
			let u = Q[ui];
			Q.splice(ui, 1);
			if (u == target) break;
			for (let v of Q) {
				if (v + 1 == u || v - 1 == u || v + 1000 == u || v - 1000 == u) {
					let alt = dist[u] + 1;
					if (alt < dist[v]) {
						dist[v] = alt;
						if (!onlyScore) {
							prev[v] = {};
							prev[v][u] = 1;
						}
					} else if (!onlyScore && alt == dist[v]) {
						prev[v][u] = 1;
					}
				}
			}
		}
		let resMoves = [];
		if (!onlyScore) {
			let done = {};
			let search = (pos) => {
				if (done[pos]) return;
				if (pos == source) {
					done[pos] = 1;
				} else if (prev[pos][source]) {
					done[pos] = 1;
					resMoves.push(pos);
				} else {
					for (let p in prev[pos]) {
						search(p);
					}
					done[pos] = 1;
				}
			};
			search(target);
		}
		return { d: dist[target], m: resMoves };
	}

	let stepsToSquare = (src, tar) => {
		return dij(src, tar, true).d;
	}

	let pathsToTarget = (src, tar) => {
		return dij(src, tar, false).m;
	}

	function sortNumber(a,b) {
		return a - b;
	}

	let printFinalStatus = () => {
		if (!LOG) return;
		let s = '';
		for (let i = 0; i < input.length; ++i) {
			for (let j = 0; j < input[i].length; ++j) {
				s += input[i][j];
			}
			s += '\n';
		}
		console.log('Round ' + roundCount + ':\n' + s);
		for (let u in units) {
			console.log(u, units[u].hp);
		}
		console.log('\n\n');
	}

	let roundCount = 0;
	outer: while (true) {
		//if (LOG) console.log(roundCount);
		// reference into units obj
		let unitsToMove = [];
		for (let u in units) {
			unitsToMove.push(parseInt(u));
		}
		unitsToMove = unitsToMove.sort(sortNumber);
		for (let ui of unitsToMove) {
			//console.log(ui);
			let unit = units[ui];
			if (!unit) continue; // unit died
			//console.log('\n\n' + ui);
			let tar = targetsOf(unit.type);
			if (tar.length == 0) {
				break outer;
			}
			let fieldsInRange = fieldsInRangeFor(tar, unit);
			let needsToMove = true;
			for (let f of fieldsInRange) {
				if (f.x == unit.x && f.y == unit.y) {
					needsToMove = false;
					//console.log(f);
					break;
				}
			}
			if (needsToMove) {
				let minDist = INF;
				let possibleTargetFields = [];
				let paths = {};
				for (let i = 0; i < fieldsInRange.length; ++i) {
					let d = stepsToSquare(unit, fieldsInRange[i]);
					if (d < minDist) {
						minDist = d;
						possibleTargetFields = [];
					}
					if (minDist == d) {
						possibleTargetFields.push(fieldsInRange[i]);
					}
				}
				//console.log(ui, possibleTargetFields)
				if (possibleTargetFields.length > 0) {
					let moveI = possibleTargetFields.map(o => o.y * 1000 + o.x).sort(sortNumber)[0];
					let targetField = { x: moveI % 1000, y: Math.floor(moveI / 1000) };
					let paths = pathsToTarget(unit, targetField);
					//console.log(paths + ' torwards ' + moveI);
					if (paths.length > 0) {
						let moveI2 = paths.sort(sortNumber)[0];
						let move = { x: moveI2 % 1000, y: Math.floor(moveI2 / 1000) };
						//console.log(unit.x + ',' + unit.y + ' -> ' + move.x + ',' + move.y);
						delete units[unit.y * 1000 + unit.x];
						input[unit.y][unit.x] = '.';
						unit.x = move.x;
						unit.y = move.y;
						units[unit.y * 1000 + unit.x] = unit;
						input[unit.y][unit.x] = unit.type;
					}
				}
			}
			// now attack
			let possibleSquares = [];
			possibleSquares.push({x: unit.x, y: unit.y + 1});
			possibleSquares.push({x: unit.x, y: unit.y - 1});
			possibleSquares.push({x: unit.x + 1, y: unit.y});
			possibleSquares.push({x: unit.x - 1, y: unit.y});
			possibleSquares = possibleSquares.filter(p => p.x >= 0 && p.y >= 0 && p.y < input.length && p.x < input[0].length);
			possibleSquares = possibleSquares.filter(p => input[p.y][p.x] == (unit.type == 'E' ? 'G' : 'E'));
			if (possibleSquares.length != 0) {
				let targets = possibleSquares.map(p => units[p.y * 1000 + p.x]);
				let targetsWithMinHP = [];
				let minHP = INF;
				//console.log(possibleSquares, input, units);
				for (let t of targets) {
					if (t.hp < minHP) {
						minHP = t.hp;
						targetsWithMinHP = [];
					}
					if (t.hp == minHP) {
						targetsWithMinHP.push(t);
					}
				}
				let target = null;
				let minReadingOrder = INF;
				for (let t of targetsWithMinHP) {
					if (t.y * 1000 + t.x < minReadingOrder) {
						minReadingOrder = t.y * 1000 + t.x;
						target = t;
					}
				}
				target.hp -= unit.ap;
				if (target.hp <= 0) {
					//console.log('DELETING')
					if (target.type == 'E') {
						// ELF DIED
						if (stopIfElvesDie) return -1;
					}
					delete units[target.y * 1000 + target.x];
					input[target.y][target.x] = '.';
				}
			}
		}
		++roundCount;
		//printFinalStatus();
	}

	if (LOG) console.log("GAME OVER!!!!! AP = " + AP);
	printFinalStatus();
	let totalHealth = 0;
	for (let u in units) {
		totalHealth += units[u].hp;
	}
	//console.log(roundCount * totalHealth);
	return roundCount * totalHealth;
}

//console.log(simulate(3, false));
console.log("done");

for (let AP = 13; AP < 1000; AP++) {
let score = simulate(AP, true);
if (score != -1) {
  console.log(score);
	break;
}
console.log("Elves are note stronger enough with AP= "+AP);
}