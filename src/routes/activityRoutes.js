import addValidator from '../validators/addValidator.js';
import updateValidator from '../validators/updateValidator.js';
import addController from '../controllers/addController.js';
import getManyController from '../controllers/getManyController.js';
import getController from '../controllers/getController.js';
import updateController from '../controllers/updateController.js';
import deleteController from '../controllers/deleteController.js';

const setup = (app) => {
    //Definizione delle routes
    app.get('/:id', getController); //Recupera un'attività specifica per ID
    app.get('/', getManyController); //Recupera tutte le attività
    app.post('/', addValidator, addController); //Aggiunge un'attività
    app.patch('/:id', updateValidator, updateController); //Aggiorna un'attività
    app.delete('/:id', deleteController); //Rimuove un'attività (impostando status a deleted)

    //middleware per gestire errori Joi
    app.use((error, req, res, next) => {
        if(error && error.error && error.error.isJoi){
            res.status(400).json({
                type: error.type,
                message: error.error.toString()
            });
        }
        else {
            next(error);
        }
    })
}

export default setup;