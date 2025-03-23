// Il file activityService.js contiene un servizio che gestisce le operazioni relative alle attività in un'applicazione. 
// Utilizza un repository per interagire con il database

import config from '../../config/config.js'; // Importa il file di configurazione per accedere ai parametri di configurazione
const dbFile = config.dbFile; // Costante che contiene il nome del file del database
import activityRepository from '../repository/activityRepository.js'; // Importa il repository per le attività

// Aggiunge una nuova attività
// Chiama la funzione add del repository passando i dati dell'attività.
const addActivity = async (data) => {
    return await activityRepository.add(data);
};

// Recupera tutte le attività. 
// Chiama la funzione getActivities del repository.
const getActivities = async () => {
    return await activityRepository.getActivities();
}

// Cerca un'attività per ID. 
// Chiama la funzione getActivity del repository passando l'ID dell'attività.
const getActivity = async (id) => {
    return await activityRepository.getActivity(id);
};

// Aggiorna un'attività esistente. 
// Chiama la funzione updateActivity del repository passando l'ID dell'attività e i nuovi dati.
const updateActivity = async (id, data) => {
    const activity =  await activityRepository.updateActivity(id);
    if (!activity) {
        throw new NotFoundException("Attività non trovata", "activityRepository.updateActivity");
    };
    return activity
}

// Elimina un'attività esistente. 
// Chiama la funzione updateActivity del repository passando l'ID dell'attività e i nuovi dati.
const deleteActivity = async (id) => {
    return await activityRepository.updateActivity(id, {status: 'deleted'});
}

export default { addActivity, getActivities, getActivity, updateActivity, deleteActivity}; // Esporta le funzioni del servizio per poterle utilizzare altrove nell'applicazione

// In sintesi, il file activityService.js contiene un servizio che fornisce un'interfaccia per effettuare e gestire le operazioni relative alle attività 
// in un'applicazione Node.js delegando le operazioni effettive al repository delle attività.
