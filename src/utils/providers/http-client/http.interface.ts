import {AxiosInstance, AxiosRequestConfig as AXConfig, AxiosResponse, Canceler} from 'axios';
import {Data} from 'electron';

export type AxiosRequestConfig = AXConfig & Partial<{
	retryCount: number
	timeout: number | undefined
	useCache?: boolean
	updateStore?: boolean
	defaults?: AxiosRequestConfig & {instance: AxiosInstance}
	cancel?: Canceler
	instance?: AxiosInstance
	interceptorReqCallback?: (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
	interceptorResCallback?: (value: AxiosResponse<Response>) => AxiosResponse<Response> | Promise<AxiosResponse<Response>>
}>

interface Response {
	data: Data
	status: number
	statusText: string
	headers: Headers
	config: AxiosRequestConfig
	request: Request
}

interface Err {
	message: string
	name: string
	stack: string
	config: AxiosRequestConfig
	code: string
}
