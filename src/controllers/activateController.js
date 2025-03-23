import userService from '../services/userService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const activate = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - update)

    const token = req.params.token; // Prendo il token dell'attività dalla richiesta http (req) e lo salvo in una variabile
    
    try {
        const user = await userService.activate(token); // Chiamo il metodo activate del service passando il token per confermare l'utente
        res.status(200).json(user); // Altrimenti restituisco l'user con codice 200 (ok)
    } catch (error) {
        res.status(error.status).json({ message: error.message }); // Restituisco un messaggio di errore con codice e messaggio gestito in base alla situazione
    }
}

export default activate; // Esporto la funzione update

// In questo snippet di codice, ho creato un controller per l'aggiornamento di un'attività nel database.
// Ho importato il service activityService per interagire con le attività e il database.
// Ho creato una funzione asincrona update che prende in input req e res.
// Ho preso l'id dell'attività dalla richiesta http e lo ho salvato in una variabile activityId.
// Ho preso i dati dal corpo della richiesta http e li ho salvati in una variabile data.
// Ho chiamato il metodo updateActivity del service passando l'id dell'attività e i dati per aggiornarla.
// Ho gestito i casi in cui l'attività non è stata trovata o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione update.

// Questo controller gestisce l'aggiornamento di un'attività nel database e restituisce l'attività aggiornata o un messaggio di errore in caso di problemi.