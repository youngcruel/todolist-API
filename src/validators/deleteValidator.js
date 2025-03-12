// Questo validator verifica che il parametro id nella richiesta sia una stringa esadecimale di lunghezza 24 e che sia obbligatorio. 
// Utilizza Joi per definire lo schema di validazione e express-joi-validation per applicare questo schema ai parametri della richiesta

import Joi from 'joi'; // Importa il modulo Joi per la validazione dei dati
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un validator con createValidator e imposta l'opzione passError a true,
// il che significa che gli errori di validazione saranno passati al middleware di gestione degli errori di Express.

export default [ //Esporta un array contenente un middleware di validazione che verifica i parametri della richiesta rispetto a uno schema Joi.
    validator.params(
        Joi.object().keys({ // Verifica i parametri della richiesta rispetto a uno schema Joi
            "id": Joi.string().hex().length(24).required(), // Campo obbligatorio, stringa esadecimale di lunghezza 24
        })
    )
];

// Se i dati della richiesta non soddisfano questi criteri, il middleware genererà un errore di validazione.
// Questo middleware può essere utilizzato in una rotta Express per assicurarsi che 
// il parametro id nella richiesta soddisfi questi criteri prima di procedere con la logica della rotta.