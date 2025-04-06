import activityService from "../services/ActivityService.js";
import cursorNormalizer from "../normalizer/cursorNormalizer.js";

const getMany = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1; // Se non presente, usa il valore di default 1
  const limit = parseInt(req.query.limit) || 10; // Se non presente, usa il valore di default 10
  const status = req.query.status || "open"; // Se non presente, usa il valore di default "open"

  try {
    const activities = await activityService.getActivities(
      userId,
      page,
      limit,
      status
    );

    res.status(200).json(activities);
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
};

const getActivitiesByCursor = async (req, res) => {
  try {
    const userId = req.userId;
    const { cursor, limit, direction, status } = req.query;

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedDirection = direction === "prev" ? "prev" : "next";

    const activitiesResult = await activityService.getActivitiesByCursor(
      userId,
      parsedLimit,
      cursor,
      parsedDirection,
      status
    );

    const { activities, nextCursor, prevCursor } =
      cursorNormalizer(activitiesResult);

    return res.status(200).json({
      activities,
      nextCursor,
      prevCursor,
      direction: parsedDirection,
    });
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
};

export { getMany, getActivitiesByCursor };
