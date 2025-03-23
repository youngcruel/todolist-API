import userService from "../services/userService.js"; 

const register = async (req, res) => { 

    const data = req.body;  
    try {  
        
        const user = await userService.register(data); 

        if (!user) { 
            throw new NotFoundException("Errore durante la creazione dell'utente", 'registerController.register');

            //return res.status(500).json({ message: "Errore durante la creazione dell'utente" }); 
        }

        return res.status(201).json({ message: "Registrazione riuscita! Controlla la tua email per confermare l'account." }); 
    } catch (error) {
        res.status(error.status).json({ message: error.message }); 
    }
};

export default register; 