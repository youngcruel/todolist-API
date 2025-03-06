import config from '../../config/config.js';
import fs from 'fs';
import readline from 'readline';
import activityRepository from '../repository/activityRepository.js';


const dbFile = config.dbFile;


//Aggiunge una nuova attività
const addActivity = async (data) => {
    return await activityRepository.add(data);
};

const getActivities = async () => {
    return await activityRepository.getActivities();
};

//Cerca un'attività per ID
const getActivity = async (id) => {
    // Controlla se il file esiste prima di leggerlo
    if (!fs.existsSync(dbFile)) {
        return null; // Se il file non esiste, restituisce `null`
    }

    try {
        return await new Promise((resolve, reject) => {
            // Crea un'interfaccia per leggere il file riga per riga
            const readlineInterface = readline.createInterface({
                input: fs.createReadStream(dbFile), // Apre il file in modalità lettura streaming
                crDelay: Infinity // Evita problemi con i caratteri di fine riga tra sistemi operativi diversi
            });

            // Evento che si attiva ogni volta che viene letta una riga
            readlineInterface.on('line', (line) => {
                const activity = JSON.parse(line); // Converte la riga in un oggetto JSON
                if (activity.id == id) { // Se l'ID della riga corrisponde a quello cercato
                    resolve(activity); // Risolve la Promise restituendo l'attività trovata
                }
            });

            // Evento che si attiva quando si raggiunge la fine del file
            readlineInterface.on('close', () => {
                return reject(new Error('not found')); // Se non trova l'attività, rifiuta la Promise
            });
        });
    } catch (e) {
        console.error("Errore nella lettura dell'attività:", e.message);
        return null; // In caso di errore nel parsing del JSON o altro, restituisce `null`
    }
};

const updateActivity = async (id, data) => {
    if (!fs.existsSync(dbFile)) {
        return null;
    }
    try {
        return await new Promise((resolve, reject) => {
            const readlineInterface = readline.createInterface({
                input: fs.createReadStream(dbFile),
                crifDelay: Infinity
            });
            const activities = [];
            let activity;
            readlineInterface.on('line', line => {
                const tempActivity = JSON.parse(line);
                if (tempActivity.id == id) {
                    Object.keys(data).forEach(key => {
                        tempActivity[key] = data[key];
                    //for(let [key, item] of Object.entries(data)){
                    //activity[key] = item;}
                    });
                    activity = {...tempActivity};
                }
                activities.push(JSON.stringify(activity));
    });
    readlineInterface.on('close', () => {
        fs.writeFileSync(dbFile, activities.join('\n'), error => {
            if (error) {
                reject(null);
            }
            resolve(activity);
        });
    });
})
    } catch (error) {
        return null;
    }
}

export default { addActivity, getActivities, getActivity, updateActivity };
