import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import Post from './Post/Post';

const Posts = ({ posts, loading, setPosts }) => {
  
  // 1. Show a loading spinner while fetching data
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. Show a friendly message if the feed is empty
  if (!posts.length && !loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6" color="textSecondary">
          No posts available. Be the first to share something!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 3 }}>
      {posts.map((post) => (
        <Box key={post._id} sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
          <Post post={post} setPosts={setPosts} />
        </Box>
      ))}
    </Box>
  );
};

export default Posts;