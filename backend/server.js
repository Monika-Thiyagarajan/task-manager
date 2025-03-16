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

app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes'));

app.get('/api/health', (req, res) => {
    res.json({ message: "API is running!" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is listening to ${PORT}`);
})
