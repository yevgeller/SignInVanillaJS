let randomFirstNames = ['Michael', 'John', 'Tutya', 'Camilla', 'Misty', 'Khakhilla'];
let randomLastNames = ['Jones', 'Smith', 'Cranston', 'Cockeshi', 'Kensie', 'Lones'];
document.addEventListener('DOMContentLoaded', function () {
    setRandomName();
    loadReasonsForVisit();
}, false);

function setRandomName() {
    let fNameIndex = getRandomInt(randomFirstNames.length) ;
    let lNameIndex = getRandomInt(randomLastNames.length) ;
    let randomFName = randomFirstNames[fNameIndex];
    let randomLName = randomLastNames[lNameIndex];
    // console.log('fName index ' + fNameIndex);
    // console.log('lName index ' + lNameIndex);
    document.getElementById("firstName").value = randomFName;
    document.getElementById("lastName").value = randomLName;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
//set up reasons
function loadReasonsForVisit() {
    let container = document.getElementById("reasonsForVisit");
}

let people = [];
let reasonsForVisit = [
    { 'id': 0, 'reason': 'Because' },
    { 'id': 1, 'reason': 'Never mind' },
    { 'id': 2, 'reason': 'Lost keys' },
];
let counter = 0;

function addNew() {
    let fNameContainer = document.getElementById("firstName");
    let lNameContainer = document.getElementById("lastName");
    let firstName = fNameContainer.value;
    let lastName = lNameContainer.value;
    let newPerson = {
        'name': lastName + ', ' + firstName,
        'when': new Date(),
        'id': counter++
    };
    people.push(newPerson);

    fNameContainer.value = lNameContainer.value = 'abc';

    console.log(people);
    refreshQueue();
}

function refreshQueue() {
    let div = document.createElement("div");
    if (people.length === 0) {
        div.append("No one in queue");
    } else {
        for (var i = 0; i < people.length; i++) {
            let id = people[i].id;
            let pDiv = document.createElement("div");
            pDiv.id = "person" + id;
            pDiv.innerHTML = people[i].name + ', arrived: ' + people[i].when;
            let btn = document.createElement("button");
            btn.innerHTML = "Remove";
            btn.addEventListener('click', function () {
                showPerson('person' + id);
            });
            div.append(pDiv);
            div.append(btn);
        }
    }

    let container = document.getElementById("queueContainer");
    container.innerHTML = "";
    container.append(div);
}

function displayPeople() {
    if (people.length === 0) {
        return "<div>No one in the queue</div>";
    }
    //let ret = "<div>No"
}

function showPerson(divId) {
    let id = divId.replace("person", "");
    let removed = people.find(x => x.id == id);
    console.log(removed);
    people = people.filter(x => x.id != id);
    refreshQueue();
}