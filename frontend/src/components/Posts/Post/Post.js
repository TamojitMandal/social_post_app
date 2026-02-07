import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Avatar,
  Box,
  TextField,
  Button,
} from '@mui/material';
import { Favorite, ChatBubbleOutline } from '@mui/icons-material';
import { likePost, addComment } from '../../../api';

const Post = ({ post, setPosts }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user?.result?._id;
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [post.image]);

  const handleLike = async () => {
    try {
      const { data } = await likePost(post._id);
      setPosts((prev) => prev.map((p) => (p._id === post._id ? data : p)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (e) => {
    e?.preventDefault?.();
    const text = commentText?.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(post._id, text);
      setPosts((prev) => prev.map((p) => (p._id === post._id ? data : p)));
      setCommentText('');
      setShowCommentInput(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const liked = post.likes && userId && post.likes.some((id) => String(id) === String(userId));
  const displayName = post.creatorName || 'Anonymous';
  const displayText = post.text?.trim() || '\u00A0';
  const comments = post.comments || [];

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      elevation={3}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{displayName.charAt(0).toUpperCase()}</Avatar>}
        title={displayName}
        subheader={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
        sx={{
          alignItems: 'flex-start',
          py: 2,
          '& .MuiCardHeader-title': { fontWeight: 600, fontSize: '1rem' },
          '& .MuiCardHeader-subheader': { mt: 0.25 },
        }}
      />
      {post.image && !imageError && (
        <CardMedia
          component="img"
          height="300"
          image={post.image}
          alt="Post"
          sx={{ objectFit: 'cover' }}
          onError={() => setImageError(true)}
        />
      )}
      {post.image && imageError && (
        <Box sx={{ height: 120, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Image could not be loaded. Use a direct image link (e.g. .jpg, .png).
          </Typography>
        </Box>
      )}
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
          {displayText}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, py: 1.5, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={handleLike}
            color={liked ? 'primary' : 'default'}
            aria-label="like"
          >
            <Favorite fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {post.likes?.length ?? 0}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => setShowCommentInput((v) => !v)}
            color={showCommentInput ? 'primary' : 'default'}
            aria-label="comments"
          >
            <ChatBubbleOutline fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="textSecondary">
            {comments.length}
          </Typography>
        </Box>
      </CardActions>

      {showCommentInput && (
        <Box component="form" onSubmit={handleAddComment} sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{ mb: 1 }}
            autoFocus
          />
          <Button type="submit" size="small" variant="contained" disabled={submitting || !commentText?.trim()}>
            {submitting ? 'Posting...' : 'Post comment'}
          </Button>
        </Box>
      )}

      {comments.length > 0 && (
        <Box sx={{ px: 2, pb: 2, borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
          {comments.map((c, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" fontWeight={600}>
                {c.username || 'Anonymous'}:
              </Typography>
              <Typography variant="body2" color="textSecondary" component="span" sx={{ ml: 0.5 }}>
                {c.text}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default Post;