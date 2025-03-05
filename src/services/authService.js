import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/mongoConfig';

export const registerUser = async (userData) => {
  try {
    // Validation des données d'entrée
    if (!userData.email || !userData.password) {
      throw new Error('Email et mot de passe requis');
    }

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Cet email est déjà utilisé');
    }

    // Validation du mot de passe
    if (userData.password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Validation des données d'entrée
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Mot de passe incorrect');
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      },
      JWT_CONFIG.SECRET,
      { expiresIn: JWT_CONFIG.EXPIRES_IN }
    );

    return { 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }, 
      token 
    };
  } catch (error) {
    throw error;
  }
};

// Middleware d'authentification
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_CONFIG.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};