const express = require('express');
const routes = express.Router();
const db = require('./db.js');
const { generateString, currentDate, findAdmin } = require('./functions.ts')

// Endpoint para obtener la data de los reproductores
routes.get('/playerdata', (req, res) => {
  const sql = "SELECT * FROM users";

  try {
    db.query(sql, (err, data) => {
      res.json(data)
    })
  } catch (error) {
    console.log(error)
    res.json({message: "Server Error"})
  }

})

// Endpoint para iniciar sesion con las cuentas de admin
routes.post("/login", (req, res) => {
  const {mail, password} = req.body;
  const sql = "SELECT * FROM admins";
  
  try {
    db.query(sql, (err, data) => {
      const admins = data;

      // Encontrar usuario en el array
      const admin = findAdmin(admins, mail, password);

      if(admin !== null){
        res.json({message: "Login Success"})
      }else{
        res.json({message: "admin not found"})
      }
    })

  } catch (error) {
    console.log(error)
  }
  
})

// Endpoint para generar un reproductor mas usuario generico
routes.post("/create", (req, res) => {
  // Se reune la data enviada por el generador
  const singleId = req.body.singleId
  const stationData = req.body.station;
  const configData = req.body.config;
  const userName = generateString(10);
  const password = generateString(25)

  // Generar data del user
  if(stationData){
    const date = currentDate()
    console.log(date)
    const sql = `INSERT INTO users (name, password, creation_date, id_config, id_station)
      VALUES ('${userName}', '${password}', '${date}','${singleId}', '${singleId}');`
    console.log(sql)

    try {
      db.query(sql, (err, data) => {
        console.log('insertado correctamente')
      })
    } catch (error) {
      console.log(error)
      res.json({message: "Server Error"})
    }
  }

  if(stationData){ // Si stationData existe sigue
    stationData.forEach(val => {

      const sql = `INSERT INTO stations (id_station, station_name, station_links)
      VALUES ('${singleId}', '${val.station_name}', '${val.station_links}');`

      // Se insertan los datos en la tabla
      try {
        db.query(sql, (err, data) => {
          console.log(err)
          console.log("insertado correctamente")
        })
      } catch (error) {
        console.log(error)
        res.json({message: "Server Error"})
      }

    });

  }

  // Si existe la config insertarlo en la base de datos
  if(configData){
    const sql = `INSERT INTO config (id_station, multiradio, metadata, default_slogan, logo_img, json_cover)
      VALUES ('${singleId}' ,'${configData.multiradio}', '${configData.metadata}', '${configData.default_slogan}', '${configData.logo_img}', '${configData.json_cover}');`

    // Se insertan los datos en la tabla
  try{
    db.query(sql, (err, data) => {
      console.log(err)
      res.json({message: "Endpoint executed succesfully"})
    })
  } catch (error){
    console.log(error)
    res.json({message: "Server Error"})
  }
  }
  
});


module.exports = routes;