let people = [];
function a() {
    let fNameContainer = document.getElementById("firstName");
    let lNameContainer = document.getElementById("lastName");
    let firstName = fNameContainer.value;
    let lastName = lNameContainer.value;
    let newPerson = {
        'name': lastName + ', ' + firstName,
        'when': new Date()
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
            let pDiv = document.createElement("div");
            pDiv.id = "person" + i;
            pDiv.innerHTML = people[i].name + ', arrived: ' + people[i].when;
            div.append(pDiv);
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