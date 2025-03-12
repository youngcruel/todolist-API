// Questo validator definisce uno schema di validazione per i dati del corpo di una richiesta HTTP utilizzando Joi e express-joi-validation.

import Joi from 'joi'; // Importa il modulo Joi per la validazione dei dati
import { createValidator } from 'express-joi-validation'; // Importa la funzione createValidator da express-joi-validation

const validator = createValidator({ passError: true }); // Crea un validator con createValidator e imposta l'opzione passError a true, 
// il che significa che gli errori di validazione saranno passati al middleware di gestione degli errori di Express.

export default [      //Esporta un array contenente un middleware di validazione che verifica il corpo della richiesta (body) rispetto a uno schema Joi.
    validator.body(
        Joi.object().keys({
            name: Joi.string().required().min(3), // Campo obbligatorio, stringa di almeno 3 caratteri
            description: Joi.string().required().min(3), // Campo obbligatorio, stringa di almeno 3 caratteri
            dueDate: Joi.number().optional(), // Campo opzionale, numero
        })
    )
];

// Se i dati della richiesta non soddisfano questi criteri, il middleware genererà un errore di validazione.