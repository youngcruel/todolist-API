import activityService from '../services/ActivityService.js'; 

const get = async (req, res) => { 
 
    const activityId = req.params.id; 
    const userId = req.userId;

    try { 
        const activity = await activityService.getActivity(activityId, userId); 

        if (!activity) { 
            return res.status(404).json({ message: "Nessuna attività trovata" }); 
        }
        res.status(200).json(activity); 

    } catch (error) { 
        res.status(error.status).json({ message: error.message }); 
    }
}

export default get; 