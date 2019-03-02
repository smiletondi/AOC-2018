let data=`Immune System:
916 units each with 3041 hit points (weak to cold, fire) with an attack that does 29 fire damage at initiative 13
1959 units each with 7875 hit points (weak to cold; immune to slashing, bludgeoning) with an attack that does 38 radiation damage at initiative 20
8933 units each with 5687 hit points with an attack that does 6 slashing damage at initiative 15
938 units each with 8548 hit points with an attack that does 89 radiation damage at initiative 4
1945 units each with 3360 hit points (immune to cold; weak to radiation) with an attack that does 16 cold damage at initiative 1
2211 units each with 7794 hit points (weak to slashing) with an attack that does 30 fire damage at initiative 12
24 units each with 3693 hit points with an attack that does 1502 fire damage at initiative 5
2004 units each with 4141 hit points (immune to radiation) with an attack that does 18 slashing damage at initiative 19
3862 units each with 3735 hit points (immune to bludgeoning, fire) with an attack that does 9 fire damage at initiative 10
8831 units each with 3762 hit points (weak to radiation) with an attack that does 3 fire damage at initiative 7

Infection:
578 units each with 55836 hit points with an attack that does 154 radiation damage at initiative 9
476 units each with 55907 hit points (weak to fire) with an attack that does 208 cold damage at initiative 18
496 units each with 33203 hit points (weak to fire, radiation; immune to cold, bludgeoning) with an attack that does 116 slashing damage at initiative 14
683 units each with 12889 hit points (weak to fire) with an attack that does 35 bludgeoning damage at initiative 11
1093 units each with 29789 hit points (immune to cold, fire) with an attack that does 51 radiation damage at initiative 17
2448 units each with 40566 hit points (immune to bludgeoning, fire; weak to cold) with an attack that does 25 slashing damage at initiative 16
1229 units each with 6831 hit points (weak to fire, cold; immune to slashing) with an attack that does 8 bludgeoning damage at initiative 8
3680 units each with 34240 hit points (immune to bludgeoning; weak to fire, cold) with an attack that does 17 radiation damage at initiative 3
4523 units each with 9788 hit points (immune to bludgeoning, fire, slashing) with an attack that does 3 bludgeoning damage at initiative 6
587 units each with 49714 hit points (weak to bludgeoning) with an attack that does 161 fire damage at initiative 2`;




function effectivePower(unit){
    return unit.count * unit.attackDamage;
}

function getDamage(attacker, defender) {
    let damage = effectivePower(attacker);

    if(defender.weak.indexOf(attacker.attackType) >= 0) {
        damage *= 2;
    }

    if(defender.immune.indexOf(attacker.attackType) >= 0) {
        damage = 0;
    }

    return damage;
}

let lines = data.split('\n');
    let currentTeam = 'Immune';
    let rawUnits = [];
    for(let line of lines) {
        let parsed = /(\d+) units each with (\d+) hit points (\([^)]*\) )?with an attack that does (\d+) ([a-z]+) damage at initiative (\d+)/.exec(line);

        if(parsed) {
            let count = +parsed[1];
            let hp = +parsed[2];
            let attackDamage = +parsed[4];
            let attackType = parsed[5];
            let initiative = +parsed[6];
            let immune = [];
            let weak = [];

            if(parsed[3]) {
                let sub = parsed[3].substring(1, parsed[3].length - 2);
                for(let part of sub.split(';')) {
                    part = part.trim();
                    let parts = part.split(/,? /);
                    if(parts[0] === 'immune') {
                        immune = parts.slice(2);
                    }
                    else if(parts[0] === 'weak') {
                        weak = parts.slice(2);
                    }
                }
            }

            rawUnits.push({
                count,
                hp,
                attackDamage,
                attackType,
                initiative,
                immune,
                weak,
                team: currentTeam
            })
        }
        else if(line === 'Infection:') {
            currentTeam = 'Infection';
        }
    }
    
    let minBoost = 0;
    let maxBoost = 10000;
    let skipCount = 0;

    let units;

    while(minBoost < maxBoost) {
        let currentBoost = Math.floor((maxBoost + minBoost) / 2) + skipCount;
        units = [];
        for(let unit of rawUnits) {
            units.push({
                count: unit.count,
                hp: unit.hp,
                attackDamage: unit.attackDamage,
                attackType: unit.attackType,
                initiative: unit.initiative,
                immune: unit.immune,
                weak: unit.weak,
                team: unit.team
            })
        }
        for(let unit of units) {
            if(unit.team === 'Immune') {
                unit.attackDamage += currentBoost;
            }
        }

        let elapsed = 0;

        while(true) {
            elapsed++;
            units = units.sort((a, b) => {
                let effectiveA = effectivePower(a);
                let effectiveB = effectivePower(b);
                if(effectiveA === effectiveB) {
                    return b.initiative - a.initiative;
                }
                return effectiveB - effectiveA;
            });
            claimedTargets = [];

            for(let unit of units) {
                unit.target = null;

                for(let target of units) {
                    if(unit.team !== target.team && claimedTargets.indexOf(target) === -1) {
                        let bestDamage = 0;
                        if(unit.target) {
                            bestDamage = getDamage(unit, unit.target);
                        }
                        let targetDamage = getDamage(unit, target);

                        if(targetDamage > 0) {
                            if(targetDamage > bestDamage) {
                                unit.target = target;
                            }
                            else if(targetDamage === bestDamage) {
                                if(unit.target) {
                                    if(effectivePower(target) > effectivePower(unit.target)) {
                                        unit.target = target;
                                    }
                                    else if(effectivePower(target) === effectivePower(unit.target)) {
                                        if(target.initiative > unit.target.initiative) {
                                            unit.target = target;
                                        }
                                    }
                                }
                                else {
                                    unit.target = target;
                                }
                            }
                        }
                    }
                }
                if(unit.target) {
                    claimedTargets.push(unit.target);
                }
            }

            units = units.sort((a, b) => b.initiative - a.initiative);

            for(unit of  units) {
                if(unit.target && unit.count >= 0) {
                    let damage = getDamage(unit, unit.target);
                    let casualties = Math.floor(damage / unit.target.hp);
                    unit.target.count -= casualties;
                }
            }

            let unitIndex = 0;
            while(unitIndex < units.length) {
                if(units[unitIndex].count <= 0) {
                    units.splice(unitIndex, 1);
                }
                else {
                    unitIndex++;
                }
            }

            let immuneFound = false;
            let infectFound = false;

            for(let unit of units) {
                if(unit.team === 'Immune') {
                    immuneFound = true;
                }
                else if(unit.team === 'Infection') {
                    infectFound = true;
                }
            }

            if(!immuneFound) {
                minBoost = currentBoost;
                skipCount = 0;
                break;
            }
            if(!infectFound) {
                if(currentBoost === maxBoost) {
                    minBoost = currentBoost;
                }
                else {
                    maxBoost = currentBoost;
                    skipCount = 0;
                }
                break;
            }
            if(elapsed >= 100000) {
                skipCount++;
                break;
            }
        }
    }

console.log(units.map(u => u.count).reduce((prev, current) => prev + current));