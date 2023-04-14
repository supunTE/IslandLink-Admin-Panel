console.log("update.js loaded");

const form = document.querySelector('form');

// add an event listener to the form
form.addEventListener('submit', addService);

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

const facilities = [];

const faciltiesDiv = document.getElementById('facilities');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
        if(event.target.checked) {
            facilities.push(event.target.value);
        } else {
            facilities.splice(facilities.indexOf(event.target.value), 1);
        }
        faciltiesDiv.innerHTML = '';
        faciltiesDiv.innerHTML += `<span>${facilities}</span>`;
    });
});

function addService(event) {
    event.preventDefault()
    // Retrieve form data
    const type = document.getElementById("type").value;
    const image = document.getElementById("image").value;
    const name = document.getElementById("name").value;
    const pricePerHour = parseFloat(document.getElementById("pricePerHour").value);
    const lat = document.getElementById("lat").value;
    const long = document.getElementById("long").value;
    const rating = parseFloat(document.getElementById("rating").value);
    const reviews = parseInt(document.getElementById("reviews").value);

    // Create a Firestore document with the retrieved data
    const db = firebase.firestore();
    db.collection("services").add({
        type,
        image,
        name,
        pricePerHour,
        location: new firebase.firestore.GeoPoint(parseFloat(lat), parseFloat(long)),
        facilities,
        rating,
        reviews,
    })
        .then((docRef) => {
            console.log("Service added with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding service: ", error);
        });
}
