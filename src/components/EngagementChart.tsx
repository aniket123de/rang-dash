import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { InstagramData } from '../services/instagramService';

interface EngagementChartProps {
  instagramData: InstagramData;
}

const EngagementChart: React.FC<EngagementChartProps> = ({ instagramData }) => {
  const chartData = instagramData.recentPosts.map(post => ({
    name: new Date(post.timestamp).toLocaleDateString(),
    engagement: ((post.likes + post.comments) / instagramData.followers) * 100
  }));

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Engagement Rate Trend
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
            <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Engagement Rate']} />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default EngagementChart; 