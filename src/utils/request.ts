import {XAS_BACKEND_URL, DOLPHIN_BASE_URL, JAGUAR_BASE_URL} from "@/settings";
import store, {ApplicationDSModule, CacheControlDsModule} from "@/store";
import Vue from 'vue';
import {createToastNotification} from './toast';
import router from '@/router';
import {Http} from '@/utils/providers'
import hash from 'object-hash';

// - Singleton instance of Axios provider not axios iteself,
// - This singleton AxiosProvider instance just provide basic singleton axiosInstance for get, post, fetch etc. methods
// - This constructor providing only bare initials for above methods, it's a fake Constructor
// - Real constructor  is .create(), which just swaps axiosInstance with config based instance

// Fully compatible with existing code, only this line needs to be added and it works out-of-the-box
const axios = new Http();

//TODO implement refresh authenticaiton logic
// const refreshAuthLogic = (failedRequest: any) => axios.post('https://www.example.com/auth/token/refresh').then(tokenRefreshResponse => {
//     localStorage.setItem('token', tokenRefreshResponse.data.token);
//     failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.token;
//     return Promise.resolve();
// });

// For eg. this is the real Constructor providing AxiosInstance
export const DolphinService = axios.create({
    baseURL: DOLPHIN_BASE_URL,
    timeout: 0
    // withCredentials: true // send cookies when cross-domain requests
})

 function getStatusText(error) {
    let message = ""
    if (error?.response?.data?.message) {
        message = error.response.data.message
    } else if (error?.response?.statusText) {
        message = error.response.statusText
    } else if (error?.response?.status) {
        message = error.response?.status
    } else {
        message = error
    }
    return message || ''
 }

DolphinService.interceptors.request.use(
    (config) => {
        if (ApplicationDSModule.dolphinToken) {
            config.headers['Authorization'] = 'Bearer ' + ApplicationDSModule.dolphinToken;
        }
        const cacheControl =  CacheControlDsModule.getCacheControl(hash({baseURL: config.baseURL, params: config.params}) );
        if(cacheControl){
            config.headers['cache-control'] = cacheControl.cacheControl ;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';

        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

DolphinService.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response.headers["cache-control"]){
        store.dispatch('cachecontrolds/saveCacheControl', {cacheControl: response.headers["cache-control"] , response: response })
    }
    return response;
    }, async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status == 401) {
        ApplicationDSModule.setDolphinToken('')
        await router.push({ name: "HomePage" })
        Vue.swal({title:'Oops, your session has expired. Lets try to log in again!',
            heightAuto: false
        }).then(
            await ApplicationDSModule.redirectToCAS
        )
    } if (error.response?.status == 304) {
        const cacheControl =  CacheControlDsModule.getCacheControl(hash({baseURL: error.config.baseURL, params: error.config.params}) );
        return cacheControl ? cacheControl.respons : "" ;
    } else {
        const message = getStatusText(error)
        createToastNotification(message, {type: 'error', position: 'bottom'})
    }
    console.log('ERROR: ' + error)
    return Promise.reject(error);
});

// DolphinService.interceptors.response.use(
//     (response) => {
//         // Some example codes here:
//         // code == 20000: success
//         // code == 50001: invalid access token
//         // code == 50002: already login in other place
//         // code == 50003: access token expired
//         // code == 50004: invalid user (user not exist)
//         // code == 50005: username or password is incorrect
//         // You can change this part for your own usage.
//         const res = response.data
//         // if (res.code !== 20000) {
//         //     if (res.code === 401) {
//         //         Vue.swal('Oops, your session has expired. Lets try log in again!').then(
//         //             UserDSModule.redirectToCAS
//         //         )
//         //     }
//         //     return Promise.reject(new Error(res.message || 'Error'))
//         // } else {
//             return response.data
//         // }
//     },
//     (error) => {

//         return Promise.reject(error)
//     }
// )


export const PandaService = axios.create({
    baseURL: XAS_BACKEND_URL,
    timeout: 0
    // withCredentials: true // send cookies when cross-domain requests
})

PandaService.interceptors.request.use(
    (config) => {
        if (ApplicationDSModule.dolphinToken) {
            config.headers['Authorization'] = 'Bearer ' + ApplicationDSModule.dolphinToken;
        }

        config.headers['Content-Type'] = 'application/json;charset=UTF-8';

        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

PandaService.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
    }, async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status == 401) {
        ApplicationDSModule.setDolphinToken('')
        await router.push({ name: "HomePage" })
        Vue.swal({title:'Oops, your session has expired. Lets try to log in again!',
            heightAuto: false
        }).then(
            await ApplicationDSModule.redirectToCAS
        )
    } else {
        const message = getStatusText(error)
        createToastNotification(message, { type: 'error', position: 'bottom' })
    }
    console.log('ERROR: ' + error)
    return Promise.reject(error);
});



export const JaguarService = axios.create({
    baseURL: JAGUAR_BASE_URL,
    timeout: 0
    // withCredentials: true // send cookies when cross-domain requests
})

JaguarService.interceptors.request.use(
    (config) => {
        if (ApplicationDSModule.dolphinToken) {
            config.headers['Authorization'] = `Bearer ${ApplicationDSModule.dolphinToken}`;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

JaguarService.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
    }, async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status == 401) {
        ApplicationDSModule.setDolphinToken('')
        await router.push({ name: "HomePage" })
        Vue.swal({title:'Oops, your session has expired. Lets try to log in again!',
            heightAuto: false
        }).then(
            await ApplicationDSModule.redirectToCAS
        )
    }else {
        const message = getStatusText(error)
        createToastNotification(message, { type: 'error', position: 'bottom' })
    }
    console.log("ERROR: " + error)
    return Promise.reject(error);
});
