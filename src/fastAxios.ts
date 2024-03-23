import axios from 'axios';
import PoAxios from './http';

const feastAxios = {
	install(app: any) {
		const axiosInstance = axios.create();
		const instance = new PoAxios(axiosInstance);
		app.config.globalProperties.$axios = instance;
	},
};

export default feastAxios;
