import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const validExtensions = [".png", ".jpg", ".jpeg", ".gif", ".pdf"];

const uploadFile = async ({
  file,
  extensions = validExtensions,
  folder = "",
}) => {
  return new Promise((resolve, reject) => {
    const fileExtension = path.extname(file.name).toLowerCase();
    console.log(`File extension: ${fileExtension}`);

    if (!extensions.includes(fileExtension)) {
      console.log("Invalid file type attempted:", file.name);
      return reject(
        `Invalid file type. Allowed types are: ${extensions.join(", ")}`
      );
    }

    const newName = `${uuidv4()}${path.extname(file.name)}`;
    const uploadPath = path.join(__dirname, "../uploads/", folder, newName);

    file.mv(uploadPath, (err) => {
      if (err) {
        console.log("File upload error:", err);
        return reject(`File upload failed: ${err}`);
      }
      console.log("File uploaded successfully:", newName);
      return resolve(newName);
    });
  });
};

export default uploadFile;
 