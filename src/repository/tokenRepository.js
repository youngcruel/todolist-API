// Questo codice definisce un modulo JavaScript che gestisce l'aggiunta di token di registrazione per gli utenti 
// in un database utilizzando uno schema di Mongoose

import tokenSchema from '../schema/registrationTokenSchema.js'; // Importo lo schema tokenSchema (Schema di Mongoose) per interagire con il database.
// Viene importato lo schema tokenSchema dal file registrationTokenSchema.js. Questo schema definisce la struttura del documento nel database
// per memorizzare i token di registrazione degli utenti.

// La funzione add è una funzione asincrona che accetta due parametri: userId e token. 
// Questa funzione utilizza il metodo findOneAndUpdate di Mongoose per cercare un documento con userId corrispondente 
// e aggiornare il campo registrationToken con il valore di token. 
// Se il documento non esiste, viene creato grazie all'opzione upsert: true. In caso di errore, l'errore viene catturato e lanciato di nuovo.

const add = async (userId, token) => { // La funzione add accetta due parametri: userId e token.
    const result = tokenSchema.findOneAndUpdate( // La funzione findOneAndUpdate di Mongoose cerca e aggiorna un documento nel database.
        {userId: userId},               // Il documento da cercare ha un campo userId corrispondente al parametro userId.
        {registrationToken: token},     // Il campo registrationToken del documento viene aggiornato con il valore del parametro token.
        {upsert: true}                  // Se il documento non esiste, viene creato grazie all'opzione upsert: true.
    ).catch((err) => {                  // In caso di errore, l'errore viene catturato e lanciato di nuovo
        throw err;
    });
}

export default {add}; // Il modulo esporta un oggetto con un metodo add che consente di aggiungere un token di registrazione per un utente nel database.

// In sintesi, questo codice gestisce l'aggiornamento o la creazione di un token di registrazione per un utente specifico nel database.
// Questo è utile per implementare la funzionalità di notifica push per gli utenti registrati nell'applicazione.
// Il modulo esporta una funzione add che accetta un userId e un token e aggiorna o crea il token di registrazione nel database.
// L'aggiornamento viene eseguito utilizzando il metodo findOneAndUpdate di Mongoose, che cerca un documento per userId e aggiorna il campo registrationToken con il nuovo valore.
// Se il documento non esiste, viene creato grazie all'opzione upsert: true. In caso di errore, l'errore viene catturato e lanciato di nuovo.
// Questo modulo può essere utilizzato in altri moduli per gestire i token di registrazione degli utenti nell'applicazione.