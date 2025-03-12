export const status = {   //Creazione di un oggetto status con i possibili stati di un'attività
    OPEN: 'open',         //Stato aperto
    DONE: 'done',         //Stato completato
    DELETED: 'removed',   //Stato rimosso
    };

export const userStatus = {  //Creazione di un oggetto userStatus con i possibili stati di un utente
    ACTIVE: 'active',       //Stato attivo
    PENDING: 'pending',     //Stato inattivo
    DELETED: 'deleted',     //Stato rimosso
    };

//Entrambi gli oggetti sono esportati utilizzando export, 
//il che significa che possono essere importati e utilizzati in altri file dell'applicazione.
//Questi oggetti contengono i possibili stati di un'attività e di un utente,
//che possono essere utilizzati per definire lo stato di un'attività o di un utente nel database.
