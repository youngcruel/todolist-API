import mongoose from 'mongoose'; 
import config from '../../config/config.js';    

//const db = process.env.MONGO_URI; // URL di connessione a MongoDB Atlas 

const connectDB = async () => {            
    try { 
        await mongoose.connect(config.db.connectionString);
        console.log("Connesso a MongoDB Atlas!"); 
    } catch (err) { 
        console.error("Errore di connessione a MongoDB:", err); 
        throw err; 
};
}

export default connectDB; 