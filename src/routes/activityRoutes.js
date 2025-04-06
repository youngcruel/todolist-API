// Importa i validator
import getValidator from "../validators/getValidator.js";
import addValidator from "../validators/addValidator.js";
import updateValidator from "../validators/updateValidator.js";
import deleteValidator from "../validators/deleteValidator.js";
import registerUserValidator from "../validators/registerUserValidator.js";
import activateValidator from "../validators/activateValidator.js";
import completeValidator from "../validators/completeValidator.js";
import reOpenValidator from "../validators/reOpenValidator.js";
import archiveValidator from "../validators/archiveValidator.js";
import activateController from "../controllers/activateController.js";

// Importa i controller e i middleware necessari
import addController from "../controllers/addController.js";
import {
  getMany,
  getActivitiesByCursor,
} from "../../src/controllers/getManyController.js";
import getController from "../controllers/getController.js";
import updateController from "../controllers/updateController.js";
import completeController from "../controllers/completeController.js";
import reOpenController from "../controllers/reOpenActivityController.js";
import archiveController from "../controllers/archiveController.js";
import deleteController from "../controllers/deleteController.js";
import registerController from "../controllers/registerController.js";
import loginUserValidator from "../validators/loginUserValidator.js";
import loginController from "../controllers/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cursorValidator from "../validators/cursorValidator.js";

const setup = (app) => {
  //Definizione delle routes
  app.get("/", authMiddleware, getMany); //Recupera tutte le attività (skip limit)
  app.get(
    "/activities",
    authMiddleware,
    cursorValidator,
    getActivitiesByCursor
  );
  app.get("/:id/activity", authMiddleware, getValidator, getController); //Recupera un'attività specifica per ID
  app.post("/", authMiddleware, addValidator, addController); //Aggiunge un'attività
  app.patch(
    "/:id/complete",
    authMiddleware,
    completeValidator,
    completeController
  ); //Aggiorna un'attività

  app.patch(
    "/:id/reOpenActivity",
    authMiddleware,
    reOpenValidator,
    reOpenController
  ); //Reimposta un'attività completed a open

  app.patch(
    "/:id/archive",
    authMiddleware,
    archiveValidator,
    archiveController
  ); //Archivia un'attività

  app.patch("/:id/update", authMiddleware, updateValidator, updateController); //Aggiorna un'attività
  app.delete("/:id/delete", authMiddleware, deleteValidator, deleteController); //Rimuove un'attività (impostando status a deleted)
  app.post("/user", registerUserValidator, registerController); //Registra un utente
  app.get("/user/activate/:token", activateValidator, activateController); //Attiva un utente
  app.post("/user/login", loginUserValidator, loginController); //Logga un utente

  //middleware per gestire errori Joi
  app.use((error, req, res, next) => {
    if (error && error.error && error.error.isJoi) {
      res.status(400).json({
        type: error.type,
        message: error.error.toString(),
      });
    } else {
      next(error);
    }
  });
};

export default setup;
