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
    while (people.length < 3) {
        addNew();
    }
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
    let flag = false;
    for (let i = 0; i < li.childElementCount; i++) {
        let chb = li.children[i].children[0].children[0];
        if (chb.type == "checkbox") {
            chb.checked = false; //reset
            let j = Math.random();
            if (j < 0.35) {
                chb.checked = true;
                flag = true;
            }
        }
    }
    if (!flag) {
        document.getElementById("addToQueueBtn").disabled = true;
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
        name: lastName + ', ' + firstName,
        when: now,
        whenMs: now.getTime(),
        id: counter++,
        whyCame: collectCheckedReasonsForVisit(),
        whenDone: null
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
    setTimeout(closeModal, 100);
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
        let customersInLobby = people.filter(x => x.whenDone == null);

        for (let i = 0; i < customersInLobby.length; i++) {
            const id = customersInLobby[i].id;
            let pDiv = document.createElement("div");
            pDiv.id = "person" + id;
            pDiv.innerHTML = '<strong>' + customersInLobby[i].name + '</strong>, arrived <u>' + computeAgo(nowMs, customersInLobby[i].whenMs) + '</u>';
            pDiv.innerHTML += ' <i>(' + customersInLobby[i].whyCame.map(x => x['reason']) + ')</i>.';

            //create helpers dropdown:
            let helpersContainer = document.createElement('div');
            helpersContainer.classList.add('select');
            helpersContainer.name = "helpersContainer";
            let helpers = document.createElement('select');
            helpers.id = "person" + id + "HelpersList";
            let defaultOption = document.createElement('option');
            defaultOption.text = 'Choose...';
            defaultOption.value = -1;
            helpers.add(defaultOption, 1);
            //fill helpers dropdown:
            for (let i = servicePersonnel.length - 1; i >= 0; i--) {
                let option = document.createElement('option');
                option.text = servicePersonnel[i].name;
                option.value = servicePersonnel[i].id;
                helpers.add(option, 0);
            }

            helpersContainer.addEventListener('change', disableSettingUnselectedHelper.bind(null, id));
            helpersContainer.append(helpers);


            let setHelperButton = createElementWithOptions("button", "Set Helper", ["button", "is-success"], "person" + id + "HelperSetter");
            setHelperButton.disabled = true;
            setHelperButton.addEventListener('click', setHelper.bind(null, id));

            let changeHelperButton = createElementWithOptions("button", "Change Helper", ["button", "is-warning", "is-hidden"], "person" + id + "HelperChanger");
            changeHelperButton.addEventListener('click', changeHelper.bind(null, id));

            let buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("padTop12");

            let beingHelpedByBanner = createElementWithOptions("span", "Currently being assisted by:", ["is-hidden"], "person" + id + "beingHelpedByBanner");


            buttonsDiv.append(beingHelpedByBanner);
            buttonsDiv.append(helpersContainer);
            buttonsDiv.append(setHelperButton);
            buttonsDiv.appendChild(changeHelperButton);

            pDiv.append(buttonsDiv);
            let mgmtDiv = document.createElement("div");
            mgmtDiv.id = "person" + id + "mgmt";
            mgmtDiv.classList.add("padTop12");

            let btn = createElementWithOptions("button", "Done", ["button", "is-danger", "is-light", "is-hidden"], "person" + id + "Remover");
            btn.addEventListener('click', function () {
                showPerson('person' + id);
            });
            mgmtDiv.append(btn);
            pDiv.append(mgmtDiv);
            div.append(pDiv);
            div.append(document.createElement("hr"));

            let currentHelper = customersInLobby[i].helpersHistory && customersInLobby[i].helpersHistory.find(x => x.endedWhen == null);
            if (currentHelper) {
                helpers.value = currentHelper.id;
                div.querySelector("#person" + id + "HelperSetter").classList.add("is-hidden");
                div.querySelector("#person" + id + "HelpersList").disabled = true;
                div.querySelector("#person" + id + "HelperChanger").classList.remove("is-hidden");
                div.querySelector("#person" + id + "beingHelpedByBanner").classList.remove("is-hidden");
                div.querySelector("#person" + id + "Remover").classList.remove("is-hidden");
            }
        }

        let container = document.getElementById("queueContainer");
        container.innerHTML = "";
        if (customersInLobby.length === 0) {
            container.innerHTML = "No one is in the lobby.";
        }
        container.append(div);

        let logContainer = document.getElementById("completedLog");
        logContainer.innerHTML = "";
        let servedCustomers = people.filter(x => x.whenDone != null);

        if (servedCustomers.length === 0) {
            logContainer.innerHTML = "No customers completed their visits."
        }

        for (let i = 0; i < servedCustomers.length; i++) {
            const id = servedCustomers[i].id;
            let servedDiv = document.createElement("div");
            servedDiv.id = "served" + id;
            servedDiv.innerHTML = '<strong>' + servedCustomers[i].name + '</strong>, spent <u>' + computeTimeSpan(servedCustomers[i].whenDone - servedCustomers[i].when) + '</u>';
            servedDiv.innerHTML += ' <i>(' + servedCustomers[i].whyCame.map(x => x['reason']) + ')</i>.';
            servedDiv.innerHTML += "<div>Served by:<ul>";
            servedCustomers[i].helpersHistory.forEach(function (helper) {
                let a = servicePersonnel.find(x => x.id == helper.id);
                servedDiv.innerHTML += "<li>" + (a ? a.name : "(no name)") +
                    " for " + computeTimeSpan(helper.endedWhen - helper.startedWhen) + "</li>";
            });

            logContainer.append(servedDiv);
            logContainer.append(document.createElement("hr"));
        }
    }

}

