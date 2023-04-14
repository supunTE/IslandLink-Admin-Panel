console.log("update.js loaded");

const form = document.querySelector('form');

// add an event listener to the form
form.addEventListener('submit', addService);

function addService(event) {
    event.preventDefault()
    // Retrieve form data
    const type = document.getElementById("type").value;
    const image = document.getElementById("image").value;
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const lat = document.getElementById("lat").value;
    const long = document.getElementById("long").value;
    const facilities = [
        document.getElementById("wifi").checked,
        document.getElementById("food").checked,
        document.getElementById("charge").checked,
        document.getElementById("health").checked,
        document.getElementById("ac").checked,
        document.getElementById("bed").checked,
        document.getElementById("gym").checked,
        document.getElementById("bicycle").checked,
        document.getElementById("camp").checked,
        document.getElementById("play").checked,
        document.getElementById("pet").checked,
    ];
    const rating = document.getElementById("rating").value;
    const reviews = document.getElementById("reviews").value;

    // Create a Firestore document with the retrieved data
    const db = firebase.firestore();
    db.collection("services").add({
        type,
        image,
        name,
        price,
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
