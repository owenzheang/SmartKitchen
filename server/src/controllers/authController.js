import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "../database.js";

const JWT_SECRET = process.env.JWT_SECRET || "smartkitchen-secret-key";
const SALT_ROUNDS = 10;

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM users WHERE email = ?", [email], (error, user) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(user);
    });
  });
}

function createUser(email, hashedPassword) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    database.run(sql, [email, hashedPassword], function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({ id: this.lastID, email });
    });
  });
}

function createToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d"
  });
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser(email, hashedPassword);
    const token = createToken(user);

    res.status(201).json({
      message: "Registration successful.",
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
