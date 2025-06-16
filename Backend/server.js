//Michael sidoruk, Nadav sayag class 49/1

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dataRoutes = require("./routes/dataRoutes");
const authRoutes = require("./auth/auth");
const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/generalData", dataRoutes);
app.use("/api/specificData", dataRoutes);
app.use("/api/user", dataRoutes);
app.use("/api/courses", dataRoutes);
app.use("/api/topic", dataRoutes);
app.use("/api/auth", authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

