const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/notes", require("./routes/noteRoutes"));

mongoose
  .connect("mongodb://127.0.0.1:27017/noteapp")
  .then(() => {
    console.log("Đã kết nối MongoDB");

    app.listen(5000, () => {
      console.log("Server chạy tại cổng 5000");
    });
  })
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error.message);
  });