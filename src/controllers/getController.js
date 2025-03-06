import activityService from '../services/activityService.js';

const get = async (req, res) => {
    const activityId = req.params.id;
    const activity = await activityService.getActivity(activityId);
    if (activity) {
        res.status(200).json(activity);
    }
    else {
        res.status(404).json({ message: 'Not found' });
    }
}

export default get;