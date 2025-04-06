import activityService from '../services/ActivityService.js'; 

const complete = async (req, res) => { 

    const activityId = req.params.id; 
    const userId = req.userId;
        
    try {
        const activity = await activityService.completeActivity(activityId, userId); 
        res.status(200).json(activity); 
    } catch (error) {
        res.status(error.status).json({ message: error.message }); 
    }
}

export default complete; 