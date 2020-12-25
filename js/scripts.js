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
}