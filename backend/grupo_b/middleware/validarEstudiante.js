function validarEstudiante(req, res, next) {
  const {
    nombres,
    apellidos,
    tipo_documento,
    numero_identificacion,
    fecha_nacimiento,
    email
  } = req.body;

  // 1. Campos obligatorios
  if (!nombres || !apellidos || !tipo_documento || !numero_identificacion || !fecha_nacimiento || !email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  // 2. Tipo de documento válido
  const tiposValidos = ['CC', 'TI', 'CE', 'PASAPORTE'];
  if (!tiposValidos.includes(tipo_documento)) {
    return res.status(400).json({ error: 'Tipo de documento inválido' });
  }

  // 3. Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  // 4. Longitud máxima/mínima de nombres y apellidos
  if (nombres.length > 100 || apellidos.length > 100) {
    return res.status(400).json({ error: 'Nombres o apellidos demasiado largos' });
  }

  // 5. Número de identificación: numérico y longitud razonable
  if (!/^\d+$/.test(numero_identificacion)) {
    return res.status(400).json({ error: 'Número de identificación debe ser numérico' });
  }
  if (numero_identificacion.length < 5 || numero_identificacion.length > 20) {
    return res.status(400).json({ error: 'Número de identificación inválido en longitud' });
  }

  // 6. Fecha de nacimiento válida y no futura
  const fecha = new Date(fecha_nacimiento);
  if (isNaN(fecha.getTime())) {
    return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
  }
  if (fecha > new Date()) {
    return res.status(400).json({ error: 'La fecha de nacimiento no puede ser futura' });
  }

  next();
}

module.exports = validarEstudiante;
