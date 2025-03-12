//VERSIONE VECCHIA (PER USO CON MONGO DB LOCALE)
///////////////////////////////////////////////////////////////////////////////////////////////
/*
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
*/
///////////////////////////////////////////////////////////////////////////////////////////////
//VERSIONE NUOVA (PER USO CON MONGO DB ATLAS)
///////////////////////////////////////////////////////////////////////////////////////////////

import mongoose from 'mongoose'; // Importa il modulo mongoose per la connessione a MongoDB
import config from '../../config/config.js';   //Importa la configurazione del server e del database da config.js 
                                               //inclusa la stringa di connessione al database MongoDB Atlas  

//const db = process.env.MONGO_URI; // URL di connessione a MongoDB Atlas 

const connectDB = async () => {      //Una funzione asincrona che tenta di connettersi a MongoDB utilizzando 
                                     //la stringa di connessione fornita in config.db.connectionString.             
    try { //Blocco try: Tenta di connettersi al database.
        await mongoose.connect(config.db.connectionString); //Utilizza mongoose per connettersi al database MongoDB con la stringa di connessione specificata.
        console.log("Connesso a MongoDB Atlas!"); //Se la connessione ha successo, stampa un messaggio di conferma.
    } catch (err) { //Blocco catch: Gestisce eventuali errori di connessione.
        console.error("Errore di connessione a MongoDB:", err); //Stampa l'errore in console.
        throw err; // Rilancia l'errore se vuoi gestirlo a livello superiore (ad esempio, nel server.js).
    }
};

export default connectDB; //Esporta la funzione connectDB per poterla utilizzare in altri file dell'applicazione.

//In questo snippet di codice, ho creato un file db.js che contiene la logica per connettersi a MongoDB utilizzando la stringa di connessione fornita in config.js.
//Ho importato il modulo mongoose per la connessione a MongoDB e la configurazione del server e del database da config.js, inclusa la stringa di connessione al database MongoDB Atlas.
//Ho creato una funzione asincrona connectDB che tenta di connettersi a MongoDB utilizzando la stringa di connessione fornita in config.db.connectionString.
//Ho utilizzato il metodo mongoose.connect per connettersi al database MongoDB con la stringa di connessione specificata.
//Ho gestito eventuali errori di connessione e stampato un messaggio di conferma se la connessione ha successo.
//Infine, ho esportato la funzione connectDB per poterla utilizzare in altri file dell'applicazione.

//Questo file è responsabile della connessione a MongoDB utilizzando la stringa di connessione fornita in config.js.
//In sintesi, questo modulo si occupa di stabilire una connessione a un database MongoDB utilizzando mongoose 
//e una stringa di connessione specificata nella configurazione. 
//Se la connessione ha successo, viene stampato un messaggio di conferma; 
//in caso di errore, viene stampato un messaggio di errore e l'errore viene rilanciato.