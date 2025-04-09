import userService from '../services/UserService.js'; 

const activate = async (req, res) => { 
    const token = req.params.token; 
    
    try {
        console.log("token", token);
        const user = await userService.activate(token); 

        res.status(200).json(user); 
    } catch (error) {
        console.log("error", error);
        res.status(error.status).json({ message: error.message }); 
    }
}

export default activate; 