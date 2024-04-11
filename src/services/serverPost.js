import axios from 'axios'

const username = process.env.REACT_APP_SLIM_USERNAME
const password = process.env.REACT_APP_SLIM_PASSWORD
const auth = {username, password}

const serverPostApi = (apiBaseUrl, irl,  input, handleReply) => {
    const url = irl.slice(0,4).toLowerCase().localeCompare('http')===0?irl:apiBaseUrl + irl
    const axiosConfig = {
        auth,
    }
    axios.post(url, input, axiosConfig)
    .then(reply => {
        const data = reply.data?reply.data:reply
        if (data) {
            if (data.status ==='OK') {
                const message = '[serverPost] status:OK data:' + JSON.stringify(data)
                console.log(message)
            } else {
                const message = '[serverPost] status:' + data.status + ' data:' + JSON.stringify(data)
                console.log(message)
                alert(message)
            }    
            handleReply(data);
        } else {
            const message = '[serverPost] ERROR: No data in reply from axios.post'
            console.log(message)
            alert(message)
        }
    })
    .catch((e) => {
        const message = '[serverPost] ERROR: axios.post falied for url:' + url + ' message:' + e?.message
        console.log(message);
        alert(message)
    });
}

export const addRowApi = (apiBaseUrl, tableName, row, handleReply) =>
{
    const irl = '/admin/replaceRow'
    const value = {
        tableName,
        table:tableName,
        data:row
    }  

    serverPostApi(apiBaseUrl, irl, value, handleReply)
}

export const replaceRowApi = (apiBaseUrl, tableName, data, handleReply) =>
{
    const irl = '/admin/replaceRow'
    const value = {
        tableName,
        table:tableName,
        data,
    }  
    serverPostApi(apiBaseUrl, irl, value, handleReply)
}

export const deleteRowApi = (apiBaseUrl, tableName, id, handleReply) =>
{
    const url=apiBaseUrl + '/admin/deleteRow'
    const value = {
        tableName,
        table:tableName, 
        id
    }  
    serverPost(url, value, handleReply)
}

export const serverPost = (irl,  input, handleReply) => serverPostApi(process.env.REACT_APP_API_BASE_URL, irl, input, handleReply)
export const serverPost_SLIM4 = (irl,  input, handleReply) => serverPostApi(process.env.REACT_APP_API_BASE_URL_SLIM4, irl, input, handleReply)

export const replaceRow = (tableName, data, handleReply) => replaceRowApi(process.env.REACT_APP_API_BASE_URL, tableName, data, handleReply)
export const replaceRow_SLIM4 = (tableName, data, handleReply) => replaceRowApi(process.env.REACT_APP_API_BASE_URL_SLIM4, tableName, data, handleReply)

export const deleteRow = (tableName, data, handleReply) => deleteRowApi(process.env.REACT_APP_API_BASE_URL, tableName, data, handleReply)
export const deleteRow_SLIM4 = (tableName, data, handleReply) => deleteRowApi(process.env.REACT_APP_API_BASE_URL_SLIM4, tableName, data, handleReply)


