// Questo file activityRepository.js contiene un repository per gestire le operazioni CRUD (Create, Read, Update, Delete)
// sulle attività in un'applicazione To-Do List. Utilizza lo schema activitySchema per interagire con il database MongoDB.

import MongoInternalException from "../exceptions/MongoInternalException.js"; //Importo messaggio di errore
import NotFoundException from "../exceptions/NotFoundException.js";
import activitySchema from "../schema/todoListSchema.js"; //Importo il modello Activity e lo schema activitySchema (Schema di Mongoose) per interagire con il database.
import {status} from '../const/constant.js'
import Activity  from "../models/Activity.js";
// add - CREATE

// Questa funzione crea una nuova attività nel database utilizzando i dati forniti.
// Se c'è un errore durante la creazione, viene loggato e la funzione restituisce null.
// Altrimenti, restituisce l'attività creata in formato JSON.

const add = async (data) => {
  //La funzione add accetta un oggetto data come argomento, che contiene i dati per creare una nuova attività.
  const activity = await activitySchema.create(data).catch((error) => {
    //La funzione create di Mongoose crea un nuovo documento nel database utilizzando i dati forniti.
    console.error("Errore durante la creazione dell'attività:", error.message);
    return null; //Se c'è un errore durante la creazione, viene loggato e la funzione restituisce null.
  });
  //return new Activity(activity);
  return activity.toJSON({ flattenObjectIds: true, versionKey: false }); //Altrimenti, restituisce l'attività creata in formato JSON.
};

// getActivities - READ

// Questa funzione recupera tutte le attività dal database.
// Se c'è un errore durante la ricerca, viene loggato e la funzione restituisce null.
// Altrimenti, restituisce un array di attività in formato JSON.

const getActivities = async () => {
  //La funzione getActivities non accetta argomenti e recupera tutte le attività dal database.
  const activities = await activitySchema.find().catch((error) => {
    //La funzione find di Mongoose recupera tutti i documenti dal database.
    console.error("Errore durante la ricerca delle attività:", error.message);
    return null; //Se c'è un errore durante la ricerca, viene loggato e la funzione restituisce null.
  });
  //return activities.map(activity => new Activity(activity));
  return activities.map((activity) =>
    activity.toJSON({ flattenObjectIds: true, versionKey: false })
  ); //Altrimenti, restituisce un array di attività in formato JSON.
};

// getActivity - READ

// Questa funzione cerca un'attività specifica per ID.
// Se l'attività viene trovata, viene restituita in formato JSON, altrimenti null.
// Gli errori vengono loggati.

const getActivity = async (id) => {
  //La funzione getActivity accetta un ID come argomento e cerca un'attività corrispondente nel database.

  const activity = await activitySchema.findById(id).catch((error) => {
    //La funzione findById di Mongoose cerca un documento per ID nel database.
    throw new MongoInternalException("Errore durante la ricerca dell'attività:", "activityRepository.getActivity"); //Gli errori vengono loggati.
  });

  if (!activity) {
    throw new NotFoundException("Attività non trovata", "activityRepository.getActivity"
    );
  }

  return activity.toJSON({ flattenObjectIds: true, versionKey: false });
  //Se l'attività viene trovata, viene restituita in formato JSON
};

// updateActivity - UPDATE

// Questa funzione aggiorna un'attività esistente con i nuovi dati forniti.
// Se l'attività viene trovata e aggiornata, viene restituita in formato JSON, altrimenti null.
// Gli errori vengono loggati.

const updateActivity = async (id, data) => {
  //La funzione updateActivity accetta un ID e un oggetto data come argomenti e aggiorna un'attività esistente con i nuovi dati forniti.

  const activity = await activitySchema
    .findOneAndUpdate(
      //La funzione findOneAndUpdate di Mongoose cerca e aggiorna un documento nel database.
      { _id: id }, //Cerca un documento per ID
      data, //Aggiorna il documento con i nuovi dati forniti
      { new: true, upsert: false } //Ritorna l'oggetto aggiornato, senza creare nuovi documenti
    )
    .catch((error) => {
      //La funzione findById di Mongoose cerca un documento per ID nel database.
      throw new MongoInternalException("Errore durante l'aggiornamento dell'attività:", "activityRepository.updateActivity"); //Gli errori vengono loggati.
    });

  return activity ? activity.toJSON({ flattenObjectIds: true, versionKey: false }) : null;
  //Se l'attività viene trovata, viene restituita in formato JSON, altrimenti null
};

const completeActivity = async(id, userId) => {
   //La funzione updateActivity accetta un ID e un oggetto data come argomenti e aggiorna un'attività esistente con i nuovi dati forniti.

   const activity = await activitySchema
   .findOneAndUpdate(
     //La funzione findOneAndUpdate di Mongoose cerca e aggiorna un documento nel database.
     { _id: id, userId: userId, status: {$in: [status.OPEN, status.COMPLETED]} }, //Cerca un documento per ID
     { $set: {status: status.COMPLETED} } ,
     {upsert: false, new: true}
   )
   //.catch((error) => {
     //La funzione findById di Mongoose cerca un documento per ID nel database.
   //  throw new MongoInternalException("Errore durante l'aggiornamento dell'attività:", "activityRepository.updateActivity"); //Gli errori vengono loggati.
  // });

 return new Activity(activity);
 //Se l'attività viene trovata, viene restituita in formato JSON, altrimenti null
};

export default { add, getActivities, getActivity, updateActivity, completeActivity }; //Esporto le funzioni add, getActivities, getActivity e updateActivity per utilizzarle altrove nel codice.

// Questo repository fornisce funzionalità per creare, leggere e aggiornare attività in un'applicazione To-Do List.
// Utilizza lo schema activitySchema e il modello Activity per interagire con il database MongoDB.
// Le funzioni forniscono operazioni CRUD per gestire le attività nel database
// e restituiscono i risultati in formato JSON per l'utilizzo in altre parti dell'applicazione.

