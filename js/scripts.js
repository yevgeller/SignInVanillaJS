//import * as ms from '../node_modules/ms/index'

const randomFirstNames = ['Michael', 'John', 'Tutya', 'Camilla', 'Misty', 'Khakhilla'];
const randomLastNames = ['Jones', 'Smith', 'Cranston', 'Cockeshi', 'Kensie', 'Lones'];
const servicePersonnel = [
    { name: 'Johnson, Boris', id: 101 },
    { name: 'Merkel, Angela', id: 102 },
    { name: 'Trudeau, Justin', id: 103 },
    { name: 'Makron, Emmanuel', id: 104 },
    { name: 'Seviche, Alexandro', id: 105 }
];

document.addEventListener('DOMContentLoaded', function () {
    servicePersonnel.sort(compareHelpers);
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
    refreshQueue();
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

            let helpersContainer = document.createElement('div');
            helpersContainer.classList.add('select');
            let helpers = document.createElement('select');
            helpers.id = "person" + id + "HelpersList";
            let defaultOption = document.createElement('option');
            defaultOption.text = 'Choose...';
            defaultOption.value = -1;
            helpers.add(defaultOption, 1);

            for (let i = servicePersonnel.length - 1; i >= 0; i--) {
                let option = document.createElement('option');
                option.text = servicePersonnel[i].name;
                option.value = servicePersonnel[i].id;
                helpers.add(option, 0);
            }

            helpersContainer.addEventListener('change', disableSettingUnselectedHelper.bind(null, id));
            helpersContainer.append(helpers);

            let setHelperButton = document.createElement("button");
            setHelperButton.innerHTML = "Set Helper";
            setHelperButton.id = "person" + id + "HelperSetter";
            setHelperButton.disabled = true;
            setHelperButton.addEventListener('click', setHelper.bind(null, id));
            
            let changeHelperButton = document.createElement("button");
            changeHelperButton.innerHTML = "Change Helper";
            changeHelperButton.id = "person" + id + "HelperChanger";
            changeHelperButton.classList.add("is-hidden");
            changeHelperButton.addEventListener('click', changeHelper.bind(null, id));
            
            helpersContainer.appendChild(setHelperButton);
            helpersContainer.appendChild(changeHelperButton);
            pDiv.append(helpersContainer);
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

function setHelper(id) {
    const helperId = document.getElementById("person" + id + "HelpersList").value;
    let person = people.find(x=>x.id == id);
    person.helperId = helperId;
    document.getElementById("person" + id + "HelperSetter").classList.add("is-hidden");
    document.getElementById("person" + id + "HelpersList").disabled = true;
    document.getElementById("person" + id + "HelperChanger").classList.remove("is-hidden");
}

function changeHelper(id) {
    const helperId = document.getElementById("person" + id + "HelpersList").value;
    let person = people.find(x=>x.id == id);
    person.helperId = null;
    document.getElementById("person" + id + "HelperSetter").classList.remove("is-hidden");
    document.getElementById("person" + id + "HelpersList").disabled = false;
    document.getElementById("person" + id + "HelperChanger").classList.add("is-hidden");
}

function disableSettingUnselectedHelper(id) {
    const helperId =  document.getElementById("person" + id + "HelpersList").value;
        document.getElementById("person" + id + "HelperSetter").disabled = helperId < 0;
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

function toggleAdminInterface() {
    const adminUIDiv = document.getElementById("adminInterface");

    if (adminUIDiv.classList.contains('is-hidden')) {
        adminUIDiv.classList.remove('is-hidden');
    } else {
        adminUIDiv.classList.add('is-hidden');
    }
}

function compareHelpers(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let comparison = 0;
    if (nameA > nameB) {
        comparison = 1;
    } else if (nameA < nameB) {
        comparison = -1;
    }
    return comparison;
}