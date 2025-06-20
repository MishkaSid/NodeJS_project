const db = require("../dbConnection");
const path = require("path");
const multer = require("multer");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// File upload endpoint
exports.uploadFile = [
  upload.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  },
];

// Fetch all practice exercises
exports.getAllExercises = async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query("SELECT * FROM practice_exercise");
    res.json(rows);
  } catch (err) {
    console.error("Error in getAllExercises:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch a single exercise by ID
exports.getExerciseById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query("SELECT * FROM practice_exercise WHERE ExerciseID = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error in getExerciseById:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new exercise
exports.createExercise = async (req, res) => {
  const { TopicID, ContentType, ContentValue, AnswerOptions, CorrectAnswer } = req.body;
  try {
    const connection = await db.getConnection();
    const [result] = await connection.query(
      "INSERT INTO practice_exercise (TopicID, ContentType, ContentValue, AnswerOptions, CorrectAnswer) VALUES (?, ?, ?, ?, ?)",
      [TopicID, ContentType, ContentValue, JSON.stringify(AnswerOptions), CorrectAnswer]
    );
    res.status(201).json({ ExerciseID: result.insertId, TopicID, ContentType, ContentValue, AnswerOptions, CorrectAnswer });
  } catch (err) {
    console.error("Error in createExercise:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update an exercise
exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const { TopicID, ContentType, ContentValue, AnswerOptions, CorrectAnswer } = req.body;
  try {
    const connection = await db.getConnection();
    await connection.query(
      "UPDATE practice_exercise SET TopicID = ?, ContentType = ?, ContentValue = ?, AnswerOptions = ?, CorrectAnswer = ? WHERE ExerciseID = ?",
      [TopicID, ContentType, ContentValue, JSON.stringify(AnswerOptions), CorrectAnswer, id]
    );
    res.json({ ExerciseID: id, TopicID, ContentType, ContentValue, AnswerOptions, CorrectAnswer });
  } catch (err) {
    console.error("Error in updateExercise:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an exercise
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await db.getConnection();
    await connection.query("DELETE FROM practice_exercise WHERE ExerciseID = ?", [id]);
    res.json({ message: `Exercise with ID ${id} deleted` });
  } catch (err) {
    console.error("Error in deleteExercise:", err);
    res.status(500).json({ error: "Server error" });
  }
}; 