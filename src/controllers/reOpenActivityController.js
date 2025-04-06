import activityService from "../services/ActivityService.js";

const reOpen = async (req, res) => {
  const activityId = req.params.id;
  const userId = req.userId;

  try {
    const activity = await activityService.reOpenActivity(activityId, userId);

    res.status(200).json(activity);
  } catch (error) {
    //console.error("ERRORE NEL CONTROLLER:", error);
    res.status(error.status).json({ message: error.message, code: error.code });
  }
};

export default reOpen;
