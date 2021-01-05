//import * as ms from '../node_modules/ms/index'

const randomFirstNames = ['Michael', 'John', 'Tutya', 'Camilla', 'Misty', 'Khakhilla'];
const randomLastNames = ['Jones', 'Smith', 'Cranston', 'Cockeshi', 'Kensie', 'Lones'];
document.addEventListener('DOMContentLoaded', function () {
    loadReasonsForVisit();
    setRandomGuest();
}, false);
let people = [];
const reasonsForVisit = [
    { 'id': 0, 'reason': 'Because' },
    { 'id': 10, 'reason': 'Never mind' },
    { 'id': 20, 'reason': 'Vacation' },
    { 'id': 30, 'reason': 'Travel voucher' },
    { 'id': 40, 'reason': 'Deployment' },
    { 'id': 50, 'reason': 'Training' },
];
let counter = 0;

function setRandomGuest() {
    console.log("setRandomGuest called");
    const fNameIndex = getRandomInt(randomFirstNames.length);
    const lNameIndex = getRandomInt(randomLastNames.length);
    const randomFName = randomFirstNames[fNameIndex];
    const randomLName = randomLastNames[lNameIndex];
    document.getElementById("firstName").value = randomFName;
    document.getElementById("lastName").value = randomLName;
    const li = document.getElementById("reasonsForVisit");
    for (let i = 0; i < li.childElementCount; i++) {
        let chb = li.children[i].children[0].children[0];
        if (chb.type == "checkbox") {
            let j = Math.random();
            chb.checked = j < 0.35;
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function loadReasonsForVisit() {
    console.log("loadReasonsForVisit called");
    for (let i = 0; i < reasonsForVisit.length; i++) {
        addReasonForVisit(reasonsForVisit[i])
    }
}

function addReasonForVisit(reason) {
    console.log("addReasonForVisit called");
    let container = document.getElementById("reasonsForVisit");
    let li = document.createElement("li");
    let chb = document.createElement("input");
    chb.type = "checkbox";
    chb.value = reason.reason;
    let chbKey = "reason" + reason.id;
    chb.name = chbKey;
    chb.id = chbKey;
    chb.addEventListener('change', canEnableAddingToQueue);

    let lbl = document.createElement("label");
    lbl.htmlFor = chbKey;
    lbl.appendChild(chb);
    lbl.appendChild(document.createTextNode("   " + reason.reason));
    lbl.classList.add("checkbox");
    li.appendChild(lbl);
    container.appendChild(li);
}

function canEnableAddingToQueue() {
    let btn = document.getElementById("addToQueueBtn");
    btn.disabled = collectCheckedReasonsForVisit().length <= 0;
}

function collectCheckedReasonsForVisit() {
    console.log("collectCheckedReasonsForVisit called");

    let selectedReasons = [];
    let li = document.getElementById("reasonsForVisit");
    for (let i = 0; i < li.childElementCount; i++) {
        let chb = li.children[i].children[0].children[0];
        if (chb.type == "checkbox" && chb.checked) {
            let id = chb.id.replace("reason", "");
            let selectedReason = reasonsForVisit.find(x => x.id == id);
            selectedReasons.push(selectedReason);
        }
    }

    return selectedReasons;
}

function addNew() {
    console.log("addNew called");

    let fNameContainer = document.getElementById("firstName");
    let lNameContainer = document.getElementById("lastName");
    const firstName = fNameContainer.value;
    const lastName = lNameContainer.value;
    const now = new Date();
    const newPerson = {
        'name': lastName + ', ' + firstName,
        'when': now,
        'whenMs': now.getTime(),
        'id': counter++,
        'whyCame': collectCheckedReasonsForVisit()
    };
    people.push(newPerson);
    setRandomGuest();

    console.log(people);
    //refreshQueue();
    showModal();
}

function showModal() {
    console.log("showModal called");
    const modal = document.getElementById("registrationSucceededModal");
    modal.classList.add("is-active");
    setTimeout(closeModal, 1000);
}

function closeModal() {
    console.log("closeModal called");
    const modal = document.getElementById("registrationSucceededModal");
    modal.classList.remove("is-active");
}

function refreshQueue() {
    console.log("refreshQueue called");

    let div = document.createElement("div");
    if (people.length === 0) {
        div.append("No one in queue");
    } else {
        const nowMs = (new Date()).getTime();

        for (var i = 0; i < people.length; i++) {
            const id = people[i].id;
            let pDiv = document.createElement("div");
            pDiv.id = "person" + id;
            pDiv.innerHTML = people[i].name + ', arrived ' + computeAgo(nowMs, people[i].whenMs);
            pDiv.innerHTML += ' (' + people[i].whyCame.map(x => x['reason']) + ').';
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

function computeAgo(now, from) {
    const thirtySec = 30000;
    const oneMin = 60000;
    const fiveMin = oneMin * 5;
    const diff = now - from;
    if (diff < thirtySec) return 'just now' //30 sec
    else if (diff < oneMin) return 'less than a minute ago'
    else if (diff < fiveMin) return 'within the last 5 min'
    else return Math.round(diff / oneMin) + ' minutes ago'
}

function showPerson(divId) {
    console.log("showPerson called");

    const id = divId.replace("person", "");
    const removed = people.find(x => x.id == id);
    console.log(removed);
    people = people.filter(x => x.id != id);
    //refreshQueue();
}