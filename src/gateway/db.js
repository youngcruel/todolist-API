/*import mongoose from 'mongoose'; 
import config from '../../config/config.js';    
import { MongoMemoryServer } from 'mongodb-memory-server';
//const db = process.env.MONGO_URI; // URL di connessione a MongoDB Atlas 

const connectDB = async () => {            
    try { 
        if(process.env.NODE_ENV === "test"){
            const memoryServer = await MongoMemoryServer.create();
            await mongoose
            .connect(memoryServer
                .getUri(), {dbName: process.env.DB_NAME});
                console.log("Connesso a memoryDb!")
        }else {
            await mongoose.connect(config.db.connectionString);
            console.log("Connesso a MongoDB Atlas!"); 
        }
    } catch (err) { 
        console.error("Errore di connessione a MongoDB:", err); 
        throw err; 
};
}

export default connectDB; */

import mongoose from 'mongoose'; 
import config from '../../config/config.js';    
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

const connectDB = async () => {            
    try { 
        if (process.env.NODE_ENV === "test") {
            memoryServer = await MongoMemoryServer.create();
            const uri = await memoryServer.getUri();
            await mongoose.connect(uri, { dbName: process.env.DB_NAME });
            console.log("✅ Connesso a memoryDb!");
        } else {
            await mongoose.connect(config.db.connectionString);
            console.log("✅ Connesso a MongoDB Atlas!"); 
        }
    } catch (err) { 
        console.error("❌ Errore di connessione a MongoDB:", err); 
        throw err; 
    }
};

export const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (memoryServer) await memoryServer.stop();
    console.log("🛑 MemoryDB chiuso!");
};

export default connectDB;
