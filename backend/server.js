const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api", require("./routes/slotRoutes"));
app.use("/api/airline", require("./routes/airlinesRoute"));
app.use("/api/counters", require("./routes/countersRoute"));
app.use("/api/aircraft", require("./routes/congestionRoute"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MONGODB_URI"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("backend is running on port :" + `${PORT}`);
});
