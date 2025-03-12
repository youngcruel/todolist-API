import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const update = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - update)

    const activityId = req.params.id; // Prendo l'id dell'attività dalla richiesta http (req) e lo salvo in una variabile
    const data = req.body; // Prendo i dati dal corpo della richiesta http (req) e li salvo in una variabile
    
    try {
        const activity = await activityService.updateActivity(activityId, data); // Chiamo il metodo updateActivity del service passando l'id dell'attività e i dati per aggiornarla
        if (!activity) { // Se l'attività non è stata trovata
            return res.status(404).json({ message: "Nessuna attività trovata con questo ID" }); // Restituisco un messaggio di errore con codice 404 (non trovato)
        }
        res.status(200).json(activity); // Altrimenti restituisco l'attività aggiornata con codice 200 (ok)

    } catch (error) {
        console.error("Errore nel controller update:", error); // Se c'è un errore lo stampo in console
        res.status(500).json({ message: "Errore interno del server" }); // Restituisco un messaggio di errore con codice 500 (errore interno del server)
    }
}

export default update; // Esporto la funzione update

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