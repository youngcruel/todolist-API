import activityService from '../services/activityService.js';

const add = (req, res) => {
    const data = req.body;
    const activity = activityService.addActivity(data); //cerca l'attività da aggiornare
    if(activity){
        res.status(201).json(activity.toJSON()) //attività trovata
    } else {
        res.status(500).json({message: "errore server"})
    }
}

export default add;