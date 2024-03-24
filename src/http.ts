// src/utils/http.ts
import { RequestMethod, type ParamsType, type RequestConfig } from './httpsType';
import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { baseRequestInterceptorFulfilled, baseResponseInterceptorRejected, requestController } from './interceptor';

class PoAxios {
	constructor(private axiosInstance: AxiosInstance) {
		this.setupInterceptors();
	}
	get<T>(url: string, params?: ParamsType): Promise<AxiosResponse<T>> {
		return this.customAxiosRequest({
			url,
			method: RequestMethod.GET,
			params,
		});
	}
	post<T>(url: string, params?: ParamsType): Promise<AxiosResponse<T>> {
		return this.customAxiosRequest({
			url,
			method: RequestMethod.POST,
			params,
		});
	}
	put<T>(url: string, params?: ParamsType): Promise<AxiosResponse<T>> {
		return this.customAxiosRequest({
			url,
			method: RequestMethod.PUT,
			params,
		});
	}
	delete<T>(url: string, params?: ParamsType): Promise<AxiosResponse<T>> {
		return this.customAxiosRequest({
			url,
			method: RequestMethod.DELETE,
			params,
		});
	}
	options<T>(url: string, params?: ParamsType): Promise<AxiosResponse<T>> {
		return this.customAxiosRequest({
			url,
			method: RequestMethod.OPTIONS,
			params,
		});
	}
	cancelRequest(url: string) {
		const controller = requestController.get(url);
		if (controller) {
			controller.abort();
		}
	}
	cancelAllRequest() {
		requestController.forEach((controller) => {
			controller.abort();
		});
	}
	customAxiosRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		return new Promise((resolve, reject) => {
			this.axiosInstance(config).then(resolve).catch(reject);
		});
	}
	setupInterceptors() {
		// 请求拦截器
		this.axiosInstance.interceptors.request.use((config: RequestConfig) => {
			return baseRequestInterceptorFulfilled(config);
		}, undefined);

		// 响应拦截器
		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				return baseResponseInterceptorRejected(error, this);
			}
		);
	}
}

export default PoAxios;
