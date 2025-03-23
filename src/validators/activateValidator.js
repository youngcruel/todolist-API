// Questo validator definisce una serie di regole di validazione per le richieste HTTP utilizzando Joi e express-joi-validation

import Joi from 'joi'; // Importa il modulo Joi
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un'istanza di express-joi-validation con passError impostato su true

export default [  // Esporta un array contenente il middleware di validazione che verifica il corpo (body), i parametri (params) e gli header della richiesta.
    validator.params( // Verifica i parametri della richiesta restituiti da req.params
        Joi.object().keys({ // Verifica che l'oggetto params contenga i seguenti campi
            "token": Joi.string().length(10).required(), // Verifica che il token sia una stringa di 10 caratteri
        })
    ),
    validator.headers( // Verifica gli header della richiesta restituiti da req.headers
        Joi.object().keys({ // Verifica che l'oggetto headers contenga i seguenti campi
            "content-type": Joi.string().valid('application/json').required(), // Verifica che l'header content-type sia una stringa con valore 'application/json'
        }).unknown(), // Ignora gli header non specificati nel validatore (in questo caso, accetta qualsiasi header aggiuntivo)
    )
];

// Questo commento mostra un esempio di validazione personalizzata per l'id utilizzando mongoose.Types.ObjectId.isValid per 
// verificare se l'id è un ObjectId valido di MongoDB.