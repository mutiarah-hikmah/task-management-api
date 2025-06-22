const express = require('express');
const cors = require('cors');

require('dotenv').config();
require('./src/config/db');

const userRoutes = require('./src/routes/userRoutes'); 
const projectRoutes = require('./src/routes/projectRoutes.js'); 
const taskRoutes = require('./src/routes/taskRoutes.js'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Horeyy aku bisa');
});

app.use('/api/users', userRoutes); 
app.use('/api/projects', projectRoutes); 
app.use('/api/tasks', taskRoutes); 

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
}); 