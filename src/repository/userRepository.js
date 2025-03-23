// Questo codice definisce un modulo per la gestione degli utenti utilizzando uno schema di database.

import { userStatus } from "../const/constant.js";
import userSchema from "../schema/userSchema.js"; // Importo lo schema userSchema (Schema di Mongoose) 
                                     // che definisce la struttura del documento nel database per memorizzare gli utenti.
import MongoInternalException from "../exceptions/MongoInternalException.js";

const add = async (data) => {  // La funzione add è una funzione asincrona che accetta un parametro data.
    const user = await userSchema.create(data).catch(error => { //Tenta di creare un nuovo documento utente nel database utilizzando il metodo create di Mongoose.
        console.error('Errore durante la creazione dell\'utente:', error.message); 
        return null; // Se si verifica un errore, viene stampato un messaggio di errore e viene restituito null.
    });

    return user ? user.toJSON({ flattenObjectIds: true, versionKey: false }) : null; 
    // Se l'utente è stato creato con successo, viene restituito l'utente come oggetto JSON.
    // Viene utilizzato il metodo toJSON di Mongoose per convertire l'oggetto utente in un oggetto JSON.
    // L'opzione flattenObjectIds: true rimuove l'_id dal documento JSON.
    // L'opzione versionKey: false rimuove il campo __v dal documento JSON.
    // Se l'utente non è stato creato con successo, viene restituito null.
}

const activate = async (id) => {
    const user = await userSchema.findOneAndUpdate({_id: id, status: userStatus.PENDING}, {status: userStatus.ACTIVE}, {new: true, upsert: false}).catch((error) => {
        console.error("Errore durante l\'aggiornamento dell\'utente", error.message);
        return user ? user.toJSON({ flattenObjectIds: true, versionKey: false }) : null; 
    });
}

const getByEmail = async (email) => {
     return await userSchema.findOne({email: email}).catch((error) => {
        throw new MongoInternalException("Errore interno Mongo:", "userRepository.getByEmail");
    })
}

export default {add, activate, getByEmail}; // Il modulo esporta un oggetto con un metodo add che consente di aggiungere un utente nel database.

// In sintesi, questo codice gestisce l'aggiunta di un nuovo utente al database utilizzando uno schema di Mongoose.
// La funzione add accetta un oggetto data come parametro e crea un nuovo documento utente nel database utilizzando il metodo create di Mongoose.
// Se l'operazione di creazione ha successo, viene restituito l'utente come oggetto JSON senza l'_id e il campo __v.
// Se si verifica un errore durante la creazione dell'utente, viene stampato un messaggio di errore e viene restituito null.

// Questo modulo può essere utilizzato in altri moduli per aggiungere nuovi utenti al database dell'applicazione.
// Questo codice è utile per implementare la funzionalità di registrazione degli utenti nell'applicazione.
// Il modulo esporta una funzione add che consente di aggiungere un utente al database utilizzando uno schema di Mongoose.