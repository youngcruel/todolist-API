import activityService from '../services/activityService.js';

const update = async (req, res) => {
    const activityId = req.param('id');
    const data = req.body;
    const activity = await activityService.updateActivity(activityId, data);
    if(activity){
        res.status(200).json(activity)
    } else {
        res.status(404).json({message: "activity not found"})
    }
}

export default update;