const db = firebase.firestore();

const usersCollection = db.collection("users");

// Add an event listener to the form submit button
const form = document.getElementById("add-user-form");
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Get the user input values
    const name = form.elements["name"].value;
    const image = form.elements["image"].value;

    // Create a new user document
    const user = {
        name, image,
    };

    // Add the user document to the users collection
    usersCollection
        .add(user)
        .then(() => {
            console.log("User added successfully!");
            form.reset(); // Clear the form inputs
        })
        .catch((error) => {
            console.error("Error adding user: ", error);
        });
});

// Get a reference to the table body
const tableBody = document.querySelector("#users-table tbody");

// Listen for changes to the users collection and update the table
usersCollection.get().then((snapshot) => {
    // Loop through the user documents and add them to the table
    snapshot.forEach((doc) => {
        const user = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${user.name}</td>
            <td><img src="${user.image}" alt="${user.name}"></td>
          `;
        tableBody.appendChild(row);
    });
});

const communityCollection = firebase.firestore().collection("community");

// Handle form submission
const postAddForm = document.querySelector("form#addPost");
postAddForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const id = formData.get("id");
    const title = formData.get("title");
    const commentsCount = parseInt(formData.get("commentsCount"));
    const likesCount = parseInt(formData.get("likesCount"));
    const description = formData.get("description");
    const image = formData.get("image");
    const time = new Date(formData.get("time")).getTime();

    if (!id || !title || !image || !time) {
        alert("Please fill out all the fields");
        return;
    }

    // Check if the user ID exists in Firestore
    const userDoc = await usersCollection.doc(id).get();
    if (!userDoc.exists) {
        alert(`User with ID ${id} does not exist`);
        return;
    }

    // Create a new post object
    const post = {
        type: "post",
        id,
        title,
        description,
        image,
        time: firebase.firestore.Timestamp.fromMillis(time),
        likesCount: likesCount || 0,
        commentsCount: commentsCount || 0,
    };

    // Add the post to Firestore
    communityCollection.add(post).then(() => {
        console.log("Post added to Firestore");
        postAddForm.reset();
    });


    alert("Post added successfully!");
});

const questionAddForm = document.querySelector("#addQuestionForm");
questionAddForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the form data
    const formData = new FormData(event.target);
    const id = formData.get("questionUserId");
    const question = formData.get("question");
    const time = new Date(formData.get("questionTime")).getTime();
    const upvotesCount = parseInt(formData.get("upvotesCount"));
    const commentsCount = parseInt(formData.get("answersCount"));
    const topAnswer = formData.get("topAnswer");
    const topAnswerUserId = formData.get("topAnswerUserId");

    const answeredUser  = await usersCollection.doc(topAnswerUserId).get();
    if(!answeredUser.exists){
        alert("Answered user does not exist in the users collection.");
        return;
    }

    const usersRef = usersCollection.doc(id);
    usersRef.get().then((doc) => {
        if (!doc.exists) {
            alert("User does not exist in the users collection.");
            return;
        }



        // Add the question to the community collection
        db.collection("community").add({
            type: "question",
            upvotesCount,
            question,
            id,
            commentsCount,
            time: firebase.firestore.Timestamp.fromMillis(time),
            topAnswer,
            topAnswerUserId,
        })
            .then(() => {
                console.log("Question added successfully.");
                // Clear the form
                document.getElementById("questionForm").reset();
            })
            .catch((error) => {
                console.error("Error adding question: ", error);
            });
        questionAddForm.reset();
        alert("Post added successfully!");
    });


});