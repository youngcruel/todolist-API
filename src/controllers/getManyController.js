import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const getMany = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - getMany)

    try { // Blocco try catch per gestire eventuali errori e logica principale
        const activities = await activityService.getActivities(); // Chiamo il metodo getActivities del service per ottenere tutte le attività e salvo il risultato in una variabile

        if (!activities || activities.length === 0) { // Se non ci sono attività o la lunghezza dell'array è 0
            return res.status(404).json({ message: "Nessuna attività trovata" }); // Restituisco un messaggio di errore con codice 404 (non trovato)
        }
        res.status(200).json(activities); // Altrimenti restituisco tutte le attività con codice 200 (ok)

    } catch (error) { // Se c'è un errore
        console.error("Errore nel controller getMany:", error); // Stampo l'errore in console
        res.status(500).json({ message: "Errore interno del server" }); // Restituisco un messaggio di errore con codice 500 (errore interno del server)
    }
};

export default getMany; // Esporto la funzione getMany

// In questo snippet di codice, ho creato un controller per ottenere tutte le attività dal database.
// Ho importato il service activityService per interagire con le attività e il database.    
// Ho creato una funzione asincrona getMany che prende in input req e res.
// Ho chiamato il metodo getActivities del service per ottenere tutte le attività e ho salvato il risultato in una variabile activities.
// Ho gestito i casi in cui non ci sono attività o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione getMany.

// Questo controller gestisce il recupero di tutte le attività dal database e restituisce le attività o un messaggio di errore in caso di problemi.
// Questo controller è responsabile della logica per ottenere tutte le attività dal database e restituirle come risposta HTTP.
// Questo controller utilizza il service activityService per interagire con le attività e il database.