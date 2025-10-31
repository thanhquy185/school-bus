import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.join(__dirname, "school-bus-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: "school-bus-cnpm.firebasestorage.app", 
});

const bucket = admin.storage().bucket();

export { admin, bucket };
