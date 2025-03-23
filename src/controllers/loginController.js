import userService from "../services/userService.js";

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        console.log('logincontroller console log')
        const loginResponse = await userService.login(email, password);
        return res.status(200).json(loginResponse);
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({message: error.message})
    }
};

export default login;