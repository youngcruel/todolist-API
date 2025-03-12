import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const remove = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - rimuovi)

    const activityId = req.param('id'); // Prendo l'id dell'attività dalla richiesta http (req) e lo salvo in una variabile
    const data = {status: 'deleted'}; // Creo un oggetto con lo stato 'deleted' per aggiornare l'attività con questo stato 

    try { // Blocco try catch per gestire eventuali errori
        const activity = await activityService.updateActivity(activityId, data); // Chiamo il metodo updateActivity del service passando l'id dell'attività e i dati per aggiornarla

        if (!activity) {  // Se l'attività non è stata trovata
            console.log(`Attività con ID ${activityId} non trovata.`);  // Stampo un messaggio in console
            return res.status(404).json({ message: "Nessuna attività trovata con questo ID" }); // Restituisco un messaggio di errore con codice 404 (non trovato)
            }

        res.status(200).json(activity); // Altrimenti restituisco l'attività aggiornata con codice 200 (ok)

    } catch (error) { 
        console.error("Errore nel controller update:", error); // Se c'è un errore lo stampo in console
        res.status(500).json({ message: "Errore interno del server" }); // Restituisco un messaggio di errore con codice 500 (errore interno del server)
    }
}


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

