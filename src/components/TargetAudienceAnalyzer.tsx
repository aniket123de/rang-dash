import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import { InstagramData } from '../services/instagramService';

interface TargetAudienceAnalyzerProps {
  instagramData: InstagramData;
}

const TargetAudienceAnalyzer: React.FC<TargetAudienceAnalyzerProps> = ({ instagramData }) => {
  const engagementRate = instagramData.engagementRate;
  const followerGrowth = ((instagramData.followers - instagramData.following) / instagramData.following) * 100;

  const insights = [
    {
      title: 'Engagement Rate',
      value: `${engagementRate.toFixed(2)}%`,
      description: 'Average engagement per post'
    },
    {
      title: 'Follower Growth',
      value: `${followerGrowth.toFixed(2)}%`,
      description: 'Net follower growth rate'
    },
    {
      title: 'Content Reach',
      value: `${(instagramData.followers * 0.1).toLocaleString()}`,
      description: 'Estimated average post reach'
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Audience Insights
      </Typography>
      <List>
        {insights.map((insight, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText
                primary={insight.title}
                secondary={
                  <Box>
                    <Typography variant="h5" component="span" sx={{ fontWeight: 'bold' }}>
                      {insight.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {insight.description}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < insights.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TargetAudienceAnalyzer; 