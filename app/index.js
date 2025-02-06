const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    const htmlResponse = `
        <html>
            <head>
                <title>NodeJs y Express en vercel</title>
            </head>
            <body>
                <h1>Soy un proyecto de backend en vercel</h1>
            </body>
        </html>
    `;
    res.send(htmlResponse);
});

app.listen(port, () =>{
    console.log(`port running in http://localhost:${port}`);
});



