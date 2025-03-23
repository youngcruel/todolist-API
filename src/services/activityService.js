import activityRepository from '../repository/activityRepository.js'; // Importa il repository per le attività

// Aggiunge una nuova attività
const addActivity = async (data) => {
    return await activityRepository.add(data);
};

// Recupera tutte le attività. 
const getActivities = async (userId, skip, limit) => {
    return await activityRepository.getActivities(userId, skip, limit);
}
// Cerca un'attività per cursore mongo. 
const getActivitiesByCursor = async (userId, cursor, limit, direction) => {
    return await activityRepository.getActivitiesByCursor(userId, cursor, limit, direction);
  };

// Cerca un'attività per ID. 
const getActivity = async (id, userId) => {
    return await activityRepository.getActivity(id, userId);
};

// Aggiorna un'attività esistente. 
const updateActivity = async (id, data, userId) => {
    const activity =  await activityRepository.updateActivity(id, data. userId);
    if (!activity) {
        throw new NotFoundException("Attività non trovata", "activityRepository.updateActivity");
    };
    return activity
}

// Elimina un'attività esistente. 
const deleteActivity = async (id, userId) => {
    return await activityRepository.updateActivity(id, userId, {status: 'deleted'});
}

export default { addActivity, getActivities, getActivity, updateActivity, deleteActivity, getActivitiesByCursor}; 