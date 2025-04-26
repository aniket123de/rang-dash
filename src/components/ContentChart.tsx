import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { InstagramData } from '../services/instagramService';

interface ContentChartProps {
  instagramData: InstagramData;
}

const ContentChart: React.FC<ContentChartProps> = ({ instagramData }) => {
  const chartData = instagramData.recentPosts.map(post => ({
    name: new Date(post.timestamp).toLocaleDateString(),
    likes: post.likes,
    comments: post.comments
  }));

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Recent Post Performance
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likes" fill="#8884d8" name="Likes" />
            <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default ContentChart; 