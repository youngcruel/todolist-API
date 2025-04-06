import dotenv from 'dotenv';
dotenv.config(); 

const config = {   
    dbFile: 'activity.db', 
    host: 'localhost',    
    port: 8000,           
    db: {
        //host: 'localhost',  //Versione vecchia per usare il database locale
        //port: 27017, 
        //name: 'todolist'
        connectionString: process.env.MONGO_URI 
    },
    mailConfig: {                          
        host: 'smtp.gmail.com',            
        port: 465,                         
        secure: true,                     
        auth: {                        
            user: process.env.MAIL_USER,  
            pass: process.env.MAIL_PASS,   
        }
    },
    accessTokenExpiration: 3600,   
    refreshTokenExpiration: 86400,   
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  }
export default config; 