// Import validatori 
import getValidator from '../validators/getValidator.js';  
import addValidator from '../validators/addValidator.js';  
import updateValidator from '../validators/updateValidator.js';
import deleteValidator from '../validators/deleteValidator.js';
import registerUserValidator from '../validators/registerUserValidator.js'; 
import activateValidator from '../validators/activateValidator.js';
import loginUserValidator from '../validators/loginUserValidator.js';
import cursorValidator from '../validators/cursorValidator.js';

// Import controller
import addController from '../controllers/addController.js'; 
import { getMany, getActivitiesByCursor } from '../controllers/getManyController.js';
import getController from '../controllers/getController.js'; 
import updateController from '../controllers/updateController.js'; 
import deleteController from '../controllers/deleteController.js'; 
import registerController from '../controllers/registerController.js'; 
import activateController from '../controllers/activateController.js';
import loginController from '../controllers/loginController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import cursorPagination from '../middleware/cursorPagination.js';

const setup = (app) => {
    //Definizione delle routes
    app.get('/:id', authMiddleware, getValidator, getController); 
    app.get('/activities', authMiddleware, cursorValidator, cursorPagination, getActivitiesByCursor);
    app.get('/', authMiddleware, getMany); 
    app.post('/', authMiddleware, addValidator, addController); 
    app.patch('/:id', authMiddleware, updateValidator, updateController);
    app.delete('/:id', authMiddleware, deleteValidator, deleteController);
    app.post('/user', registerUserValidator, registerController); 
    app.get('/user/activate/:token', activateValidator, activateController);
    app.post('/user/login', loginUserValidator, loginController);
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