function createElementWithOptions(type, innerHTML, classList, id) {
    let el = document.createElement(type);
    el.id = id;
    el.innerHTML = innerHTML;
    el.classList.add(...classList);
    return el;
}

function setHelper(id) {
    const helperId = document.getElementById("person" + id + "HelpersList").value;
    let person = people.find(x => x.id == id);
    if (!('helpersHistory' in person)) {
        person.helpersHistory = [];
    }
    person.helpersHistory.push({
        id: helperId,
        startedWhen: (new Date()).getTime(),
        endedWhen: null
    });
    person.isBeingHelped = true;
    console.log(person);
    document.getElementById("person" + id + "HelperSetter").classList.add("is-hidden");
    document.getElementById("person" + id + "HelpersList").disabled = true;
    document.getElementById("person" + id + "HelperChanger").classList.remove("is-hidden");
    document.getElementById("person" + id + "beingHelpedByBanner").classList.remove("is-hidden");
    document.getElementById("person" + id + "Remover").classList.remove("is-hidden");
}

function changeHelper(id) {
    const helperId = document.getElementById("person" + id + "HelpersList").value;
    let person = people.find(x => x.id == id);
    person.isBeingHelped = false;
    let helperRecord = person.helpersHistory.find(x => x.id === helperId && x.endedWhen == null);
    helperRecord.endedWhen = (new Date).getTime();
    console.log(person);
    document.getElementById("person" + id + "HelperSetter").classList.remove("is-hidden");
    document.getElementById("person" + id + "HelpersList").disabled = false;
    document.getElementById("person" + id + "HelperChanger").classList.add("is-hidden");
    document.getElementById("person" + id + "beingHelpedByBanner").classList.add("is-hidden");
    document.getElementById("person" + id + "Remover").classList.add("is-hidden");
}

function disableSettingUnselectedHelper(id) {
    const helperId = document.getElementById("person" + id + "HelpersList").value;
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

function computeTimeSpan(ms) {
    const oneSec = 1000;
    const oneMin = 60000;
    const oneHour = oneMin * 60;
    if (ms > oneHour) {
        return Math.round(ms / oneHour) + ' hours';
    } else if (ms > oneMin) {
        return Math.round(ms / oneMin) + ' minutes';
    } else if (ms > oneSec) {
        return Math.round(ms / 1000) + ' seconds';
    } else {
        return 'less than a second';
    }
}

function showPerson(divId) {
    console.log("showPerson called");

    const id = divId.replace("person", "");
    const removed = people.find(x => x.id == id);
    removed.whenDone = (new Date()).getTime();
    console.log(removed);
    // people = people.filter(x => x.id != id);
    refreshQueue();
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