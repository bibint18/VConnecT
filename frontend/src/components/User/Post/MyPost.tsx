
// import React, { useState, useEffect } from 'react';
// import { CommunityService,IPost  } from '@/services/CommunityService';
// import './MyPosts.css';

// const MyPosts: React.FC = () => {
//   const [posts, setPosts] = useState<IPost[]>([]);
//   const [editingPostId, setEditingPostId] = useState<string | null>(null);
//   const [newContent, setNewContent] = useState<string>('');
//   const [error, setError] = useState<string | null>(null);

//   // Hardcoded user data; replace with API call if needed
//   const userName: string = 'Melissa Peters';
//   const profilePicture: string = 'https://via.placeholder.com/100';

//   const communityService = new CommunityService();

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const myPosts: IPost[] = await communityService.getMyPosts();
//         setPosts(myPosts);
//         setError(null);
//       } catch (err: unknown) {
//         const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
//         setError(errorMessage);
//         console.error('Error fetching posts:', err);
//       }
//     };
//     fetchPosts();
//   }, []);

//   const handleEdit = (postId: string, currentContent: string | undefined) => {
//     setEditingPostId(postId);
//     setNewContent(currentContent ?? '');
//   };

//   const handleSaveEdit = async (postId: string) => {
//     if (!newContent.trim()) {
//       setError('Content cannot be empty');
//       return;
//     }

//     try {
//       await communityService.editPost(postId, newContent);
//       setPosts(prevPosts =>
//         prevPosts.map(post =>
//           post._id === postId ? { ...post, content: newContent } : post
//         )
//       );
//       setEditingPostId(null);
//       setNewContent('');
//       setError(null);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
//       setError(errorMessage);
//       console.error('Error editing post:', err);
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingPostId(null);
//     setNewContent('');
//     setError(null);
//   };

//   const handleDelete = async (postId: string) => {
//     if (!window.confirm('Are you sure you want to delete this post?')) {
//       return;
//     }

//     try {
//       await communityService.deletePost(postId);
//       setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//       setError(null);
//     } catch (err: unknown) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
//       setError(errorMessage);
//       console.error('Error deleting post:', err);
//     }
//   };

//   return (
//     <div className="container">
//       {error && <div className="error" style={{ color: '#ff4444' }}>{error}</div>}
//       {posts.length > 0 ? (
//         <>
//           <div className="profile-section">
//             <img src={profilePicture} alt="Profile" className="profile-pic" />
//             <h2 className="name">{userName}</h2>
//             <div className="stats">
//               <span>122 <span className="stat-label">followers</span></span>
//               <span>67 <span className="stat-label">posts</span></span>
//               <span>37K <span className="stat-label">likes</span></span>
//             </div>
//             <div className="buttons">
//               <button style={{ backgroundColor: '#1e90ff', color: '#fff' }}>Message</button>
//               <button style={{ backgroundColor: '#1e90ff', color: '#fff' }}>Connect</button>
//             </div>
//           </div>
//           <div className="tabs">
//             <span style={{ color: '#1e90ff' }}>Photos</span>
//             <span>Likes</span>
//           </div>
//           <div className="posts-grid">
//             {posts.map(post => (
//               <div key={post._id} className="post-item">
//                 {editingPostId === post._id ? (
//                   <div className="post-text">
//                     <textarea
//                       value={newContent}
//                       onChange={(e) => setNewContent(e.target.value)}
//                       style={{ backgroundColor: '#333', color: '#fff' }}
//                     />
//                     <button
//                       onClick={() => handleSaveEdit(post._id!)}
//                       style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                     >
//                       Save
//                     </button>
//                     <button
//                       onClick={handleCancelEdit}
//                       style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     {post.mediaUrl ? (
//                       <div className="post-image">
//                         <img src={post.mediaUrl} alt="Post" />
//                         <button
//                           onClick={() => handleEdit(post._id!, post.content)}
//                           style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(post._id!)}
//                           style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="post-text">
//                         <p>{post.content || 'No content'}</p>
//                         <button
//                           onClick={() => handleEdit(post._id!, post.content)}
//                           style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(post._id!)}
//                           style={{ backgroundColor: '#1e90ff', color: '#fff' }}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="no-posts" style={{ color: '#1e90ff' }}>
//           No posts yet
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPosts;


