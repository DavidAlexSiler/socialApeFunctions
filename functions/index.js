const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from ASSTOPIA!");
});

exports.getSpeeches = functions.https.onRequest((req, res) => {
    admin
    .firestore()
    .collection('speeches')
    .get()  
    .then(data => {
        let speeches = [];
        data.forEach(doc => {
            speeches.push(doc.data());
        });
            return res.json(speeches);
        })
    .catch(err => console.error(err));
});

exports.createSpeeches = functions.https.onRequest((req, res) => {
    if(req.method !== 'POST'){
        return res.status(400).json({error: 'Method not Allowed'})
    }
    const newSpeech = {
        body:  req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };
    admin.firestore()
    .collection('speeches')
    .add(newSpeech)
    .then(doc => {
        res.json({message: `document ${doc.id} created successfully.`});
    })
    .catch(err => {
        res.status(500).json({error: 'something went wrong'});
    })
})