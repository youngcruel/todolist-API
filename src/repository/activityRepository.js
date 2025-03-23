import MongoInternalException from "../exceptions/MongoInternalException.js"; //Importo messaggio di errore
import NotFoundException from "../exceptions/NotFoundException.js";
import activitySchema from "../schema/todoListSchema.js"; //Importo il modello Activity e lo schema activitySchema (Schema di Mongoose) per interagire con il database.
import {status} from '../const/constant.js'
import Activity  from "../models/Activity.js";

// add - CREATE
const add = async (data) => {
  const activity = await activitySchema.create(data).catch((error) => {
   throw new MongoInternalException("Errore durante l'aggiunta di un'attività:", "activityRepository.add");
  });
  return new Activity(activity);
  //return activity.toJSON({ flattenObjectIds: true, versionKey: false }); 
};

// getActivities - READ
const getActivities = async (userId, skip, limit) => {
  const activities = await activitySchema
    .find({
      userId,
      status: { $ne: status.DELETED },
    })
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit)
    .catch((error) => {
      throw new MongoInternalException('Error on getting activities', 'activityRepository.getActivities');
    });
  return activities.map((activity) => new Activity(activity));
};

// Cursore _id MongoDB - Trova activity per id mongo
const getActivitiesByCursor = async (userId, limit, cursor, direction) => {
  console.log('cursor in repository:', cursor);

  if (typeof cursor !== 'string' || cursor.length !== 24) {
    throw new Error('Cursor not valid.');
  }
  const order = direction === 'next' ? 1 : -1;
  const parsedLimit = parseInt(limit, 10) || 10;
  const filter = { userId, status: { $ne: 'Deleted' } };

  let cursorQuery = {};

  if (cursor) {
    console.log('Received cursor:', cursor);
    console.log('Type of cursor:', typeof cursor);
    cursorQuery = {
      _id: direction === 'next' ? { $gt: cursor } : { $lt: cursor },
    };
  }

  const query = { ...filter, ...cursorQuery };
  console.log('Query to MongoDB:', query);

  const activitiesResult = await activitySchema
    .find(query)
    .sort({ _id: order })
    .limit(parsedLimit)
    .catch((error) => {
      throw new MongoInternalException(
        'Error on getting activities by cursor',
        'activityRepository.getActivitiesByCursor'
      );
    });
  return activitiesResult;
};

// getActivity - READ

const getActivity = async (id, userId) => {
  const activity = await activitySchema.findOne({ _id: id, userId }).catch((error) => {
    throw new MongoInternalException('Error on getting activity:', 'activityRepository.getActivity');
  });
  if (!activity) {
    throw new NotFoundException('Activity not found', 'activityRepository.getActivity');
  }
  return activity.toJSON({ flattenObjectIds: true, versionKey: false });
};

// updateActivity - UPDATE

const updateActivity = async (id, userId, data) => {
  const activity = await activitySchema
    .findOneAndUpdate({ _id: id, userId: userId }, data, { upsert: false, new: true })
    .catch((error) => {
      throw new MongoInternalException('Error on updating activity:', 'activityRepository.updateActivity');
    });
  if (!activity) {
    throw new NotFoundException('Activity not found or not updated', 'activityRepository.updateActivity');
  }
  return activity ? activity.toJSON({ flattenObjectIds: true, versionKey: false }) : null;
};

// completeActivity- segna activity come completed

const completeActivity = async(id, userId) => {

   const activity = await activitySchema
   .findOneAndUpdate(
     { _id: id, userId: userId, status: {$in: [status.OPEN, status.COMPLETED]} }, 
     { $set: {status: status.COMPLETED} } ,
     {upsert: false, new: true}
   )
 return new Activity(activity);
 //Se l'attività viene trovata, viene restituita in formato JSON, altrimenti null
};

export default { add, getActivities, getActivity, getActivitiesByCursor, updateActivity, completeActivity }; 
