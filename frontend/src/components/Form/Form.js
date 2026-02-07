import React, { useState, useRef } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { createPost } from '../../api';

const Form = ({ setPosts }) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('profile'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      alert('Session expired. Please sign in again.');
      return;
    }
    if (!text?.trim() && !selectedFile) {
      alert('Add some text or choose an image.');
      return;
    }
    try {
      const formData = new FormData();
      if (text?.trim()) formData.append('text', text.trim());
      if (selectedFile) formData.append('image', selectedFile);
      const { data } = await createPost(formData, user.token);
      setPosts((prev) => [data, ...prev]);
      setText('');
      setSelectedFile(null);
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create post');
    }
  };

  if (!user?.token || !user?.result) {
    return (
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, textAlign: 'center' }} elevation={2}>
        <Typography color="textSecondary">Please sign in to post.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        elevation: 3,
      }}
      elevation={3}
    >
      <form onSubmit={handleSubmit}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Create a Post
        </Typography>
        <TextField
          name="text"
          variant="outlined"
          label="What's on your mind?"
          fullWidth
          multiline
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2.5 }}>
          <input
            ref={fileInputRef}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            type="file"
            id="post-image"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                setFileName(file.name);
              }
            }}
          />
          <label htmlFor="post-image">
            <Button variant="outlined" component="span" fullWidth sx={{ py: 1.5 }}>
              {fileName ? `Image: ${fileName}` : 'Choose image from computer (optional)'}
            </Button>
          </label>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            JPEG, PNG, GIF or WebP. Max 5MB.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={!text?.trim() && !selectedFile}
          sx={{ py: 1.25, fontWeight: 600 }}
        >
          POST
        </Button>
      </form>
    </Paper>
  );
};

export default Form;