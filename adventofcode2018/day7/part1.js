let input=`Step P must be finished before step R can begin.
Step V must be finished before step J can begin.
Step O must be finished before step K can begin.
Step S must be finished before step W can begin.
Step H must be finished before step E can begin.
Step K must be finished before step Y can begin.
Step B must be finished before step Z can begin.
Step N must be finished before step G can begin.
Step W must be finished before step I can begin.
Step L must be finished before step Y can begin.
Step U must be finished before step Q can begin.
Step R must be finished before step Z can begin.
Step Z must be finished before step E can begin.
Step C must be finished before step I can begin.
Step I must be finished before step Q can begin.
Step D must be finished before step E can begin.
Step A must be finished before step J can begin.
Step G must be finished before step Y can begin.
Step M must be finished before step T can begin.
Step E must be finished before step X can begin.
Step F must be finished before step T can begin.
Step X must be finished before step J can begin.
Step Y must be finished before step J can begin.
Step T must be finished before step Q can begin.
Step J must be finished before step Q can begin.
Step E must be finished before step Y can begin.
Step A must be finished before step T can begin.
Step P must be finished before step H can begin.
Step W must be finished before step R can begin.
Step Y must be finished before step Q can begin.
Step W must be finished before step M can begin.
Step O must be finished before step M can begin.
Step H must be finished before step R can begin.
Step N must be finished before step L can begin.
Step V must be finished before step W can begin.
Step S must be finished before step Q can begin.
Step D must be finished before step J can begin.
Step W must be finished before step E can begin.
Step V must be finished before step Y can begin.
Step O must be finished before step C can begin.
Step B must be finished before step T can begin.
Step W must be finished before step T can begin.
Step G must be finished before step T can begin.
Step D must be finished before step T can begin.
Step P must be finished before step E can begin.
Step P must be finished before step J can begin.
Step G must be finished before step E can begin.
Step Z must be finished before step M can begin.
Step K must be finished before step T can begin.
Step H must be finished before step U can begin.
Step P must be finished before step T can begin.
Step W must be finished before step A can begin.
Step A must be finished before step F can begin.
Step F must be finished before step Y can begin.
Step H must be finished before step M can begin.
Step T must be finished before step J can begin.
Step O must be finished before step S can begin.
Step P must be finished before step M can begin.
Step X must be finished before step T can begin.
Step S must be finished before step J can begin.
Step H must be finished before step C can begin.
Step B must be finished before step W can begin.
Step K must be finished before step N can begin.
Step E must be finished before step T can begin.
Step S must be finished before step Y can begin.
Step C must be finished before step G can begin.
Step R must be finished before step D can begin.
Step N must be finished before step U can begin.
Step O must be finished before step L can begin.
Step B must be finished before step F can begin.
Step S must be finished before step F can begin.
Step X must be finished before step Y can begin.
Step S must be finished before step D can begin.
Step R must be finished before step E can begin.
Step S must be finished before step A can begin.
Step S must be finished before step X can begin.
Step A must be finished before step G can begin.
Step E must be finished before step F can begin.
Step P must be finished before step A can begin.
Step A must be finished before step M can begin.
Step E must be finished before step Q can begin.
Step H must be finished before step W can begin.
Step W must be finished before step U can begin.
Step F must be finished before step Q can begin.
Step I must be finished before step J can begin.
Step H must be finished before step G can begin.
Step I must be finished before step G can begin.
Step P must be finished before step X can begin.
Step I must be finished before step D can begin.
Step R must be finished before step X can begin.
Step S must be finished before step I can begin.
Step Y must be finished before step T can begin.
Step R must be finished before step G can begin.
Step I must be finished before step X can begin.
Step B must be finished before step D can begin.
Step X must be finished before step Q can begin.
Step F must be finished before step X can begin.
Step V must be finished before step R can begin.
Step C must be finished before step J can begin.
Step L must be finished before step Q can begin.
Step K must be finished before step B can begin`;


const sum = (input) => {
  const relationships = input
    .split('\n')
    .map((instruction) => {
      const parts = instruction.match(/(\w) must .* step (\w)/);

      return {
        from: parts[1].charCodeAt(0),
        to: parts[2].charCodeAt(0),
      };
    });

  // optionally, visualize directed graph
  // toGraphviz(relationships);

  const nodes = [...new Set([
    ...relationships.map(({ from }) => from),
    ...relationships.map(({ to }) => to)
  ])].map((value) => ({
    parents: [],
    value,
  }));

  relationships.forEach(({ from, to }) => {
    nodes.find(({ value}) => value === to).parents.push(from);
  });

  const sequence = [];

  while (nodes.length) {
    const candidates = nodes
      .filter(({ parents }) => !parents.length)
      .sort((a, b) => a.value - b.value);

    if (!candidates.length) {
      break;
    }

    const { value } = candidates[0];

    sequence.push(value);
    nodes
      .filter(({ parents }) => parents.includes(value))
      .forEach((node) => node.parents = node.parents
        .filter((x) => x !== value));

    nodes.splice(nodes.findIndex((x) => x.value === value), 1);
  }

  return sequence
    .map((value) => String.fromCharCode(value))
    .join('');
};

console.log(sum(input));