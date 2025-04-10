require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Permite recibir JSON en las peticiones

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u855233599_axel',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'u855233599_reportes_db'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err);
    process.exit(1); // Detiene la ejecución si hay un error
  } else {
    console.log('✅ Conectado a la base de datos MySQL');
  }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de reportes y mecánicos');
});

// Ruta para obtener todos los reportes
app.get('/api/reports', (req, res) => {
  const sql = 'SELECT * FROM reportes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener reportes:', err);
      res.status(500).json({ error: 'Error al obtener reportes' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar un nuevo reporte
app.post('/api/reports', (req, res) => {
  console.log('📥 Datos recibidos:', req.body); // 🔍 Verifica qué datos llegan al servidor

  const { matricula, encargado, fechaIngreso, problema, reparaciones } = req.body;
  const fechaSalida = req.body.fechaSalida ? req.body.fechaSalida : null; // Si no se envía, será NULL

  if (!matricula || !encargado || !fechaIngreso || !problema) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = 'INSERT INTO reportes (matricula, encargado, fechaIngreso, fechaSalida, problema, reparaciones) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [matricula, encargado, fechaIngreso, fechaSalida, problema, reparaciones || null];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al guardar el reporte:', err);
      return res.status(500).json({ error: 'Error al guardar el reporte' });
    }

    console.log('✅ Reporte guardado con éxito:', result);
    res.status(201).json({ message: '✅ Reporte guardado con éxito', id: result.insertId });
  });
});

app.put('/api/reports/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Actualizando reporte con ID: ${id}`); // Agregar log aquí
  const { matricula, fechaIngreso, encargado, problema, reparaciones, fechaSalida } = req.body;

  try {
    db.query(
      'UPDATE reportes SET matricula = ?, fechaIngreso = ?, encargado = ?, problema = ?, reparaciones = ?, fechaSalida = ? WHERE id = ?',
      [matricula, fechaIngreso, encargado, problema, reparaciones, fechaSalida, id],
      (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar reporte:', err);
          res.status(500).json({ error: 'Error al actualizar reporte' });
        } else {
          if (result.affectedRows > 0) {
            res.json({ message: 'Reporte actualizado' });
          } else {
            res.status(404).json({ error: 'Reporte no encontrado' });
          }
        }
      }
    );
    
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ message: 'Error al actualizar reporte' });
  }
});


// ** Nuevas rutas para mecánicos **

// Ruta para obtener todos los mecánicos (ahora /api/users)
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM mecanicos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los mecánicos:', err);
      res.status(500).json({ error: 'Error al obtener los mecánicos' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para agregar un nuevo mecánico
app.post('/api/mechanic', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para agregar un mecánico' });
  }

  const sql = 'INSERT INTO mecanicos (nombre, email, password) VALUES (?, ?, ?)';
  const values = [nombre, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al agregar el mecánico:', err);
      return res.status(500).json({ error: 'Error al agregar el mecánico' });
    }

    res.status(201).json({ message: '✅ Mecánico agregado con éxito', id: result.insertId });
  });
});
// Ruta para agregar un nuevo mecánico
app.post('/api/users', (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para agregar un mecánico' });
  }

  const sql = 'INSERT INTO mecanicos (nombre, email, password) VALUES (?, ?, ?)';
  const values = [nombre, email, password];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al agregar el mecánico:', err);
      return res.status(500).json({ error: 'Error al agregar el mecánico' });
    }

    res.status(201).json({ message: '✅ Mecánico agregado con éxito', id: result.insertId });
  });
});


// Ruta para actualizar un mecánico
app.put('/api/mechanic/:id', (req, res) => {
  const { nombre, email, password } = req.body;
  const { id } = req.params;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios para actualizar el mecánico' });
  }

  const sql = 'UPDATE mecanicos SET nombre = ?, email = ?, password = ? WHERE id = ?';
  const values = [nombre, email, password, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el mecánico:', err);
      return res.status(500).json({ error: 'Error al actualizar el mecánico' });
    }

    res.json({ message: '✅ Mecánico actualizado con éxito' });
  });
});

// Ruta para eliminar un mecánico
app.delete('/api/mechanic/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM mecanicos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el mecánico:', err);
      return res.status(500).json({ error: 'Error al eliminar el mecánico' });
    }

    res.json({ message: '✅ Mecánico eliminado con éxito' });
  });
});

// Ruta para agregar un vehículo
app.post('/api/vehiculos', (req, res) => {
  const { marca, modelo, anio, chofer, placa } = req.body;

  if (!marca || !modelo || !anio || !chofer || !placa) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = 'INSERT INTO vehiculos (marca, modelo, anio, chofer, placa) VALUES (?, ?, ?, ?, ?)';
  const values = [marca, modelo, anio, chofer, placa];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Error al guardar el vehículo:', err);
      return res.status(500).json({ error: 'Error al guardar el vehículo' });
    }

    console.log('✅ Vehículo guardado con éxito:', result);
    res.status(201).json({ message: '✅ Vehículo guardado con éxito', id: result.insertId });
  });
});

// Definir la ruta para obtener los vehículos
app.get('/api/vehiculos', (req, res) => {
  const sql = 'SELECT * FROM vehiculos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener vehículos:', err);
      return res.status(500).json({ error: 'Error al obtener los vehículos' });
    }
    res.json(results);
  });
});

// Ruta para actualizar un vehículo
app.put('/api/vehiculos/:id', (req, res) => {
  const { id } = req.params;
  const { marca, modelo, anio, chofer, placa } = req.body;

  const sql = 'UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, chofer = ?, placa = ? WHERE id = ?';
  db.query(sql, [marca, modelo, anio, chofer, placa, id], (err, result) => {
    if (err) {
      console.error('❌ Error al actualizar el vehículo:', err);
      return res.status(500).json({ error: 'Error al actualizar el vehículo' });
    }
    res.json({ message: 'Vehículo actualizado correctamente' });
  });
});


// Ruta para eliminar un vehículo
app.delete('/api/vehiculos/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM vehiculos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Error al eliminar el vehículo:', err);
      return res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }

    res.json({ message: '✅ Vehículo eliminado con éxito' });
  });
});

// ** Ruta para inicio de sesión de mecánico **
app.post('/api/login/mechanic', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = 'SELECT * FROM mecanicos WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('❌ Error al iniciar sesión:', err);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Mecánico no encontrado' });
    }

    const mechanic = results[0];

    if (mechanic.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', userId: mechanic.id, role: 'mecanico' });
  });
});

// ** Ruta para inicio de sesión de administrador **
app.post('/api/login/admin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = 'SELECT * FROM admins WHERE email = ?';  // Cambiado a 'admins'
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('❌ Error al iniciar sesión:', err);
      return res.status(500).json({ error: 'Error al iniciar sesión' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    const admin = results[0];

    if (admin.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', userId: admin.id, role: 'admin' });
  });
});




// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
