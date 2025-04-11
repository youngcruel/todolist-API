import ActivityRepository from "../repository/ActivityRepository.js";

class ActivityService {
  async addActivity(data) {
    return await activityRepository.add(data);
  }

  async getActivities(userId, page, limit, status) {
    return await activityRepository.getActivities(userId, page, limit, status);
  }

  async getActivitiesByCursor(userId, limit, cursor, direction, status) {
    return await activityRepository.getActivitiesByCursor(
      userId,
      limit,
      cursor,
      direction,
      status
    );
  }

  async getActivity(activityId, userId) {
    return await activityRepository.getActivity(activityId, userId);
  }

  async updateActivity(activityId, data, userId) {
    return await activityRepository.updateActivity(activityId, data, userId);
  }

  async completeActivity(activityId, userId) {
    return await activityRepository.completeActivity(activityId, userId);
  }

  async reOpenActivity(activityId, userId) {
    return await activityRepository.reOpenActivity(activityId, userId);
  }

  async archiveActivity(activityId, userId) {
    return await activityRepository.archiveActivity(activityId, userId);
  }

  async deleteActivity(activityId, userId) {
    return await activityRepository.deleteActivity(activityId, userId);
  }
}

export default new ActivityService();