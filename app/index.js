const express = require("express");
var cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.static('public'))


const supabaseUrl = 'https://cmzgqyfvwnsxrbinxkjk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtemdxeWZ2d25zeHJiaW54a2prIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODU3MjU5MCwiZXhwIjoyMDU0MTQ4NTkwfQ.DSRew9cWsqX22HZIR6JkxDr5F7lAdxQbT4R5XqYYaUA';
const supabase = createClient(supabaseUrl, supabaseKey);
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CryptoJS = require('crypto-js');
const SECRET_KEY='0U370okyNsPAQ1nMnvy21Mu7MGi/8KbnNu9gfz14IX8=';


var allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4200',
  'http://localhost:4200/inicio',
  'http://localhost:8000',
  'http://192.168.88.167',
  'https://loginmicrosoftonlinecom-git-master-sergios-projects-d4c71fde.vercel.app',
  'http://localhost:9000',
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
      'allow access from the specified Origin.';
      return callback(new Error(msg), false);
      
    }
    return callback(null, true);
  }
}));

app.use(express.json());

//rutas
app.get("/",(req,res) => {
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


app.post('/convert', async (req, res) => {
  
  let  json = [];
  try{
    
    const { data, error } = await supabase
    .from('usuarios')
    .select('*');
    // console.log(data);
    json = data;
  }catch (e){
    
  }
  json = JSON.stringify(json);
  const csv = jsonToCsv(json);
  res.header('Content-Type', 'text/csv');
  res.attachment('datos.csv');
  // console.log(csv);
  res.send(csv);
});

const port = process.env.PORT || 9000;
app.listen(port, () => console.log("servidor saliendo por puerto ", port));

function validarEmail(email) {
  return emailRegex.test(email);
}

function encryptData(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

function jsonToCsv(json) {
  const items = JSON.parse(json);
  const header = Object.keys(items[0]).join(',');
  const rows = items.map(item => Object.values(item).join(',')).join('\n');
  return `${header}\n${rows}`;
}
