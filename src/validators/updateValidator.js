// Questo validator definisce una serie di regole di validazione per le richieste HTTP utilizzando Joi e express-joi-validation

import Joi from 'joi'; // Importa il modulo Joi
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un'istanza di express-joi-validation con passError impostato su true

export default [  // Esporta un array contenente il middleware di validazione che verifica il corpo (body), i parametri (params) e gli header della richiesta.
    validator.body( // Verifica il corpo della richiesta restituito da req.body 
        Joi.object().keys({ // Verifica che l'oggetto body contenga i seguenti campi
            name: Joi.string().required().min(3), // Verifica che il campo name sia una stringa obbligatoria di almeno 3 caratteri
            description: Joi.string().required().min(3), // Verifica che il campo description sia una stringa obbligatoria di almeno 3 caratteri
            dueDate: Joi.number().min(new Date().getTime()).optional(), // Verifica che il campo dueDate sia un numero che rappresenta una data futura
        })
    ),
    validator.params( // Verifica i parametri della richiesta restituiti da req.params
        Joi.object().keys({ // Verifica che l'oggetto params contenga i seguenti campi
            "id": Joi.string().regex(/^(?!0+[1-9]+)\d+$/).required(), // Verifica che il parametro id sia una stringa che non inizia con uno o più zeri seguiti da uno o più numeri
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