//import * as seedrandom from 'http://davidbau.com/encode/seedrandom.js';
var params = new URLSearchParams(document.location.search.substring(1))
var seed = params.getAll('random_seed')
Math.seedrandom(seed);
var playas = [];
for (let playa of params.getAll('player')) {
    if( playa.trim()) {
        //playas.push(playa.trim())
        playas.push(playa.trim().toLocaleLowerCase())
    }
}
var me = params.get('me')
playas.push(me)
playas.sort()
console.log(playas.length)

const numMinionsTable = {
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4
}
let numMinions = numMinionsTable[playas.length]
console.log(numMinions)

/*
Randomize array in-place using Durstenfeld shuffle algorithm 
Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
*/
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(playas)
console.log(playas)
minions = playas.slice(0, numMinions)
console.log(minions)
servants = playas.slice(numMinions, playas.length)
console.log(servants)

function getSortedFlags(params, flags) {
    let sortedFlags = [];
    for (let flag of flags) {
        if (params.get(flag)) {
            sortedFlags.push(flag)
        }
    }
    sortedFlags.sort()
    return sortedFlags
}
let specialServants = getSortedFlags(params, ['merlin','percival'])
console.log(specialServants)
let specialMinions = getSortedFlags(params, ['morgana', 'assassin', 'oberon', 'mordred'])
console.log(specialMinions)

function roleToPlayer(role, players, roleAssignments){
    if(roleAssignments.includes(role)){
        return players[roleAssignments.indexOf(role)]
    }
    return null
}

if (minions.includes(me)){
    role = roleToPlayer(me, specialMinions, minions)
    if(! role) {
        role = 'Minion of Mordred'
    }
} else {
    role = roleToPlayer(me, specialServants, servants)
    if(! role) {
        role = 'Loyal Servant of Arthur'
    }
}

let peopleKnown = [];
if(minions.includes(me)) {
    peopleKnown = minions.filter(function(element){return element != me && element != roleToPlayer('oberon', minions, specialMinions)})
}
    
switch(role) {
    case 'merlin':
        peopleKnown = minions.filter(function(element){return element == roleToPlayer('mordred', minions, specialMinions)})
        //
        break;
    case 'percival':
        peopleKnown.push(roleToPlayer('morgana', minions, specialMinions))
        peopleKnown.push(roleToPlayer('merlin', servants, specialServants))
        break;
    case 'oberon':
        peopleKnown = [me]
        break;
    default:
}

shuffleArray(peopleKnown)
var msg = ''
if(minions.includes(me)) {
    allies = peopleKnown.join('n')
    msg = 'You are a minion of Mordred! Your role is ' + role + '.\n' + 'Your allies are: \n' + peopleKnown.join('\n')
} else if (role  === 'merlin') {
    knownMinions = peopleKnown.filter(function(element){return element != roleToPlayer('mordred', minions, specialMinions)}).join('\n')
    allies = allies.filter(function(element){return element != me})
    msg = 'You are a loyal servant of Arthur!! Your role is ' + role + '.\n' + 'Your enemies are:\n' + knownMinions.join('\n')
} else if (role === 'percival') {
    allies = peopleKnown
    knownMinions = peopleKnown
    msg = 'You are a loyal servant of Arthur!! Your role is ' + role + '.\n' + 'Merlin and Morgana might be: \n' + peopleKnown.join('\n')
} else {
    msg = 'You are a loyal servant of Arthur!! Your role is ' + role + '.\n' + 'You know: ???'
}
console.log(msg)

var identity_paragraph = document.createElement('p');
identity_paragraph.innerHTML = 'There are ' + minions.length + ' Minions of Mordred and ' + servants.length + ' Loyal Servants of Arthur.\n' + msg

//identity_paragraph.innerHTML = player;
//identity_paragraph.innerHTML += playa;
//identity_paragraph.innerHTML += playa;
//identity_paragraph.innerHTML += playa;
//identity_paragraph.innerHTML = params.getAll('player');
//identity_paragraph.innerHTML += playa;
document.getElementById('main_div').append(identity_paragraph)