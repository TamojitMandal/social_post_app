import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' }); // Your backend URL

// THIS IS THE CRITICAL PART:
API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    // Attach the token to the 'Authorization' header
    req.headers.Authorization = `Bearer ${profile.token}`;
  }
  return req;
});

export const fetchPosts = () => API.get('/posts');
export const createPost = (formData, token) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // FormData: do not set Content-Type so browser sets multipart/form-data with boundary
  if (formData instanceof FormData) {
    return API.post('/posts', formData, { headers });
  }
  return API.post('/posts', formData, { headers });
};
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const addComment = (postId, text) => API.post(`/posts/${postId}/comment`, { text });

export const signIn = (formData) => API.post('/auth/signin', { email: formData.email, password: formData.password });
export const signUp = (formData) => API.post('/auth/signup', {
  name: [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || formData.email?.split('@')[0],
  email: formData.email,
  password: formData.password,
});