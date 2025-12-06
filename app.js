const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
app.use(cors());


const estudiantesRoutes = require('./backend/grupo_b/routes/estudiantes');

app.use(express.json());
app.use('/estudiantes', estudiantesRoutes);
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/grupo_b')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
