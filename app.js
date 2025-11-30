const express = require('express');
const app = express();
require('dotenv').config();

const estudiantesRoutes = require('./backend/grupo_b/routes/estudiantes');

app.use(express.json());
app.use('/estudiantes', estudiantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
