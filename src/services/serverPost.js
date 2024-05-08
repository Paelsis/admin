import axios from 'axios'

const username = process.env.REACT_APP_SLIM_USERNAME
const password = process.env.REACT_APP_SLIM_PASSWORD
const auth = {username, password}

const serverPostApi = (apiBaseUrl, irl,  record, handleReply) => {
    const url = irl.slice(0,4).toLowerCase().localeCompare('http')===0?irl:apiBaseUrl + irl
    const axiosConfig = {
        auth,
    }
    axios.post(url, record, axiosConfig)
    .then(reply => {
        const data = reply.data?reply.data:reply
        if (data) {
            if (data.status ==='OK') {
                const message = '[serverPost] status:OK data:' + JSON.stringify(data)
                console.log(message)
            } else {
                const message = '[serverPost] status:' + data.status + ' record:' + JSON.stringify(record) + ' data:' + JSON.stringify(data) 
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
    const irl = '/replaceRow'
    const value = {
        tableName,
        table:tableName,
        data:row
    }  

    serverPostApi(apiBaseUrl, irl, value, handleReply)
}

export const replaceRowApi = (apiBaseUrl, tableName, record, handleReply) =>
{
    const irl = '/replaceRow'
    const value = {
        tableName,
        record,
    }  
    serverPostApi(apiBaseUrl, irl, value, handleReply)
}

export const deleteRowApi = (apiBaseUrl, tableName, id, handleReply) =>
{
    const url=apiBaseUrl + '/deleteRow'
    const value = {
        tableName,
        table:tableName, 
        id
    }  
    serverPost(url, value, handleReply)
}

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL_SLIM4

export const serverPost = (irl,  record, handleReply) => serverPostApi(apiBaseUrl, irl, record, handleReply)
export const replaceRow = (tableName, record, handleReply) => replaceRowApi(apiBaseUrl, tableName, record, handleReply)
export const deleteRow = (tableName, record, handleReply) => deleteRowApi(apiBaseUrl, tableName, record, handleReply)


