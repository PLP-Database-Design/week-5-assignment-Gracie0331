const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Parse JSON bodies
app.use(express.json());

// Create database connection
const db = mysql.createPool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
db.getConnection()
  .then((connection) => {
    connection.release();
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });


// Question 1: Retrieve all patients
app.get('/patients', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT patient_id, first_name, last_name, date_of_birth FROM patients');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patients' });
  }
});

// Question 2: Retrieve all providers
app.get('/providers', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT first_name, last_name, provider_specialty FROM providers');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving providers' });
  }
});

// Question 3: Filter patients by First Name
app.get('/patients/:firstName', async (req, res) => {
  try {
    const firstName = req.params.firstName;
    const [rows] = await db.execute('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [firstName]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patients' });
  }
});

// Question 4: Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', async (req, res) => {
  try {
    const specialty = req.params.specialty;
    const [rows] = await db.execute('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving providers' });
  }
});



// Listen to the server
const PORT = 3300;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Sending message to browser..")
app.get('/', (req,res) =>{
  res.send('Server started successfully')
})
