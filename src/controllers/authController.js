import { loginUser } from "../services/authService.js";
import jwt from "jsonwebtoken";

export async function loginController(req, res) {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ message: "Username/email and password are required" });
  }

  try {
    const user = await loginUser(username || email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid username/email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}