import axios, {AxiosError, AxiosInstance, AxiosResponse, AxiosStatic, CancelTokenSource} from 'axios';
import {AxiosRequestConfig} from './http.interface';

const DEBUG = false;

const axiosStatic: AxiosStatic = axios

const DEFAULT_REQUEST_TIMEOUT = 5500;
// const TIMEOUT_INCREMENT = 2500

axiosStatic.defaults['retryCount'] = 0
axiosStatic.defaults['timeout'] = DEFAULT_REQUEST_TIMEOUT
axiosStatic.defaults.responseType = 'json';
axios.defaults['Cache-Control'] = 'max-age=180'

export class Http {
    axiosInstance!: AxiosInstance

    constructor(config?: AxiosRequestConfig) {
        // This is required to call hooked methods of get/patch/post/delete etc.
        // This is default fake constructor
        const staticConfig: AxiosRequestConfig = this._initConfig({defaults: axiosStatic.defaults, ...config} as AxiosRequestConfig)
        this.axiosInstance = this._createInstance(staticConfig);
    }

    create(config: AxiosRequestConfig) {
        // A real constructor, generate instance based on provided config
        // Inject many hooks and references for the retry
        const axiosConfig: AxiosRequestConfig = this._initConfig(config);
        this.axiosInstance = this._createInstance(axiosConfig);
        return this.axiosInstance;
    }
    private _initConfig(config: AxiosRequestConfig): AxiosRequestConfig {
        const axiosSource: CancelTokenSource = axios.CancelToken.source();
        return {...axiosStatic.defaults, cancel: axiosSource.cancel, timeout: axios.defaults['timeout'], ...config};
    }
    private _createInstance(config: AxiosRequestConfig): AxiosInstance {
        const service: AxiosInstance = axiosStatic.create(config);
        service.defaults['instance'] = this.axiosInstance;
        service.interceptors.response.use(this._successHandler, this._errorHandler);
        return service;
    }
    private _successHandler<T = any, R = AxiosResponse<T>>(response: R | Promise<R>): R | Promise<R> {
        return response;
    }
    private async _errorHandler<T = any, E = AxiosError<T>>(err: any): Promise<E> {
        const {code, config, response} = err;
        const {retryCount, cancel, instance, cancelToken} = config;
        if (code === 'ECONNABORTED' && !response) {
            if (retryCount < 3) {
                const axiosInstance = instance;
                const newRetryCount = retryCount + 1;
                const newTimeout = 0;
                // if(config.fileSize){
                //     newTimeout =  timeout + ((config.fileSize/1024) * 30) + TIMEOUT_INCREMENT ;
                // }else {
                //     newTimeout = timeout + TIMEOUT_INCREMENT;
                // }

                const originalConfig = {...config, timeout: newTimeout, retryCount: newRetryCount, instance: axiosInstance, cancel: cancel};
                if (DEBUG)
                    console.log(`request for URL ${originalConfig.url ?? originalConfig.baseURL} failed.\n Retrying request for URL ${originalConfig.url ?? originalConfig.baseURL}.\n with new Retrying count: ${originalConfig.retryCount}.\n and with new Timeout :${originalConfig.timeout}`);
                try {
                    return await axiosInstance.request(originalConfig)
                } catch (e) {
                    cancelToken?.cancel();
                    return Promise.reject(e)
                }
            }
        }
        return Promise.reject(err)
    }
    // async get<T = any, R = AxiosResponse<T>>(path: string, callback?: any): Promise<R> {

    //     // This is hooked modified method
    //     const response: AxiosResponse<T> = await this.axiosInstance.get<T>(path);
    //     return callback ? callback(response.status, response.data) : response;
    // }

    // async patch<T = any, R = AxiosResponse<T>>(path: any, payload: any, callback?: any): Promise<R> {
    //     // This is hooked modified method
    //     const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
    //         method: 'PATCH',
    //         url: path,
    //         responseType: 'json',
    //         data: payload
    //     } as AxiosRequestConfig);
    //     return callback ? callback(response.status, response.data) : response;
    // }

    // async post<T = any, R = AxiosResponse<T>>(path: string, payload?: any, callback?: any): Promise<R> {
    //     // This is hooked modified method
    //     const response: AxiosResponse<T> = await this.axiosInstance.request<T>({
    //         method: 'POST',
    //         url: path,
    //         responseType: 'json',
    //         data: payload
    //     } as AxiosRequestConfig);
    //     return callback ? callback(response.status, response.data) : response;
    // }
}
