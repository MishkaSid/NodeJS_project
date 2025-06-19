const db = require("../dbConnection");
const bcrypt = require("bcrypt");

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query("SELECT * FROM users WHERE UserID = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error in getUserById:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  let { UserID, Name, Email, Password, Role, CourseID } = req.body;

  if (Role === "Examinee") {
    Password = UserID.toString();
  }
  Password = Password.toString().trim();
  const hashedPassword = await bcrypt.hash(Password, 10);

  try {
    const connection = await db.getConnection();
    const [result] = await connection.query(
      "INSERT INTO users (UserID, Name, Email, Password, Role, CourseID) VALUES (?, ?, ?, ?, ?, ?)",
      [UserID, Name, Email, hashedPassword, Role, CourseID]
    );

    res.status(201).json({ UserID, Name, Email, Role, CourseID });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { Name, Email, Role } = req.body;

  try {
    const connection = await db.getConnection();
    await connection.query(
      "UPDATE users SET Name = ?, Email = ?,  Role = ? WHERE UserID = ?",
      [Name, Email, Role, id]
    );
    res.json({ Name, Email, Role });
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await db.getConnection();
    await connection.query("DELETE FROM users WHERE UserID = ?", [id]);
    res.json({ message: `User with ID ${id} deleted` });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ error: "Server error" });
  }
};
