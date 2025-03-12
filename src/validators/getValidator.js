// Questo validator ha la stessa funzione del validator nel file deleteValidator.js. 
// Verifica che il parametro id nella richiesta sia una stringa esadecimale di lunghezza 24 e che sia obbligatorio. 
// Utilizza Joi per definire lo schema di validazione e express-joi-validation per applicare questo schema ai parametri della richiesta.

import Joi from 'joi';  // Importa il modulo Joi
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un'istanza di express-joi-validation con passError impostato su true

export default [ // Esporta un array contenente il middleware di validazione che verifica i parametri (params) della richiesta.
    validator.params(
        Joi.object().keys({
            "id": Joi.string().hex().length(24).required(), // Verifica che il parametro id sia una stringa esadecimale di lunghezza 24 e che sia obbligatorio
        })
    )
];

// Questo middleware può essere utilizzato in una rotta Express per assicurarsi che 
// il parametro id nella richiesta soddisfi questi criteri prima di procedere con la logica della rotta.