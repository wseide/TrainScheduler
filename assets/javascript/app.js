//firebase config
var config = {
apiKey: "AIzaSyC7oN1M651SIcn4FNI-7tJCJnyyRsQpR_M",
authDomain: "train-scheduler-fa9c6.firebaseapp.com",
databaseURL: "https://train-scheduler-fa9c6.firebaseio.com",
projectId: "train-scheduler-fa9c6",
storageBucket: "train-scheduler-fa9c6.appspot.com",
messagingSenderId: "4087802302",
appId: "1:4087802302:web:6fe0bb5f81e1a8ea80f1ef",
measurementId: "G-0N4L28B4BC"
};

//Initialize Firebase
firebase.initializeApp(config);
      

//A variable to reference the database.
var database = firebase.database();

//ON-CLICK & VARIABLES
var name;
var destination;
var firstTrain;
var frequency = 0;

$('#add-train').on("click", function(){
event.preventDefault();
// Storing and retreiving new train data
name = $("#train-name").val().trim();
destination = $("#destination").val().trim();
firstTrain = $("#first-train").val().trim();
frequency = $("#frequency").val().trim();

//Pushing to database
database.ref().push({
name: name,
destination: destination,
firstTrain: firstTrain,
frequency: frequency,
dateAdded: firebase.database.ServerValue.TIMESTAMP
});
$("form")[0].reset();
});

database.ref().on("child_added", function(childSnapshot) {
var nextArr;
var minAway;

var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

var diffTime = moment().diff(moment(firstTrainNew), "minutes");
var remainder = diffTime % childSnapshot.val().frequency;

var minAway = childSnapshot.val().frequency - remainder;

var nextTrain = moment().add(minAway, "minutes");
nextTrain = moment(nextTrain).format("hh:mm");


//ADD ROW
$("#add-row").append("<tr><td>" + childSnapshot.val().name +
"</td><td>" + childSnapshot.val().destination +
"</td><td>" + childSnapshot.val().frequency +
"</td><td>" + nextTrain + 
"</td><td>" + minAway + "</td></tr>");


}, function(errorObject) {
console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
$("#name-display").html(snapshot.val().name);
$("#email-display").html(snapshot.val().email);
$("#age-display").html(snapshot.val().age);
$("#comment-display").html(snapshot.val().comment);
});

