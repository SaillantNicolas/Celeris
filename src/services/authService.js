const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("./dbService");

const JWT_SECRET =
  "d0177c410603a47f953302947b2c6ec4f160c2f9bb316b7446ae3b4a65e7b923688f4f1d4389a103a3f11898702dff87ed499eee7b6fb7aeb497ec13c58c50e33f94c2ae46a084a8b24c396f4e5782e6c7b4011ae6efdf59e62218eb19db6c375338e38f182fb644183822cca7c80128a8e6b807be9d3485e4a8808a0a183c1554a9b52841ed330f5208bb429526149af9431ff711450ffb82b97496806f277fde74c2522e94e46a7b3dbdecef7726429b95ab43e6c8445dbff74979a1cbc6e3fd121d8a4989cebe1cfde6461a69574668c4ac9984dfcff05b48b016bb309d7d887463ed4ec9a616af28a10fd85f3dbb0860928386127b86c80111ff779f9628";

exports.registerUser = async (userData) => {
  try {
    if (!userData.email || !userData.password) {
      throw new Error("Email et mot de passe requis");
    }

    const existingUsers = await query("SELECT id FROM users WHERE email = ?", [
      userData.email,
    ]);
    if (existingUsers.length > 0) {
      throw new Error("Cet email est déjà utilisé");
    }

    if (userData.password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const result = await query(
      "INSERT INTO users (name, firstname, email, password, phone_number, company_name) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userData.name,
        userData.firstname,
        userData.email,
        hashedPassword,
        userData.phoneNumber,
        userData.companyName,
      ]
    );

    return { id: result.insertId, email: userData.email };
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Email et mot de passe requis");
    }

    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      throw new Error("Utilisateur non trouvé");
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Mot de passe incorrect");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
