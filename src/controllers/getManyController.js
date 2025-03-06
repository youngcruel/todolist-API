import activityService from '../services/activityService.js';

const getMany = async (req, res) => {
        const activities = await activityService.getActivities(); //cerca l'attività da aggiornare

        if(activities){
            res.status(200).json(activities) //attività trovata
        } else {
            res.status(404).json({message: "nessun attività trovata"})
        }
    }

export default getMany;