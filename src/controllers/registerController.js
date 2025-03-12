import userService from "../services/userService.js"; // Importo il service che contiene la logica per la registrazione dell'utente e il database

const register = async (req, res) => { // Creo una funzione asincrona che prende in input req e res (controller - register) e gestisce la registrazione dell'utente

    const data = req.body;  // Prendo i dati dal corpo della richiesta http (req) e li salvo in una variabile
                            //Es. {email: "email", password: "password"} 
    try {  //Blocco try-catch per gestire la registrazione e gli errori
        
        const user = await userService.register(data); // Chiamo il metodo register del service passando i dati della richiesta http per registrare l'utente e salvo il risultato in una variabile
        //Il metodo register del service si occupa di registrare l'utente nel database e restituisce l'utente registrato se ha successo

        if (!user) { // Se l'utente non è stato registrato
            return res.status(500).json({ message: "Errore durante la creazione dell'utente" }); // Restituisco un messaggio di errore con codice 500 (errore interno del server)
        }

        res.status(201).json({ message: "Registrazione riuscita! Controlla la tua email per confermare l'account." }); // Altrimenti restituisco un messaggio di successo con codice 201 (creato)

    } catch (error) {
        console.error("Errore nel controller register:", error); // Se c'è un errore lo stampo in console
        res.status(500).json({ message: "Errore interno del server" }); // Restituisco un messaggio di errore con codice 500 (errore interno del server)
    }
};

export default register; // Esporto la funzione register

// In questo snippet di codice, ho creato un controller per la registrazione dell'utente nel database.
// Ho importato il service userService per interagire con l'utente e il database.
// Ho creato una funzione asincrona register che prende in input req e res.
// Ho preso i dati dal corpo della richiesta http e li ho salvati in una variabile data.
// Ho chiamato il metodo register del service passando i dati della richiesta http per registrare l'utente e ho salvato il risultato in una variabile user.
// Ho gestito i casi in cui l'utente non è stato registrato o c'è un errore interno del server.
// Ho restituito un messaggio di errore con il codice di stato appropriato.
// Infine, ho esportato la funzione register.

// Questo controller gestisce la registrazione dell'utente nel database e restituisce un messaggio di successo o errore in caso di problemi.
// Questo controller è responsabile della logica per registrare un utente nel database e restituire una risposta HTTP appropriata.ß