// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1/AgendaISC', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema para usuarios
const usuarioSchema = new mongoose.Schema({
  usuario: String,
  password: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Definir el esquema para clientes
const clienteSchema = new mongoose.Schema({
  nombre: String,
  apellidos: String,
  edad: Number,
  sexo: String,
  estadoCivil: String,
  telefono: String,
  ciudad: String,
  estado: String,
  codigoPostal: String,
  pais: String,
}, { collection: 'datospersonales' });

const Cliente = mongoose.model('Cliente', clienteSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'
app.set('view engine', 'ejs');

// Rutas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/quienes-somos', (req, res) => {
  res.render('quienesSomos');
});

app.get('/views', (req, res) => {
  res.render('login', { mensaje: null });
});

app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  // Buscar el usuario en la base de datos
  const usuarioEncontrado = await Usuario.findOne({ usuario, password });

  if (usuarioEncontrado) {
    // Si el usuario existe, redirigir a la página de CRUD (dashboard)
    res.redirect('/dashboard');
  } else {
    // Si el usuario no existe, mostrar un mensaje y ofrecer la opción de registrarte
    res.render('login', { mensaje: 'Usuario no encontrado. ¿Deseas registrarte?' });
  }
});

app.get('/registrar', (req, res) => {
  res.render('registro');
});

// Ruta para mostrar el dashboard con la lista de clientes
app.get('/dashboard', async (req, res) => {
  try {
    // Obtener la lista de clientes desde la base de datos
    const clientes = await Cliente.find();
    res.render('dashboard', { usuario: 'NombreDeUsuario', clientes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Agregar un nuevo cliente
app.post('/agregar-cliente', async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      edad,
      sexo,
      estadoCivil,
      telefono,
      ciudad,
      estado,
      codigoPostal,
      pais,
    } = req.body;

    await Cliente.create({
      nombre,
      apellidos,
      edad,
      sexo,
      estadoCivil,
      telefono,
      ciudad,
      estado,
      codigoPostal,
      pais,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Modificar un cliente
app.post('/modificar-cliente', async (req, res) => {
  try {
    const {
      clienteId,
      nombre,
      apellidos,
      edad,
      sexo,
      estadoCivil,
      telefono,
      ciudad,
      estado,
      codigoPostal,
      pais,
    } = req.body;

    await Cliente.findByIdAndUpdate(clienteId, {
      nombre,
      apellidos,
      edad,
      sexo,
      estadoCivil,
      telefono,
      ciudad,
      estado,
      codigoPostal,
      pais,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Eliminar un cliente
app.post('/eliminar-cliente', async (req, res) => {
    try {
      const clienteId = req.body.clienteId;
      await Cliente.findByIdAndRemove(clienteId);
      res.redirect('/dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });

// Salir o Logout
app.get('/logout', (req, res) => {
  res.redirect('/');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
