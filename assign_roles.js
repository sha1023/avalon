var params = new URLSearchParams(document.location.search.substring(1))
var seed = params.getAll('random_seed')
Math.seedrandom(seed);
var playas = [];
for (let playa of params.getAll('player')) {
    if( playa.trim()) {
        playas.push(playa.trim())
    }
}
var me = params.get('me')
if(! playas.includes(me)) {
    playas.push(me)
}
playas.sort()
rank = playas.indexOf(me)

translateValue = [
    ['dog', 'cow'],
    ['red', 'green'],
    ['steel', 'coal'],
    ['big', 'small'],
    ['king', 'pin'],
    ['tree', 'grass'],
    ['donut', 'danish'],
    ['cube', 'ball'],
    ['up', 'down'],
    ['now', 'later'],
]

var inverseValue = {}
for(i=0; i<translateValue.length; i++) {
    inverseValue[translateValue[i][0]] = i
    inverseValue[translateValue[i][1]] = i
}

function generateSecretPads(players, numberEntries) {
    var pads = []
    for (i = 0; i < players.length; i++) {
        var playerPad = []
        for (j = 0; j < numberEntries; j++) {
            if (Math.random()>.5) {
                playerPad.push(1)
            } else {
                playerPad.push(0)
            }
        }
        pads.push(playerPad)
    }
    return pads
}
const secretPads = generateSecretPads(playas, 1000)

const numMinionsTable = {
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4
}
let numMinions = numMinionsTable[playas.length]

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
minions = playas.slice(0, numMinions)
servants = playas.slice(numMinions, playas.length)

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
let specialServants = getSortedFlags(params, ['Merlin','Percival'])
let specialMinions = getSortedFlags(params, ['Morgana', 'Assassin', 'Oberon', 'Mordred'])

document.getElementById('num_minions').innerHTML = minions.length
document.getElementById('num_servants').innerHTML = servants.length
document.getElementById('special_servants').innerHTML = specialServants.join(', ')
document.getElementById('special_minions').innerHTML = specialMinions.join(', ')


function roleToPlayer(role, players, roleAssignments){
    if(roleAssignments.includes(role)){
        return players[roleAssignments.indexOf(role)]
    }
    return null
}

if (minions.includes(me)){
    role = roleToPlayer(me, specialMinions, minions)
    document.getElementById('team').innerHTML = 'Mordred'
    if(! role) {
        role = 'Generic Minion'
    }
} else {
    role = roleToPlayer(me, specialServants, servants)
    document.getElementById('team').innerHTML = 'Arthur'
    if(! role) {
        role = 'Generic Peasant'
    }
}
document.getElementById('role').innerHTML = role

let peopleKnown = [];
if(minions.includes(me)) {
    peopleKnown = minions.filter(function(element){return element != me && element != roleToPlayer('Oberon', minions, specialMinions)})
} else {
    peopleKnown = ['?', '?', '?']
}

switch(role) {
    case 'Merlin':
        peopleKnown = minions.filter(function(element){return element != roleToPlayer('Mordred', minions, specialMinions)})

        document.getElementById('knowledge_label').innerHTML = 'Known Minions'
        break;
    case 'Percival':
        peopleKnown = [roleToPlayer('Morgana', minions, specialMinions), roleToPlayer('Merlin', servants, specialServants)]
        document.getElementById('knowledge_label').innerHTML = 'People you know'
        break;
    case 'Oberon':
        peopleKnown = [me]
        break;
    default:
}

shuffleArray(peopleKnown)
document.getElementById('knowledge').innerHTML = peopleKnown.join(', ')

var cardsSubmitted = 0

function getCardValue(cardsSubmitted, rank, succeeded){
    var value = (secretPads[rank][cardsSubmitted] + succeeded) % 2
    return cardsSubmitted + '-' + translateValue[rank][value]
}

function submitCard() {
    var succeeded = 0
    if(document.getElementById('success').checked) {
        succeeded = 1
    } else {
        succeeded = 0
    }
    cardsSubmitted++
    cardValue = getCardValue(cardsSubmitted, rank, succeeded)
    document.getElementById('card_value').innerHTML = cardValue
}

function invertCardValue(cardValue) {
    cardParts = cardValue.split('-')
    missionNumber = cardParts[0]
    cardEncoded = cardParts[1]
    cardRank = inverseValue[cardEncoded]
    return (secretPads[cardRank][missionNumber] + translateValue[cardRank].indexOf(cardEncoded)) % 2
}

function tallyVotes(){
    failCount = 0
    missionStatus = 'Success!'
    for(element of document.getElementsByName('vote')) {
        voteValue = element.value.trim()
        if(!voteValue){
            continue
        }
        cardValue = invertCardValue(voteValue)
        if(cardValue == 0){
            failCount++
            missionStatus = 'Fail.'
        }
    }
    document.getElementById('vote_result').innerHTML = missionStatus + ' -- ' + failCount + ' failures.'
}

function clearVotes(){
    for(element of document.getElementsByName('vote')) {
        element.value = ''
    }
}


function populateBoard(numPlayas){
    switch(numPlayas) {
        case 5:
            document.getElementById('q1').innerHTML = 2
            document.getElementById('q2').innerHTML = 3
            document.getElementById('q3').innerHTML = 2
            document.getElementById('q4').innerHTML = 3
            document.getElementById('q5').innerHTML = 3
            break;
        case 6:
            document.getElementById('q1').innerHTML = 2
            document.getElementById('q2').innerHTML = 3
            document.getElementById('q3').innerHTML = 4
            document.getElementById('q4').innerHTML = 3
            document.getElementById('q5').innerHTML = 4
            break;
        case 7:
            document.getElementById('q1').innerHTML = 2
            document.getElementById('q2').innerHTML = 3
            document.getElementById('q3').innerHTML = 3
            document.getElementById('q4').innerHTML = '4 :>/'
            document.getElementById('q5').innerHTML = 4
            break;
        default:
            document.getElementById('q1').innerHTML = 3
            document.getElementById('q2').innerHTML = 4
            document.getElementById('q3').innerHTML = 4
            document.getElementById('q4').innerHTML = '5 :>/'
            document.getElementById('q5').innerHTML = 5
            break;
    }
}
populateBoard(playas.length)
