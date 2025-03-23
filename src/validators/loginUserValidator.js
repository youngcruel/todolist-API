import Joi from 'joi';

import { createValidator } from 'express-joi-validation';

const validator = createValidator({ passError: true})

export default [
    validator.body(
        Joi.object().keys({
            email: Joi.string().email({ tlds: {allow: false}}),
            password: Joi.string().required()
        })
    ),
    validator.headers( // Verifica gli header della richiesta restituiti da req.headers
            Joi.object().keys({ // Verifica che l'oggetto headers contenga i seguenti campi
                "content-type": Joi.string().valid('application/json').required(), // Verifica che l'header content-type sia una stringa con valore 'application/json'
            }).unknown(), // Ignora gli header non specificati nel validatore (in questo caso, accetta qualsiasi header aggiuntivo)
        )
];