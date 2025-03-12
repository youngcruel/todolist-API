import activityService from '../services/activityService.js'; // Importo il service che contiene la logica per interagire con le attività e il database

const add = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - aggiungi)

    const data = req.body; // Prendo i dati dal corpo della richiesta http (req) e li salvo in una variabile 

    try {   //Blocco try catch per gestire eventuali errori 
        const activity = await activityService.addActivity(data); // Chiamo il metodo addActivity del service passando i dati della richiesta http
                                                                  // per creare un'attività e salvo il risultato in una variabile
        if(!activity){                                                                 // Se l'attività non è stata creata
            res.status(500).json({message:"Errore durante la creazione dell'attività"}) //restituisco un messaggio di errore
        }

        res.status(201).json(activity); // Altrimenti restituisco l'attività creata con codice 201 (creato)

    } catch (error){
        console.error("Errore nel controller add", error); // Se c'è un errore lo stampo in console
        res.status(500).json({message: "Errore interno del server"}) // Restituisco un messaggio di errore con codice 500 (errore interno del server)
    }
};

export default add; // Esporto la funzione add

// In questo snippet di codice, ho creato un controller per l'aggiunta di un'attività al database.
// Ho importato il service activityService per interagire con le attività e il database.
// Ho creato una funzione asincrona add che prende in input req e res.
// Ho preso i dati dal corpo della richiesta http e li ho salvati in una variabile data.
// Ho chiamato il metodo addActivity del service passando i dati della richiesta http per creare un'attività e ho salvato il risultato in una variabile activity.
// Ho gestito i casi in cui l'attività non è stata creata o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione add.
// Questo controller gestisce l'aggiunta di un'attività al database e restituisce l'attività creata o un messaggio di errore in caso di problemi.