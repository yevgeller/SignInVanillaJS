let people = [];
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
    let removed = people.find(x=>x.id == id);
    console.log(removed);
    people = people.filter(x=>x.id != id);
    refreshQueue();
}