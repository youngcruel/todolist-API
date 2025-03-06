import mongoose from 'mongoose';
import config from '../../config/config.js';

const connectDB = async () => { 
    try {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`),
                console.log('MongoDB connesso')
    } catch (err) {
        console.error(err);
        throw err;
    }
}
export default connectDB;