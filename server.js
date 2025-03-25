// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authService = require('./src/services/authService');
const reportService = require('./src/services/reportService');
const interventionService = require('./src/services/interventionService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes d'authentification

app.post('/api/auth/register', async (req, res) => {
    console.log('Tentative d\'inscription:', req.body);
    try {
      const result = await authService.registerUser(req.body);
      console.log('Inscription réussie:', result);
      res.status(201).json(result);
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message);
      res.status(400).json({ error: error.message });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    console.log('Tentative de connexion:', req.body.email);
    try {
      const { email, password } = req.body;
      const result = await authService.loginUser(email, password);
      console.log('Connexion réussie:', result.user.email);
      res.json(result);
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
      res.status(400).json({ error: error.message });
    }
  });

// Routes de rapports (protégées)
app.post('/api/reports', authService.authenticateToken, async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const result = await reportService.createReport(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports', authService.authenticateToken, async (req, res) => {
  try {
    const reports = await reportService.getReports(req.user.id);
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/reports/:id', authService.authenticateToken, async (req, res) => {
  try {
    const report = await reportService.getReportById(req.params.id, req.user.id);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Routes d'interventions (protégées)
app.get('/api/interventions/upcoming', authService.authenticateToken, async (req, res) => {
  try {
    const interventions = await interventionService.getUpcomingInterventions(req.user.id);
    res.json(interventions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/interventions/ongoing', authService.authenticateToken, async (req, res) => {
  try {
    const interventions = await interventionService.getOngoingInterventions(req.user.id);
    res.json(interventions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/interventions/history', authService.authenticateToken, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const interventions = await interventionService.getInterventionHistory(req.user.id, limit);
    res.json(interventions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/interventions', authService.authenticateToken, async (req, res) => {
  try {
    req.body.assignedUserId = req.user.id;
    const result = await interventionService.createIntervention(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/interventions/:id/status', authService.authenticateToken, async (req, res) => {
  try {
    const result = await interventionService.updateInterventionStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});