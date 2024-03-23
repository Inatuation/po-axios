import type { AxiosStatic, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';

interface BaseCustomConfig {
	__retry?: false;
	__retryCount?: never;
	__retries?: never;
	__delay?: never;
}

interface WithCustomConfig {
	__retry: true;
	__retryCount: number;
	__retries: number;
	__delay: number;
}

export type CustomConfig = BaseCustomConfig | WithCustomConfig;

export interface ParamsType {
	[key: string]: any;
	retryConfig?: {
		retry?: boolean;
		retryCondition?: <T>(error: T) => boolean;
	};
}

interface ExtendedRequestConfig extends InternalAxiosRequestConfig {}

export type RequestConfig = ExtendedRequestConfig & CustomConfig;

export interface AxiosResponse<T> {
	code: number;
	errorMsg?: string;
	data?: T;
}

export enum RequestMethod {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete',
	PATCH = 'patch',
	HEAD = 'head',
	OPTIONS = 'options',
}

export interface PluginAxios extends CreateAxiosDefaults {
	axios: AxiosStatic;
}

export interface RequestControllerTypes {
	abort: () => void;
	shouldRetry: (() => boolean) | undefined;
}