import React, { useState, useEffect } from 'react';
import { CommunityService,IPost } from '@/services/CommunityService';
import { IUser } from '@/components/admin/dashboard/CustomerDashboard';
import './MyPosts.css';
import { number } from 'zod';

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [postCount,setPostCount] = useState<number>()
  const communityService = new CommunityService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userData: IUser = await communityService.getUserDetails();
        setUser(userData);

        // Fetch posts
        const myPosts: IPost[] = await communityService.getMyPosts();
        console.log("My posts fetched",myPosts)
        const count = myPosts.length
        console.log("count",count)
        setPosts(myPosts);
        setPostCount(count)
        setError(null);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (postId: string, currentContent: string | undefined) => {
    setEditingPostId(postId);
    setNewContent(currentContent ?? '');
  };

  const handleSaveEdit = async (postId: string) => {
    if (!newContent.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      await communityService.editPost(postId, newContent);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, content: newContent } : post
        )
      );
      setEditingPostId(null);
      setNewContent('');
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      setError(errorMessage);
      console.error('Error editing post:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setNewContent('');
    setError(null);
  };

  const handleDeletePrompt = (postId: string) => {
    setShowDeleteConfirm(postId);
  };

  const handleDelete = async (postId: string) => {
    try {
      await communityService.deletePost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      setShowDeleteConfirm(null);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      console.error('Error deleting post:', err);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="container">
      {error && <div className="error" style={{ color: '#ff4444' }}>{error}</div>}
      {user ? (
        <>
          <div className="profile-section">
            <img
              src={user.profileImage || 'https://via.placeholder.com/100'}
              alt="Profile"
              className="profile-pic"
            />
            <h2 className="name">{user.username}</h2>
            <div className="stats">
              <span>{user.friends?.length }<span className="stat-label"> friends</span></span>
              <span>{postCount} <span className="stat-label">posts</span></span>
              <span>37K <span className="stat-label">likes</span></span>
            </div>
            <div className="buttons">
              <button style={{ backgroundColor: '#1e90ff', color: '#fff' }}>Message</button>
              <button style={{ backgroundColor: '#1e90ff', color: '#fff' }}>Connect</button>
            </div>
          </div>
          <div className="tabs">
            <span style={{ color: '#1e90ff' }}>Photos</span>
            <span>Likes</span>
          </div>
          <div className="posts-grid">
            {posts.map(post => (
              <div key={post._id} className="post-item">
                {editingPostId === post._id ? (
                  <div className="post-text">
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      style={{ backgroundColor: '#333', color: '#fff' }}
                    />
                    <button
                      onClick={() => handleSaveEdit(post._id!)}
                      style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    {post.mediaUrl ? (
                      <div className="post-image">
                        <img src={post.mediaUrl} alt="Post" />
                        <button
                          onClick={() => handleEdit(post._id!, post.content)}
                          style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(post._id!)}
                          style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="post-text">
                        <p>{post.content || 'No content'}</p>
                        <button
                          onClick={() => handleEdit(post._id!, post.content)}
                          style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(post._id!)}
                          style={{ backgroundColor: '#1e90ff', color: '#fff' }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-posts" style={{ color: '#1e90ff' }}>
          {posts.length === 0 ? 'No posts yet' : 'Loading user data...'}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="delete-modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this post?</p>
            <button
              onClick={() => handleDelete(showDeleteConfirm)}
              style={{ backgroundColor: '#1e90ff', color: '#fff' }}
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCancelDelete}
              style={{ backgroundColor: '#1e90ff', color: '#fff' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;