import config from './config/config.js';
import express from 'express';
import connectDB from './src/gateway/db.js';
import setup from './src/routes/activityRoutes.js';

const app = express();
app.use(express.json());

try {
    await connectDB();
    setup(app);
    app.listen(config.port, config.host, () => {
        console.log(`Server partito su http://${config.host}:${config.port}`);
    });
    
} catch (err) {
    console.log('server not started', error.message);
    process.exit(1);
}
