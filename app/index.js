const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
var cors = require('cors');

var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:4200/inicio',
  'http://localhost:8000',
  'http://192.168.88.167',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app',
  'https://loginmicrosoftonlinecom-sergios-projects-d4c71fde.vercel.app'
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    console.log(origin);
    
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));


const { createClient } = require('@supabase/supabase-js');

// //app.use(express.static('public'))

const supabaseUrl = 'https://cmzgqyfvwnsxrbinxkjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA';
const supabase = createClient(supabaseUrl, supabaseKey);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CryptoJS = require('crypto-js');
const SECRET_KEY='0U370okyNsPAQ1nMnvy21Mu7MGi/8KbnNu9gfz14IX8=';

app.get("/", (req, res) => {
    res.send("bienvenido a mi api");
});

app.post("/api/usuarios", async(req, res) => {
    if (validarEmail(req.body.email)) {
      try {
        const encryptedData = encryptData(req.body.email);
        
        const { data, error } = await supabase
          .from('usuarios')
          .insert([{ email: encryptedData }])
          .select();
        if (error) throw error;
        return res.status(201).json({ message: 'Datos encriptados insertados correctamente' });
      } catch (error) {
        console.error('Error al insertar usuario:', error.message);
        return res.status(400).json({ error: error.message });
      }
    } else {
      return res.status(400).json({ error: 'El correo electrónico introducido no es válido.' });;
    }
  });
  
app.get('/api/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error;
    return res.status(201).json({ data })
  } catch (error) {
    console.error("Error al leer la tabla:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

  app.get('/api/csv', async (req, res) => {
    let json = [];
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*');
        data.forEach(element => {
          let emailD = CryptoJS.AES.decrypt(element.email, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
          json.push({
            id: element.id,
            email: emailD,
            fechaRegistro: element.fechaRegistro
          });
    
        });
    
      } catch (e) {
    
      }
      json = JSON.stringify(json);
      let csv = jsonToCsv(json);
      csv = CryptoJS.AES.encrypt(csv, SECRET_KEY).toString();
      res.header('Content-Type', 'text/csv');
      res.attachment('datos.csv');
      res.send(csv);
  });

 
app.listen(port, () =>{
    console.log(`port running in http://localhost:${port}`);
});

function encryptData(data) {
    return CryptoJS.AES.encrypt(data,'0U370okyNsPAQ1nMnvy21Mu7MGi/8KbnNu9gfz14IX8=').toString();
  }

function validarEmail(email) {
    return emailRegex.test(email);
  }
  
  function jsonToCsv(json) {
    const items = JSON.parse(json);
    const header = Object.keys(items[0]).join(',');
    const rows = items.map(item => Object.values(item).join(',')).join('\n');
    return `${header}\n${rows}`;
  }
