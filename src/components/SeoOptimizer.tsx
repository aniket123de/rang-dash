import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { InstagramData } from '../services/instagramService';

interface SeoOptimizerProps {
  instagramData: InstagramData;
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({ instagramData }) => {
  const hashtagAnalysis = instagramData.recentPosts.reduce((acc: { [key: string]: number }, post) => {
    const hashtags = post.caption?.match(/#\w+/g) || [];
    hashtags.forEach(hashtag => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
    });
    return acc;
  }, {});

  const topHashtags = Object.entries(hashtagAnalysis)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Hashtag Performance
      </Typography>
      <List>
        {topHashtags.map(([hashtag, count], index) => (
          <React.Fragment key={hashtag}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {hashtag}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    Used in {count} posts
                  </Typography>
                }
              />
            </ListItem>
            {index < topHashtags.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total unique hashtags: {Object.keys(hashtagAnalysis).length}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SeoOptimizer; 