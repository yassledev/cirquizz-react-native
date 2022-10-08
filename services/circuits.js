import Datastore from 'react-native-local-mongodb';
import { DB_CIRCUIT_DOWNLOADED, DB_GAME, MOBILE_URL, HEADER } from '../constants/Request';
import { AsyncStorage } from 'react-native';

insertGame = (game) => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            try{
                const g = await db.insertAsync({...game})
                resolve(game);
            } catch (error) {
                reject(error);
            }
        });
    });
}

insertAllGames = (games) => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            try{
                const g = await db.insertAsync(games);
                resolve(g);
            } catch (error) {
                console.warn(error);
                reject(error);
            }
        });
    })
}

insertAllCircuits = (circuits) => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });
        await db.loadDatabaseAsync( async () => {
            try{
                const g = await db.insertAsync(circuits);
                resolve(g);
            } catch (error) {
                console.warn(error);
                reject(error);
            }
        });
    })
}


insertDownloadedCircuit = (circuit) => {
    return new Promise((resolve, reject) => {
        let db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });

        db.loadDatabase(async () => {
            const c = await db.insertAsync({...circuit});   
            resolve(c);         
        });
    })

}

checkGameId = async (id) => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            try{
                const g = await db.findOneAsync({'version_id': id});
                resolve(g);
            } catch (error) {
                reject(error);
            }
        });
    });
}

checkExistedGame = async (games) => {
    return new Promise(async (resolve, reject) => {
        const my_games = await module.exports.CircuitStarted();
        const circuits_downloaded = await module.exports.CircuitDownloaded();
        const user = JSON.parse(await AsyncStorage.getItem('user'));

        const all_games = games.filter((g) => {
            return !my_games.some((mg) => {
                return (g.version_id === mg.version_id) && (user.id === mg.user_id);
            })
        });
        
        await this.insertAllGames(all_games);

        const all_downloaded = all_games.filter((al) => {
            return !circuits_downloaded.some((cd) => {
                return al.version_id === cd.id
            });
        });
        

        if(all_downloaded.length === 0){
            resolve('F');
        } else {
            let res = [];
            all_downloaded.map(async (a) => {
                const d = await this.downloadGame2(a.version_id);
                res.push(d);
                if(res.length === all_downloaded.length){
                    await this.insertAllCircuits(res);
                    resolve('F');
                }
            });
        }

    });
}

downloadGame2 = (id) => {
    return new Promise((resolve, reject) => {
        fetch(MOBILE_URL + '/courses/' + id + '/download',{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
    })
}
downloadGame = (id) => {
    return new Promise((resolve, reject) => {
        fetch(MOBILE_URL + '/courses/' + id + '/download',{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then(async (res) => {
            const d = await this.insertDownloadedCircuit(res);
            resolve(d);
        })
        .catch((err) => {
            reject(err);
        });
    })
}

exports.isCircuitDownloaded = (version) => {
    return new Promise(async(resolve, reject) => {
        const db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });
        await db.loadDatabaseAsync(async (err) =>  {  
            try {
                // Check if circuit is already
                resolve(await db.findOneAsync({id: version}));
            } catch (error) {
                reject(error);
            }
        });
    })
}
exports.CreateGame = (version) => {
    return new Promise(async(resolve, reject) => {
        HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + `/games/start/${version}`,{
            method: 'POST',
            headers: HEADER
        })
        .then((res) => {
            return res.json()
        })
        .then(async (game) => {
            await this.insertGame(game);
            resolve(game);
        })
        .catch((err) => {
            reject(err);
        })
    });
    
}

exports.synchroCircuits = () => {
    return new Promise(async (resolve, reject) => {
        const my_games = await module.exports.CircuitStarted();
        const circuits_downloaded = await module.exports.CircuitDownloaded();
        
        const all_downloaded = my_games.filter((al) => {
            return !circuits_downloaded.some((cd) => {
                return al.version_id === cd.id
            });
        });

        let res = 0;
        all_downloaded.map(async (a) => {
            await this.downloadGame(a.version_id);
            res ++;
            if(res === all_downloaded.length){
                resolve("Finished");
            }
        });
        //
    })

}
exports.synchroGames = () =>  {
    return new Promise(async (resolve, reject) => {
        HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + '/games', {
            headers: HEADER
        })
        .then((data) => data.json())
        .then(async (res) => {
            await this.checkExistedGame(res);
            resolve(res);
        })
        .catch((err) => {
            reject(err)
        });
    });

}


exports.CircuitDownloaded = () => {
    return new Promise(async (resolve, reject) => {
        const db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });
        await db.loadDatabaseAsync(async (err) =>  {  
            try {
                // Check if circuit is already
                resolve(await db.findAsync({}));
            } catch (error) {
                reject(error);
            }
        });
    });
}

exports.CircuitStarted =  () => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            try{
                const games = await db.findAsync({});
                resolve(games);
            } catch (error) {
                reject(error);
            }
        });
    });
}

exports.getGameId =  (version) => {
    return new Promise(async (resolve, reject) => {
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            try{
                const game = await db.findOneAsync({'version_id': version});
                resolve(game);
            } catch (error) {
                reject(error);
            }
        });
    });
}

export const CircuitFinished = async () => {

    let db = new Datastore({ filename: DB_GAME });

    await db.loadDatabaseAsync( async () => {
        try{
            return await db.findAsync({finished: true});
        } catch (error) {
            console.log(error);
        }
    });
}