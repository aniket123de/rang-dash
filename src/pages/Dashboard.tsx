import React, { useState } from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery, TextField, Button, CircularProgress, Alert } from '@mui/material';
import ContentChart from '../components/ContentChart';
import EngagementChart from '../components/EngagementChart';
import MiddleMetrics from '../components/MiddleMetrics';
import ContentRepurposer from '../components/ContentRepurposer';
import SeoOptimizer from '../components/SeoOptimizer';
import TargetAudienceAnalyzer from '../components/TargetAudienceAnalyzer';
import AnimatedButton from '../components/AnimatedButton';
import { scrapeInstagramProfile, InstagramData } from '../services/instagramService';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [username, setUsername] = useState('');
  const [instagramData, setInstagramData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!username) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await scrapeInstagramProfile(username);
      setInstagramData(data);
    } catch (err) {
      setError('Failed to fetch Instagram data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }
      }}>
        <Typography variant="h4" component="h1" gutterBottom={isMobile}>
          Instagram Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Instagram Username"
            variant="outlined"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleScrape}
            disabled={loading || !username}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {instagramData ? (
        <>
          {/* Instagram Profile Header */}
          <Box sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            mb: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: 2,
            maxWidth: 900,
            mx: 'auto',
          }}>
            {/* <Box sx={{ minWidth: 100, minHeight: 100, mr: { sm: 3, xs: 0 } }}>
              <img
                src={instagramData.profilePicUrl}
                alt={instagramData.username}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #8884d8',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                }}
              />
            </Box> */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {instagramData.fullName || instagramData.username}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 2 }}>
                  @{instagramData.username}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1, mb: 1 }} color="text.secondary">
                {instagramData.biography}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', mt: 1 }}>
                <Typography variant="body2"><b>{(instagramData.followers ?? 0).toLocaleString()}</b> Followers</Typography>
                <Typography variant="body2"><b>{(instagramData.following ?? 0).toLocaleString()}</b> Following</Typography>
                <Typography variant="body2"><b>{(instagramData.posts ?? 0).toLocaleString()}</b> Posts</Typography>
              </Box>
            </Box>
          </Box>

          {/* Metrics and Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MiddleMetrics instagramData={instagramData} />
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <ContentChart instagramData={instagramData} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <EngagementChart instagramData={instagramData} />
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <TargetAudienceAnalyzer instagramData={instagramData} />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <ContentRepurposer instagramData={instagramData} />
            </Grid>
            <Grid item xs={12} md={12} lg={4}>
              <SeoOptimizer instagramData={instagramData} />
            </Grid>
          </Grid>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            Enter an Instagram username to view analytics
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;