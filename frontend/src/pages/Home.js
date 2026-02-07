import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid } from '@mui/material';
import Posts from '../components/Posts/Posts';
import Form from '../components/Form/Form';
import { fetchPosts } from '../api'; // Ensure this import exists

const Home = () => {
  const [currentId, setCurrentId] = useState(0);
  const [posts, setPosts] = useState([]); // You MUST have this state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const { data } = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [currentId]);

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Grid container direction="column" spacing={3}>
          <Grid item xs={12}>
            <Form currentId={currentId} setCurrentId={setCurrentId} setPosts={setPosts} />
          </Grid>
          <Grid item xs={12}>
            <Posts posts={posts} loading={loading} setPosts={setPosts} setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;