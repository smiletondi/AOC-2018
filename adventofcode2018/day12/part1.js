let input=`initial state: ##..#..##....#..#..#..##.#.###.######..#..###.#.#..##.###.#.##..###..#.#..#.##.##..###.#.#...#.##..

##### => #
##.## => #
..##. => .
..#.# => .
..### => #
#..## => #
.#.#. => #
#.#.# => #
#.##. => .
####. => .
#..#. => #
..#.. => .
.#### => .
##.#. => #
#...# => .
.##.# => #
#.### => .
.#..# => #
.#... => #
.##.. => #
.###. => .
#.... => .
###.. => .
##..# => .
...## => #
##... => .
..... => .
....# => .
###.# => #
#.#.. => .
.#.## => #
...#. => .`;
let lines = input.split('\n')

	let plants = [...lines[0].substring(15)].map(c => c === '#')

	for (var i = 0; i < 50; i++) {
		plants.splice(0, 0, false)
		plants.push(false)
	}

	let rules = []

	lines.forEach((l, i) => {
		if (i < 2) return

		let params = l.split(' => ')
		rules.push({
			l: [...params[0]].map(c => c === '#'),
			r: params[1] === '#'
		})
	})

	for (let gen = 1; gen <= 20; gen++) {
		let newPlants = []
		plants.forEach((p, i) => {
			let before = []
			for (let j = i - 2; j <= i + 2; j++) {
				if (j < 0 || j >= plants.length) before.push(false)
				else before.push(plants[j])
			}

			for (let rule of rules) {
				// check if rule === before
				if (
					rule.l.reduce((a, c, i) => {
						return a && c === before[i]
					}, true)
				) {
					newPlants.push(rule.r)
				}
			}
		})
		plants = newPlants
	}
console.log(plants.reduce((a, c, i) => a + (c ? i - 50 : 0), 0))