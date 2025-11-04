const admin = require("firebase-admin");
if (!admin.apps.length){
const serviceAccount = require("./storyspark-ai-914b9-firebase-adminsdk-fbsvc-4277a8917f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
}

module.exports = admin;
