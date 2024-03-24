import type { RequestConfig, RequestControllerTypes } from './httpsType';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type PoAxios from './http';

export const requestController: Map<string | undefined, RequestControllerTypes> = new Map();
// 请求拦截
export const baseRequestInterceptorFulfilled = (config: RequestConfig) => {
	const controller = new AbortController();
	config.signal = controller.signal;
	let shouldRetry;
	if (config.params?.retryConfig && config.params?.retryConfig.retry) {
		config.__retry = config.params.retryConfig.retry;
		config.__retryCount = config.params.retryConfig?.retryCount || 3;
		config.__delay = config.params.retryConfig?.retryDelay || 300;
		shouldRetry = config.params.retryConfig.shouldRetry;
		delete config.params.retryConfig;
	}
	if (config.__retry) {
		config.__retries = config.__retries ? config.__retries + 1 : 1; // 当前重试次数
	}
	const originController = requestController.get(config.url);
	if (originController) {
		shouldRetry = originController?.shouldRetry;
	}
	requestController.set(config.url, {
		abort: controller.abort.bind(controller),
		shouldRetry,
	});
	return config;
};

export const baseResponseInterceptorRejected = async (error: AxiosError, instance: PoAxios) => {
	if (!axios.isAxiosError(error)) {
		throw error;
	}
	if (axios.isCancel(error)) {
		return Promise.reject(error);
	}
	const { __retryCount, __retries, __retry, __delay } = (error as any).config as RequestConfig;

	if (!__retry) {
		return Promise.reject(error);
	}
	if (__retryCount <= __retries) {
		return Promise.reject(error);
	}
	const controller = requestController.get((error as any).config?.url);
	let retryFlag = true;
	if (controller && controller.shouldRetry) {
		retryFlag = controller.shouldRetry(error as any);
	}
	if (!retryFlag) return Promise.reject(error);
	// 请求重试
	await new Promise((resolve) => {
		setTimeout(resolve, __delay);
	});
	return instance.customAxiosRequest((error as any).config as RequestConfig);
};
