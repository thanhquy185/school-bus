import { v4 as uuidv4 } from "uuid";
import { bucket } from "../configs/firebase.config";

const FirebaseService = {
  async uploadStudentImage(file) {
    try {
      if (!file) throw new Error("No file provided");
      const imageName = `students/${Date.now()}_${file.originalname}`;
      const firebaseFile = bucket.file(imageName);
      await new Promise((resolve, reject) => {
        const stream = firebaseFile.createWriteStream({
          metadata: {
            contentType: file.mimetype,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          },
        });

        stream.on("error", reject);
        stream.on("finish", resolve);
        stream.end(file.buffer);
      });

      const [metadata] = await firebaseFile.getMetadata();
      const token = metadata.metadata.firebaseStorageDownloadTokens;
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(imageName)}?alt=media&token=${token}`;

      return publicUrl;
    } catch (err) {
      throw new Error("Upload failed: " + err.message);
    }
  },
};

export default FirebaseService;
