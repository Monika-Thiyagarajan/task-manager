require('dotenv').config(); //load environmental variables
const express = require('express'); 
const connectDB = require('./config/db');
const routes = require('./routes/authRoutes');

const app = express();
app.use(express.json()) //handling middleware to parse json requests;
const cors = require("cors");

// Enable CORS
app.use(cors());

connectDB();

app.use('/api', require('./routes'));

const PORT = process.env.port || 5000;
app.use('/api',routes);
app.listen(PORT,()=>{
    console.log(`Server is listening to ${PORT}`);
})
