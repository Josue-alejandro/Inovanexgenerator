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

// Endpoint para obtener una radio especifica
routes.get('/radioget/:name', async (req, res) => {
  const { name } = req.params
  const sql = `SELECT * FROM users WHERE name = ' ${name}'`;
  let user = null;
  let station = null;
  let config = null;

  try {
    db.query(sql, (err, data) => {
      user = data[0];

      const sqlradios = `SELECT * FROM stations WHERE id_station = '${user.id_station}'`;
      console.log(sqlradios)
      db.query(sqlradios, async (err, data) => {
        station = data

        for (let index = 0; index < station.length; index++) {
          const element = station[index];

          if(station[index].programming){
            const programmingLinks = station[index].programming.split(',')

            if(programmingLinks[0] !== ''){
              try{
                const respuesta = await fetch(programmingLinks[0]);
                const response = await respuesta.json()
                station[index].programming = response.radio.programming
              }catch(response){
                console.log(response)
              }
            }
          }
        }

        const sqlconfig = `SELECT * FROM config WHERE id_station = '${user.id_station}'`
        db.query(sqlconfig, async (err, data) => {
          config = data

          const radioData = {
            user,
            station,
            config,
  
          }

          console.log(radioData)
          
          res.json(radioData)

        })
        
      })
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
  const singleId = generateString(7);
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

    

    console.log(stationData)

    stationData.forEach(val => {

      let audioLinks = [];
      let metadataLinks = [];
      let programmingLinks = [];

      val.station_links.forEach(val => {
        audioLinks.push(val.link);
        metadataLinks.push(val.metadata);
        programmingLinks.push(val.programming)
      })
      const sql = `INSERT INTO stations (id_station, station_name, station_links, metadata, programming, slogan)
      VALUES ('${singleId}', '${val.station_name}', '${audioLinks}', '${metadataLinks}', '${programmingLinks}', '${val.slogan}');`

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
    const sql = `INSERT INTO config (id_station, multiradio, metadata, default_name, default_slogan, logo_img, json_cover, color, color2, font) 
    VALUES ('${singleId}' ,'${configData.multiradio}', '${configData.metadata}', '${configData.default_name}', '${configData.default_slogan}', '${configData.logo_img}', '${configData.json_cover}', '${configData.color}', '${configData.color2}', '${configData.font}');`

    // Se insertan los datos en la tabla
  try{
    db.query(sql, (err, data) => {
      console.log(err)
      res.json({name: userName})
    })
  } catch (error){
    console.log(error)
    res.json({message: "Server Error"})
  }
  }
  
});


module.exports = routes;