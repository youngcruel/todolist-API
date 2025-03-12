// Questo file activityRoutes.js definisce le rotte per un'applicazione Express.js che gestisce le attività.
// Le rotte consentono di aggiungere, recuperare, aggiornare e rimuovere attività dal database.

// Import validatori 
import getValidator from '../validators/getValidator.js';  // Importo il validatore getValidator per validare i dati di input per la ricerca di un'attività.
import addValidator from '../validators/addValidator.js';  // Importo il validatore addValidator per validare i dati di input per l'aggiunta di un'attività.
import updateValidator from '../validators/updateValidator.js'; // Importo il validatore updateValidator per validare i dati di input per l'aggiornamento di un'attività.
import deleteValidator from '../validators/deleteValidator.js'; // Importo il validatore deleteValidator per validare i dati di input per la rimozione di un'attività.
import registerUserValidator from '../validators/registerUserValidator.js'; // Importo il validatore registerUserValidator per validare i dati di input per la registrazione di un utente.

// Import controller
import addController from '../controllers/addController.js'; // Importo il controller addController per gestire l'aggiunta di un'attività.
import getManyController from '../controllers/getManyController.js'; // Importo il controller getManyController per gestire il recupero di tutte le attività.
import getController from '../controllers/getController.js'; // Importo il controller getController per gestire il recupero di un'attività specifica.
import updateController from '../controllers/updateController.js'; // Importo il controller updateController per gestire l'aggiornamento di un'attività.
import deleteController from '../controllers/deleteController.js'; // Importo il controller deleteController per gestire la rimozione di un'attività.
import registerController from '../controllers/registerController.js'; // Importo il controller registerController per gestire la registrazione di un utente.

// Questi moduli sono utilizzati per validare le richieste e gestire le risposte.
// I validatori validano i dati di input delle richieste HTTP.
// I controller gestiscono le richieste HTTP e le risposte corrispondenti.
// Questi moduli sono utilizzati per implementare le funzionalità dell'applicazione.

const setup = (app) => {
    //Definizione delle routes
    app.get('/:id', getValidator, getController); // Recupera un'attività specifica per ID, validando la richiesta con getValidator e gestendo la risposta con getController
    app.get('/', getManyController);  // Recupera tutte le attività, gestendo la risposta con getManyController.
    app.post('/', addValidator, addController); //Aggiunge un'attività, validando la richiesta con addValidator e gestendo la risposta con addController.
    app.patch('/:id', updateValidator, updateController); // Aggiorna un'attività specifica per ID, validando la richiesta con updateValidator e gestendo la risposta con updateController.
    app.delete('/:id', deleteValidator, deleteController); // Rimuove un'attività specifica per ID, validando la richiesta con deleteValidator e gestendo la risposta con deleteController.
    app.post('/user', registerUserValidator, registerController); // Aggiunge un utente, validando la richiesta con registerUserValidator e gestendo la risposta con registerController.

    //middleware per gestire errori Joi

    // Il middleware finale gestisce gli errori di validazione generati da Joi: se l'errore è di tipo Joi,
    // restituisce una risposta JSON con lo status 400 e il messaggio di errore di Joi.
    // Altrimenti, passa l'errore al middleware successivo per la gestione degli errori generici.
    app.use((error, req, res, next) => {
        if(error && error.error && error.error.isJoi){
            res.status(400).json({
                type: error.type,
                message: error.error.toString()
            });
        }
        else {
            next(error);
        }
    })
}


export default setup; // Esporto la funzione setup per configurare le rotte dell'applicazione Express.js.

// Questo file definisce le rotte per un'applicazione Express.js che gestisce le attività.
// Le rotte consentono di aggiungere, recuperare, aggiornare e rimuovere attività dal database.
// I validatori vengono utilizzati per validare i dati di input delle richieste HTTP.
// I controller gestiscono le richieste HTTP e le risposte corrispondenti.
// La funzione setup configura le rotte dell'applicazione Express.js utilizzando i validatori e i controller appropriati.

// Questo modulo può essere utilizzato per implementare le funzionalità dell'applicazione per la gestione delle attività e degli utenti.