import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { InstagramData } from '../services/instagramService';

interface ContentRepurposerProps {
  instagramData: InstagramData;
}

const ContentRepurposer: React.FC<ContentRepurposerProps> = ({ instagramData }) => {
  const topPosts = [...instagramData.recentPosts]
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 6);

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Top Performing Content
      </Typography>
      <Grid container spacing={2}>
        {topPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 3 }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1
                  }}
                >
                  {post.caption || 'Untitled Post'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.timestamp).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Likes"><IconButton size="small" color="error"><FavoriteIcon fontSize="small" /></IconButton></Tooltip>
                  <Typography variant="body2">{post.likes.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Comments"><IconButton size="small" color="primary"><ChatBubbleIcon fontSize="small" /></IconButton></Tooltip>
                  <Typography variant="body2">{post.comments.toLocaleString()}</Typography>
                </Box>
                <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', color: '#1976d2', fontWeight: 500, fontSize: 13 }}>View</a>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ContentRepurposer; 