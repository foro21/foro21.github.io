const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Ruta para el archivo de mensajes
const messagesFilePath = './messages.json';

// Arreglo para almacenar los mensajes (se cargará desde el archivo)
let messages = [];

// Verificar si el archivo messages.json existe, y cargar los mensajes desde allí
if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath, 'utf8');
    messages = JSON.parse(data);
}

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de multer para el manejo de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Crear carpeta de uploads si no existe
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Ruta para mostrar los mensajes
app.get('/posts', (req, res) => {
    res.json(messages);
});

// Ruta para recibir el formulario de mensajes
app.post('/submit', upload.single('file'), (req, res) => {
    const { username, message } = req.body;
    const file = req.file ? `/uploads/${req.file.filename}` : null;

    // Crear un nuevo mensaje
    const newMessage = {
        username,
        message,
        file,
        timestamp: new Date().toISOString()
    };

    // Agregar el mensaje al arreglo
    messages.push(newMessage);

    // Guardar los mensajes en el archivo JSON
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf8');

    res.send('Mensaje enviado con éxito');
});

// Servir archivos estáticos (como imágenes o CSS)
app.use(express.static('public'));
app.use(express.static('uploads'));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
