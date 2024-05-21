const express = require("express");
const app = express();
const routes = require("./routes.js"); // Archivo de las rutas

// Configuración de middleware para aceptar datos JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// usar archivo de rutas
app.use(routes)

app.listen(3000, () => {
  console.log("API escuchando en el puerto 3000");
});