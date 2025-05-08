import axiosInstance from '@/utils/axiosInterceptor';
export class CommunityService {
    async getCloudinarySignature() {
        const { data } = await axiosInstance.get('/post/signature');
        return data;
    }
    async createPost(content, mediaUrl, mediaType) {
        const response = await axiosInstance.post('/posts', {
            content,
            mediaUrl,
            mediaType,
        });
        return response.data;
    }
    async deletePost(postId) {
        const response = await axiosInstance.delete(`/post/${postId}`);
        return response.data;
    }
    async getMyPosts() {
        console.log('api my post call made');
        const response = await axiosInstance.get('/my-posts');
        console.log("response my post", response);
        return response.data;
    }
    async editPost(postId, content) {
        const response = await axiosInstance.put(`/posts/${postId}`, { content });
        return response.data;
    }
    async getUserDetails() {
        const response = await axiosInstance.get('/posts/user');
        return response.data;
    }
    async getFeed(page, limit) {
        const response = await axiosInstance.get('/feed', { params: { page, limit } });
        return response.data;
    }
    async likePost(postId) {
        const response = await axiosInstance.post(`/posts/${postId}/like`);
        return response.data;
    }
    async dislikePost(postId) {
        const response = await axiosInstance.post(`/posts/${postId}/dislike`);
        return response.data;
    }
    async commentOnPost(postId, content) {
        const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
        return response.data;
    }
    async getPostComments(postId) {
        const response = await axiosInstance.get(`/posts/${postId}/comments`);
        return response.data;
    }
    async getPostShareUrl(postId) {
        // In a real app, you might fetch this from your backend
        // For now, construct the URL client-side
        const baseUrl = window.location.origin; // e.g., "https://yourapp.com"
        return `${baseUrl}/post/${postId}`;
    }
    async getPostById(postId) {
        const response = await axiosInstance.get(`/posts/${postId}`);
        return response.data;
    }
}
