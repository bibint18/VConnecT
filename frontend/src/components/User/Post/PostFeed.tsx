
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePostFeed } from '@/hooks/usePostFeed';
import './PostFeed.css';

const PostFeed: React.FC = () => {
  const [showComments, setShowComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});

  const {
    allPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    handleLike,
    handleDislike,
    handleComment,
  } = usePostFeed();
  console.log("allPost",allPosts)
  const { ref, inView } = useInView({ threshold: 0 });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const toggleComments = (postId: string) => {
    setShowComments(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleCommentSubmit = (postId: string) => {
    if (newComment[postId]?.trim()) {
      handleComment(postId, newComment[postId]);
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="feed-container">
      {error && <div className="error" style={{ color: '#ff4444' }}>{error}</div>}
      {allPosts.map(post => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <img
              src={post.userId.profileImage || 'https://via.placeholder.com/40'}
              alt="Profile"
              className="profile-pic"
            />
            <span className="username">{post.userId.username}</span>
          </div>
          {post.mediaUrl ? (
            <img src={post.mediaUrl} alt="Post" className="post-image" />
          ) : (
            <p className="post-text">{post.content || 'No content'}</p>
          )}
          <div className="post-actions">
            <button
              onClick={() => handleLike(post._id!)}
              style={{
                backgroundColor: post.likes.includes(localStorage.getItem('userId') || '')
                  ? '#1e90ff'
                  : '#333',
                color: '#fff',
              }}
            >
              Like ({post.likeCount})
            </button>
            <button
              onClick={() => handleDislike(post._id!)}
              style={{ backgroundColor: '#333', color: '#fff' }}
            >
              Dislike
            </button>
            <button
              onClick={() => toggleComments(post._id!)}
              style={{ backgroundColor: '#333', color: '#fff' }}
            >
              Comments ({post.commentCount})
            </button>
          </div>
          {showComments.includes(post._id!) && (
            <div className="comments-section">
              <div className="comments-list">
                {/* Placeholder for comments - to be fetched separately if needed */}
                <p>Comments loading... (Add getPostComments logic here)</p>
              </div>
              <div className="comment-input">
                <input
                  type="text"
                  value={newComment[post._id!] || ''}
                  onChange={(e) =>
                    setNewComment({ ...newComment, [post._id!]: e.target.value })
                  }
                  placeholder="Add a comment..."
                  style={{ backgroundColor: '#222', color: '#fff', border: '1px solid #1e90ff' }}
                />
                <button
                  onClick={() => handleCommentSubmit(post._id!)}
                  style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div ref={ref}>
        {isFetchingNextPage ? <div className="loading">Loading more posts...</div> : null}
        {!hasNextPage && <div className="end-message">No more posts</div>}
      </div>
      {isError && <div className="error">Error loading feed</div>}
    </div>
  );
};

export default PostFeed;