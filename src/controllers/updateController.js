import activityService from "../services/ActivityService.js";

const update = async (req, res) => {
  const activityId = req.params.id;
  const data = req.body;
  const userId = req.userId;

  try {
    const activity = await activityService.updateActivity(
      activityId,
      data,
      userId
    );
    res.status(200).json(activity);
  } catch (error) {
    res.status(error.status).json({ code: error.code, message: error.message });
  }
};

export default update;