import React from 'react';
import { Box, Grid, Typography, Paper, useTheme } from '@mui/material';
import { InstagramData } from '../services/instagramService';

interface MiddleMetricsProps {
  instagramData: InstagramData;
}

const MiddleMetrics: React.FC<MiddleMetricsProps> = ({ instagramData }) => {
  const theme = useTheme();

  const metrics = [
    {
      title: 'Followers',
      value: (instagramData.followers ?? 0).toLocaleString(),
      color: theme.palette.primary.main
    },
    {
      title: 'Following',
      value: (instagramData.following ?? 0).toLocaleString(),
      color: theme.palette.secondary.main
    },
    {
      title: 'Posts',
      value: (instagramData.posts ?? 0).toLocaleString(),
      color: theme.palette.success.main
    },
    {
      title: 'Engagement Rate',
      value: `${(instagramData.engagementRate ?? 0).toFixed(2)}%`,
      color: theme.palette.info.main
    }
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              borderTop: `4px solid ${metric.color}`,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {metric.title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                color: metric.color,
                fontWeight: 'bold'
              }}
            >
              {metric.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default MiddleMetrics; 