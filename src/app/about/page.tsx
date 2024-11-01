'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Avatar, IconButton, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

interface MetaProfile {
  profile: string;
  role: string; 
}

interface Profile {
  github: GitHubProfile;
  role: string;
  name: string;
}

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
}

const About: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      try {
        const response = await axios.get('/api/config');
        let profiles: Profile[] = [];
        if (response.data.about) {
          for (const metaProfile of response.data.about) {
            const githubResponse = await axios.get(`https://api.github.com/users/${metaProfile.profile}`);
            const profile: Profile = {
              github: githubResponse.data,
              role: metaProfile.role,
              name: metaProfile.name,
            };
            profiles.push(profile);
          }
        }
        setProfiles(profiles);

      } catch (error) {
        console.error('Error fetching GitHub profile:', error);
      }
    };

    fetchGitHubProfile();
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center">
      {profiles.length > 0 && (
        <Grid container spacing={2} justifyContent="center">
          {profiles.map((profile, index) => (
            <Grid item key={index}>
              <Card style={{ maxWidth: 600, margin: '0 auto' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Avatar src={profile.github.avatar_url} alt={`${profile.name} avatar`} style={{ width: 100, height: 100 }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h5">{profile.name} - {profile.role}</Typography>
                      <Typography variant="body1">{profile.github.bio}</Typography>
                      <IconButton
                        component="a"
                        href={profile.github.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </section>
  );
};

export default About;