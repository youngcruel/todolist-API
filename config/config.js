import dotenv from 'dotenv'; //Importazione modulo dotenv per la gestione delle variabili d'ambiente
dotenv.config(); //Chiamata al metodo config() del modulo dotenv per caricare le variabili d'ambiente dal file .env

const config = {   //Creazione di un oggetto config con le variabili d'ambiente
    dbFile: 'activity.db', //Nome del file del database
    host: 'localhost',    //Host del server
    port: 8000,           //Porta del server
    db: {
        //host: 'localhost',  //Versione vecchia per usare il database locale
        //port: 27017, 
        //name: 'todolist'
        connectionString: process.env.MONGO_URI //Stringa di connessione al database MongoDB Atlas
    },
    mailConfig: {                          //Configurazione del servizio di posta elettronica
        host: 'smtp.gmail.com',            //Un oggetto che contiene le configurazioni per il server SMTP, inclusi l'host, la porta, la sicurezza
        port: 465,                         //La porta 465 è la porta standard per la sicurezza SSL
        secure: true,                     //La sicurezza è abilitata
        auth: {                         //Le credenziali di autenticazione sono prese dalle variabili d'ambiente MAIL_USER e MAIL_PASS
            user: process.env.MAIL_USER,   //Nome utente
            pass: process.env.MAIL_PASS    //Password
        }
    },
    accessTokenExpiration: 3600,   //3600s ovvero 1h, expiration del token di accesso
    refreshTokenExpiration: 86400,   //1 mese, expiration del token di refresh
  }
export default config; //Esportazione dell'oggetto config

//In questo snippet di codice, ho creato un file di configurazione config.js che contiene le variabili d'ambiente per l'applicazione.
//Ho importato il modulo dotenv per caricare le variabili d'ambiente dal file .env.
//Ho creato un oggetto config con le variabili d'ambiente per il file del database, l'host e la porta del server e la stringa di connessione al database MongoDB Atlas.
//Ho creato un oggetto mailconfig con le configurazioni per il servizio di posta elettronica, inclusi l'host, la porta, la sicurezza e le credenziali di autenticazione.
//Ho esportato l'oggetto config per poterlo utilizzare in altri file dell'applicazione.

//Questo file di configurazione contiene le variabili d'ambiente necessarie per l'applicazione, come il file del database, l'host e la porta del server e la stringa di connessione al database MongoDB Atlas.
//Queste variabili possono essere utilizzate per configurare l'applicazione in base all'ambiente in cui viene eseguita, ad esempio locale o di produzione.
//Le variabili d'ambiente sono caricate dal file .env utilizzando il modulo dotenv, che consente di mantenere le informazioni sensibili separate dal codice sorgente.
//In questo modo, le variabili d'ambiente possono essere facilmente gestite e aggiornate senza dover modificare il codice sorgente dell'applicazione.
//Questo file di configurazione fornisce un modo flessibile per configurare l'applicazione in base alle esigenze specifiche dell'ambiente in cui viene eseguita.