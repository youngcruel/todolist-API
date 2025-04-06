import activitySchema from "../schema/todoListSchema.js";
import MongoInternalException from "../exceptions/MongoInternalException.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import { status } from "../const/constant.js";
import Activity from "../models/Activity.js";

class ActivityRepository {
  // Aggiunge un'attività nel db
  async add(data) {
    const activity = await activitySchema.create(data).catch((_error) => {
      throw new MongoInternalException(
        "Errore nella creazione dell'attività",
        "ActivityRepository.add"
      );
    });

    return new Activity(activity);
  }

  // Restituisce tutte le attività (paginazione con skip e limit)
  async getActivities(userId, page, limit, status) {
    const skip = (page - 1) * limit;

    const activities = await activitySchema
      .find({ userId, status })
      .skip(skip)
      .limit(limit)
      .catch((error) => {
        throw new MongoInternalException(
          "Errore durante la ricerca delle attività",
          "ActivityRepository.getActivities"
        );
      });

    if (activities.length === 0) {
      throw new NotFoundException(
        "Attività non trovata",
        "ActivityRepository.getActivities"
      );
    }

    return activities.map((activity) => new Activity(activity));
  }

  // Cursore _id MongoDB
  async getActivitiesByCursor(userId, limit, cursor, direction, status) {
    const parsedLimit = parseInt(limit, 10) || 10;
    const filter = {
      userId,
      ...(status ? { status } : { status: { $ne: "deleted" } }), //Se non è presente lo stato, esclude le attività eliminate
    };

    let cursorQuery = {};

    if (cursor) {
      cursorQuery = {
        _id: direction === "next" ? { $gt: cursor } : { $lt: cursor },
      };
    }

    const query = { ...filter, ...cursorQuery };

    const activitiesResult = await activitySchema
      .find(query)
      .sort({ _id: 1 })
      .limit(parsedLimit)
      .catch((error) => {
        throw new MongoInternalException(
          "Error on getting activities by cursor",
          "ActivityRepository.getActivitiesByCursor"
        );
      });

    if (activitiesResult.length === 0) {
      throw new NotFoundException(
        "Attività non trovata",
        "ActivityRepository.getActivitiesByCursor"
      );
    }

    return activitiesResult.map((activity) => new Activity(activity));
  }

  // Cerca un'attività per ID e UserId
  async getActivity(activityId, userId) {
    const activity = await activitySchema
      .findOne({ _id: activityId, userId })
      .catch((_error) => {
        throw new MongoInternalException(
          "Errore durante la ricerca dell'attività:",
          "ActivityRepository.getActivity"
        );
      });

    if (!activity) {
      throw new NotFoundException(
        "Attività non trovata",
        "ActivityRepository.getActivity"
      );
    }

    return new Activity(activity);
  }

  // Aggiorna un'attività
  async updateActivity(id, data, userId) {
    const filter = { _id: id, userId };
    const context = "ActivityRepository.updateActivity";

    const activity = await this.updateByFilter(filter, data, context);
    return new Activity(activity);
  }

  // Completa un'attività
  async completeActivity(id, userId) {
    const filter = {
      _id: id,
      userId: userId,
      status: { $in: [status.OPEN, status.COMPLETED] },
    };
    const data = { $set: { status: status.COMPLETED } };
    const context = "ActivityRepository.completeActivity";
    const allowIdempotence = true;

    const activity = await this.updateByFilter(
      filter,
      data,
      context,
      allowIdempotence
    );
    return new Activity(activity);
  }

  // Riapre un'attività completata
  async reOpenActivity(id, userId) {
    const filter = {
      _id: id,
      userId: userId,
      status: { $in: [status.OPEN, status.COMPLETED] },
    };
    const data = { $set: { status: status.OPEN } };
    const context = "ActivityRepository.reOpenActivity";
    const allowIdempotence = true;

    const activity = await this.updateByFilter(
      filter,
      data,
      context,
      allowIdempotence
    );
    return new Activity(activity);
  }

  // Elimina un'attività (soft delete)
  async deleteActivity(id, userId) {
    const filter = {
      _id: id,
      userId,
      status: {
        $in: [status.OPEN, status.COMPLETED, status.DELETED, status.ARCHIVED],
      },
    };
    const data = { $set: { status: status.DELETED } };
    const context = "ActivityRepository.deleteActivity";
    const allowIdempotence = true;
    const activity = await this.updateByFilter(
      filter,
      data,
      context,
      allowIdempotence
    );

    return new Activity(activity);
  }

  // Archivia un'attività
  async archiveActivity(id, userId) {
    const filter = {
      _id: id,
      userId,
      status: {
        $in: [status.OPEN, status.COMPLETED, status.ARCHIVED],
      },
    };
    const data = { $set: { status: status.ARCHIVED } };
    const context = "ActivityRepository.archiveActivity";
    const allowIdempotence = true;

    const activity = await this.updateByFilter(
      filter,
      data,
      context,
      allowIdempotence
    );

    return new Activity(activity);
  }

  // Metodo generico per aggiornare un'attività in base a un filtro e dati (principio DRY)
  async updateByFilter(filter, data, context, allowIdempotence = false) {
    let activity = await activitySchema
      .findOneAndUpdate(filter, data, {
        new: true,
        upsert: false,
      })
      .catch((error) => {
        throw new MongoInternalException(
          "Errore durante l'aggiornamento dell'attività",
          context
        );
      });

    // Se non ha aggiornato nulla ma l'idempotenza è true
    if (!activity && allowIdempotence) {
      activity = await activitySchema.findOne(filter);
    }

    if (!activity) {
      throw new NotFoundException(
        "Attività non trovata o non aggiornata",
        context
      );
    }

    return activity;
  }
}

export default new ActivityRepository();
