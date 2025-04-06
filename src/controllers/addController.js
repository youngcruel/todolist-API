import activityService from '../services/ActivityService.js'; 

const add = async (req, res) => {
    const data = { ...req.body, userId: req.userId };
  
    try {
      const activity = await activityService.addActivity(data);
      res.status(201).json(activity); // Risponde con l'attività appena creata; .toJSON() se usiamo la classe Activity
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  };
  
  export default add;
  