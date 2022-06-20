import axios from 'axios';

const apiRequest = axios.create({
   baseURL: 'https://youtube.googleapis.com/youtube/v3/',
   params: {
      key: process.env.REACT_APP_YT_API_KEY1,
   },
   validateStatus: status =>{console.log('Response validation: status ', status); return (status !== 401)}
});

apiRequest.interceptors.request.use(request => {
   if (request.url.search(/subscriptions|history|videos|commentThreads|channels/igm) !== -1) {
      console.log('Authorization header added');
      request.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
   }
      return request
}, error => {

});

apiRequest.interceptors.response.use(response => response, 
   error => {
   if (error?.response?.status === 401) {
      console.log('401 intercepted');
      throw new Error(error);
      }
});

export default apiRequest
