const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./db/Connect.js");
const authRoute = require("./routes/Auth");
const usersRoute = require("./routes/Users");
const postsRoute = require("./routes/Posts");
const categoryRoute = require("./routes/Categories");

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/v1", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/posts", postsRoute);
app.use("/api/v1/categories", categoryRoute);

const start = async () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
