import config from './config/config.js';
import express from 'express';
import connectDB from './src/gateway/db.js';
import setup from './src/routes/activityRoutes.js';

const app = express(); // Crea un'istanza di Express e la assegna alla costante app 
app.use(express.json()); // Middleware per il parsing del corpo della richiesta in formato JSON 


// try {  // Funzione asincrona per avviare il server Express e connettersi al database MongoDB locale
//     await connectDB();
//     setup(app);
//     app.listen(config.port, config.host, () => {
//         console.log(`Server partito su http://${config.host}:${config.port}`);
//     });
    
// } catch (err) {
//     console.log('server not started', err.message);
//     process.exit(1);
// }


const startServer = async () => { // Funzione asincrona per avviare il server Express e connettersi al database MongoDB Atlas
    try {
        await connectDB(); // Connessione al DB Atlas tramite la funzione connectDB definita in src/gateway/db.js 

        setup(app); // Configura le rotte dell'applicazione

        app.listen(config.port, config.host, () => { // Avvia il server Express sulla porta e sull'host specificati in config.js
            console.log(`Server partito su http://${config.host}:${config.port}`);
        });

    } catch (err) { // Gestione degli errori
        console.error('Server not started:', err.message); // Stampa un messaggio di errore se il server non può essere avviato
        process.exit(1); // Termina il processo con codice di uscita 1
    } 
};

// Avvia il server
startServer(); // Chiamata alla funzione startServer per avviare il server Express e connettersi al database MongoDB Atlas
