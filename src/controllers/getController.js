import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const get = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - get)
 
    const activityId = req.params.id; // Prendo l'id dell'attività dalla richiesta http (req) e lo salvo in una variabile

    try { // Blocco try catch per gestire eventuali errori e logica principale
        const activity = await activityService.getActivity(activityId); // Chiamo il metodo getActivity del service passando l'id dell'attività e salvo il risultato in una variabile

        if (!activity) { // Se l'attività non è stata trovata
            return res.status(404).json({ message: "Nessuna attività trovata" }); // Restituisco un messaggio di errore con codice 404 (non trovato)
        }
        res.status(200).json(activity); // Altrimenti restituisco l'attività con codice 200 (ok)

    } catch (error) { 
        res.status(error.status).json({ message: error.message }); // Restituisco un messaggio di errore con codice eccezione gestito in base alla situazione
    }
}

export default get; // Esporto la funzione get

// In questo snippet di codice, ho creato un controller per ottenere un'attività dal database.
// Ho importato il service activityService per interagire con le attività e il database.
// Ho creato una funzione asincrona get che prende in input req e res.
// Ho preso l'id dell'attività dalla richiesta http e lo ho salvato in una variabile activityId.
// Ho chiamato il metodo getActivity del service passando l'id dell'attività e ho salvato il risultato in una variabile activity.
// Ho gestito i casi in cui l'attività non è stata trovata o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione get.

// Questo controller gestisce il recupero di un'attività dal database e restituisce l'attività o un messaggio di errore in caso di problemi.
// Questo controller è responsabile della logica per ottenere un'attività dal database e restituirla come risposta HTTP.
// Questo controller utilizza il service activityService per interagire con le attività e il database.