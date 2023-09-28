import axios from "axios";

const local_host_instance = axios.create({
    baseURL: 'http://localhost:5001',
    timeout: 5000
});

export const update_matrix = (id_game, x, y, i, j) => {
    return local_host_instance.get('/update-matrix/'+ id_game + '-' + x + '-' + y + '-' + i +'-'+ j)
}
export const login = (player) => {
    return local_host_instance.post('/login/', player)
}
export const signin = (player) => {
    return local_host_instance.post('/signin/', player)
}
export const list_online_players = () => {
    return local_host_instance.get('/list-online-players')
}
export const list_all_lobbies = () => {
    return local_host_instance.get('/list-all-lobbies')
}
export const create_lobby = (email) => {
    return local_host_instance.post('/create-lobby/', {'email': email})
}
export const join_lobby = (id_lobby, email) => {
    return local_host_instance.post('/join-lobby/', {'email': email, 
                                                    'id_lobby': id_lobby})
}
export const start_game = (id_lobby) => {
    return local_host_instance.post('/start-game/', {'id_lobby': id_lobby})
}