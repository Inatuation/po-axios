# po-axios(破)

> 掘金社区账号：[破写代码的](https://juejin.cn/user/2559318801520599)，不定时分享技术文章。

## 介绍
在现代Web开发中，网络请求管理是一个非常重要的方面，尤其是在构建复杂的前端应用时。为了提高应用的性能和用户体验，我们需要更加灵活和高效地处理网络请求，包括请求的取消和重试机制。本项目通过对axios进行二次封装，实现了请求取消和请求重试的功能，同时完全保留了axios原有的功能和灵活性。

这一封装不仅提高了网络请求的控制度，使开发者可以更细致地管理请求的生命周期，如在组件卸载时取消未完成的请求，或在网络不稳定时自动重试请求，而且还继承了axios的所有优点，包括易于使用的API、拦截器机制等。此外，本封装支持全局配置和请求级别的配置，使其可以灵活地应对不同场景的需求。

通过这个项目，开发者可以极大地减少网络请求管理的代码量，提高代码的可维护性和应用的响应性。这对于需要处理大量网络请求，尤其是在需要优化网络请求性能的应用中，将是一个非常有用的工具。

## 特性
- 取消请求：在复杂的场景中，允许取消未完成的请求，以避免页面渲染逻辑的错误。
- 重试请求： 在用户网络环境不稳定时，自动重试请求，以达到更好的用户体验。
- axios兼容性：只对axios进行了一层加工，保留axios原有的功能和灵活性，可以开箱即用，无需修改任何久代码。

## 安装
```js
npm install po-axios --save
// 由于依赖axios包，因此你的项目需要安装axios
npm install axios --save
```

## 快速上手
安装好po-axios后，在项目中引入po-axios：
```js
// main.js
import axios from 'axios';
import PoAxios from 'po-axios';
const axiosInstance = axios.create();
const instance = new PoAxios(axiosInstance);
app.config.globalProperties.$axios = instance;
```
PoAxios需要传入axios.create()返回的axios实例，就像使用axios一样，你可以在axios.create时设置你的自定义配置，并不会影响插件的功能。
### 请求取消
```js
// page.vue
<script>
    export default {
        methods: {
            postRequest() {
                this.$axios.post('/api/user', {
                    // your params
                }).then(res => {
                     // do something
                }).catch(error => {
                    // 如果请求被取消,执行catch,此时error为undefined
                });
            },
            // 取消/api/user请求
            cancelRequest() {
                this.$axios.cancelRequest('/api/user');
            },
            // 取消所有已发送请求
            cancelAllRequest() {
                this.$axios.cancelAllRequest();
            }
        }
    }
</script>
```

### 请求重试
```js
// page.vue
<script>
    export default {
        methods: {
            getRequest() {
                this.$axios.set('/api/getData', {
                    // your params
                    retryConfig: {
                        retry: true, // 开启失败后重试, 默认为false
                        retryCount: 3, // 重试次数,包含第一次，默认3次
                        retryDelay: 300 // 重试时间间隔，默认300
                        shouldRetry: (error) => {
                            // 是否重试，每次重新发送请求前调用该函数，error为请求错误对象
                            return false; // 函数必须返回一个布尔值，true为同意重试，false为拒绝重试，则执行catch
                        }
                    }
                }).then(res => {
                    // 请求重试后成功才执行then
                }).catch(error => {
                    // 如果重试次数到达上限还是失败，执行catch
                });
            }
        }
    }
</script>
```
