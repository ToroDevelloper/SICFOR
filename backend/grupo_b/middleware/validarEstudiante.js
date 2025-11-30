function validarEstudiante(req, res, next) {
  const {
    nombres,
    apellidos,
    tipo_documento,
    numero_identificacion,
    fecha_nacimiento,
    email
  } = req.body;

  if (!nombres || !apellidos || !tipo_documento || !numero_identificacion || !fecha_nacimiento || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const tiposValidos = ['CC', 'TI', 'CE', 'PASAPORTE'];
  if (!tiposValidos.includes(tipo_documento)) {
    return res.status(400).json({ error: 'Tipo de documento inválido' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  next();
}
module.exports = validarEstudiante;
