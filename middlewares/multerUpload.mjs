import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const imageFileUpload = upload.fields([
  { name: "imageFile", maxCount: 1 },
]);
