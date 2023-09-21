import axios from "axios";

const local_host_instance = axios.create({
    baseURL: 'http://localhost:5001',
    timeout: 5000
});

export const update_matrix = (x, y, i, j) => {
    return local_host_instance.get('/update-matrix/'+ x + '-' + y + '-' + i +'-'+ j)
}