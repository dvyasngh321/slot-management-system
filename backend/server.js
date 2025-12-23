const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api", require("./routes/slotRoutes"));
app.use("/api/airline", require("./routes/airlinesRoute"));

mongoose
  .connect("mongodb://localhost:27017/abc")
  .then(() => console.log("MONGODB_URI"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("backend is running on port :" + `${PORT}`);
});
