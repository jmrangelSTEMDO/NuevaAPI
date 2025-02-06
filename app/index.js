const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


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

 
app.listen(port, () =>{
    console.log(`port running in http://localhost:${port}`);
});

function encryptData(data) {
    return CryptoJS.AES.encrypt(data,'0U370okyNsPAQ1nMnvy21Mu7MGi/8KbnNu9gfz14IX8=').toString();
  }

function validarEmail(email) {
    return emailRegex.test(email);
  }

