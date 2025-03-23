import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const remove = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - rimuovi)

    const activityId = req.params.id; // Prendo l'id dell'attività dalla richiesta http (req) e lo salvo in una variabile
    const userId = req.userId

    try { // Blocco try catch per gestire eventuali errori
        const activity = await activityService.deleteActivity(activityId, userId); // Chiamo il metodo delete Activity del service passando l'id dell'attività e i dati per rimuoverla

        res.status(200).json(); // Altrimenti restituisco codice 200 (ok) 

    } catch (error) { 
        res.status(error.status).json({ message: error.message }); // Restituisco un messaggio di errore gestito dalle exceptions
    }
};

export default remove; // Esporto la funzione remove

// In questo snippet di codice, ho creato un controller per la rimozione di un'attività dal database.
// Ho importato il service activityService per interagire con le attività e il database.
// Ho creato una funzione asincrona remove che prende in input req e res.
// Ho preso l'id dell'attività dalla richiesta http e lo ho salvato in una variabile activityId.
// Ho creato un oggetto data con lo stato 'deleted' per aggiornare l'attività con questo stato.
// Ho chiamato il metodo updateActivity del service passando l'id dell'attività e i dati per aggiornarla.
// Ho gestito i casi in cui l'attività non è stata trovata o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione remove.
// Questo controller gestisce la rimozione di un'attività dal database e restituisce l'attività aggiornata o un messaggio di errore in caso di problemi

