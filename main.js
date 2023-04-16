console.log("update.js loaded");
const db = firebase.firestore();

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
const servicesData = document.getElementById('servicesData');

db.collection("services")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((querySnapService) => {
            const service = querySnapService.data();
            console.log(service)
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${querySnapService.id}</td>
              <td><img src="${service.image}" width="100" height="100"></td>
              <td>${service.name}</td>
              <td>${service.type}</td>
              <td>${service.facilities.join(', ')}</td>
              <td>${service.location.latitude}, ${service.location.longitude}</td>
              <td>${service.rating}</td>
              <td>${service.pricePerHour}</td>
              <td>${service.reviews}</td>
              <td>
                <div id="comments-${querySnapService.id}">
                  Loading comments...
                </div>
              </td>
            `;
            servicesData.appendChild(tr);
            const commentsContainer = document.getElementById(`comments-${querySnapService.id}`);
            db.collection("services").doc(querySnapService.id).collection("comments")
              .get()
              .then((querySnapshot2) => {
                let comments = "";
                querySnapshot2.forEach((queryReview) => {
                  const comment = queryReview.data();
                  comments += `
                    <div>
                      <img src="${comment.profileImg}" width="50" height="50">
                      <strong>${comment.userName}</strong>
                      <span>${comment.userRating}/5</span>
                      <p>${comment.userComment}</p>
                    </div>
                  `;
                });
                commentsContainer.innerHTML = comments;
              })
              .catch((error) => {
                  console.log("Error getting comments: ", error);
              });
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    const commentSubmit = document.getElementById('commentSubmit');
    

    function addComment() {
        const userId = document.getElementById('userId').value;
        const userIcon = document.getElementById('userIcon').value;
        const userName = document.getElementById('userName').value;
        const userComment = document.getElementById('userComment').value;
        const userRating = document.getElementById('userRating').value;

        if(!userId || !userIcon || !userName || !userComment || !userRating) {
            alert('Please fill all the fields');
            return;
        }
        
        db.collection("services")
          .doc(userId)
          .collection("comments")
          .add({
            profileImg: userIcon,
            userName: userName,
            userComment: userComment,
            userRating: userRating
          })
          .then(() => {
            console.log("Comment added successfully");
            alert("Comment added successfully");
          })
          .catch((error) => {
            console.log("Error adding comment: ", error);
          });
      }
      
      commentSubmit.onclick = addComment;