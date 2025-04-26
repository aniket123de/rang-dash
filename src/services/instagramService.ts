import axios from 'axios';

const APIFY_API_KEY = 'apify_api_rQ7DzE6rLU18PUPFwEiWBYW7Ad7XKU0Ac9u2';
const APIFY_ACTOR_ID = 'shu8hvrXbJbY3Eb9W';

export interface InstagramPost {
  id: string;
  type: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  url: string;
  ownerUsername?: string;
}

export interface InstagramData {
  username: string;
  fullName?: string;
  biography?: string;
  followers: number;
  following: number;
  posts: number;
  recentPosts: InstagramPost[];
  engagementRate: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const scrapeInstagramProfile = async (username: string): Promise<InstagramData> => {
  try {
    console.log('Starting Apify run for', username);
    const runResponse = await axios.post(
      `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${APIFY_API_KEY}`,
      {
        directUrls: [`https://www.instagram.com/${username}/`],
        resultsLimit: 100,
        maxItems: 100
      }
    );
    
    if (!runResponse.data || !runResponse.data.data || !runResponse.data.data.id) {
      throw new Error('Invalid response from Apify API');
    }
    
    console.log('Run started:', runResponse.data);
    const runId = runResponse.data.data.id;

    // Poll for up to 3 minutes (18 attempts, 10s each)
    let status = 'RUNNING';
    let datasetId = '';
    for (let i = 0; i < 18; i++) {
      await sleep(10000);
      const statusResponse = await axios.get(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_KEY}`
      );
      
      if (!statusResponse.data || !statusResponse.data.data) {
        throw new Error('Invalid status response from Apify API');
      }
      
      status = statusResponse.data.data.status;
      datasetId = statusResponse.data.data.defaultDatasetId;
      console.log(`Polling attempt ${i + 1}: status=${status}, datasetId=${datasetId}`);
      
      if (status === 'SUCCEEDED' && datasetId) break;
      if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        throw new Error(`Apify run failed with status: ${status}`);
      }
    }
    
    if (status !== 'SUCCEEDED' || !datasetId) {
      throw new Error('Apify run did not succeed or timed out');
    }

    const datasetResponse = await axios.get(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_KEY}&clean=true`
    );
    
    if (!datasetResponse.data || !Array.isArray(datasetResponse.data)) {
      throw new Error('Invalid dataset response from Apify API');
    }
    
    console.log('Dataset response received with items:', datasetResponse.data.length);
    const posts: any[] = datasetResponse.data;
    
    if (!posts || posts.length === 0) {
      throw new Error('No data found for this user');
    }

    // Extract profile info from the first post (if available)
    const profile = posts[0] || {};
    const totalLikes = posts.reduce((sum, post) => sum + (post.likesCount || post.likes || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.commentsCount || post.comments || 0), 0);
    const followers = profile.followersCount ?? profile.followers ?? 0;
    const engagementRate = posts.length > 0 && followers > 0
      ? ((totalLikes + totalComments) / posts.length) / followers * 100
      : 0;

    return {
      username: profile.ownerUsername || username,
      fullName: profile.fullName || '',
      biography: profile.biography || '',
      followers: followers,
      following: profile.followingCount ?? profile.following ?? 0,
      posts: profile.postsCount ?? posts.length,
      recentPosts: posts.slice(0, 10).map((post: any) => ({
        id: post.id || post.shortcode || '',
        type: post.type || 'unknown',
        caption: post.caption || '',
        likes: post.likesCount || post.likes || 0,
        comments: post.commentsCount || post.comments || 0,
        timestamp: post.timestamp || post.takenAtTimestamp || '',
        url: post.url || `https://www.instagram.com/p/${post.shortcode}/`,
        ownerUsername: post.ownerUsername || username,
      })),
      engagementRate,
    };
  } catch (error: any) {
    console.error('Error scraping Instagram profile:', error);
    throw new Error(`Failed to fetch Instagram data: ${error.message}`);
  }
}; 