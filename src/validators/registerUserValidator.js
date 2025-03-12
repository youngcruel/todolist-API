// Questo validator verifica che il corpo (body) della richiesta contenga un'email valida e una password obbligatoria. 
// Utilizza Joi per definire lo schema di validazione e express-joi-validation per applicare questo schema al corpo della richiesta.

import Joi from 'joi';   // Importa il modulo Joi
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un'istanza di express-joi-validation con passError impostato su true
 
export default [ // Esporta un array contenente il middleware di validazione che verifica il corpo (body) della richiesta.
    validator.body(
        Joi.object().keys({
            email: Joi.string().email({tlds: {allow: false}}),  // Verifica che il corpo della richiesta contenga un'email valida, 
            // dove tlds: {allow: false} impedisce l'uso di domini di primo livello
            password: Joi.string().required(), // Verifica che il corpo della richiesta contenga una password obbligatoria
        })
    )
];

// Questo middleware può essere utilizzato in una rotta Express per assicurarsi che il corpo della 
// richiesta contenga un'email valida e una password prima di procedere con la logica della rotta