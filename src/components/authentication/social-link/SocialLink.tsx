import React from 'react';
import { Button } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function SocialLink() {
  return (
    <div>
      <Button
        fullWidth
        color="inherit"
        variant="outlined"
        sx={{ mb: 3 }}
        size="large"
        href={`${backendUrl}/api/connect/facebook`}
      >
        <FacebookIcon></FacebookIcon>
        Login with Facebook
      </Button>
      <Button
        fullWidth
        color="inherit"
        variant="outlined"
        sx={{ mb: 3 }}
        size="large"
        href={`${backendUrl}/api/connect/google`}
      >
        <GoogleIcon></GoogleIcon>
        Login with Google
      </Button>
      <Button
        fullWidth
        color="inherit"
        variant="outlined"
        sx={{ mb: 3 }}
        size="large"
        href={`${backendUrl}/api/connect/github`}
      >
        <GitHubIcon></GitHubIcon>
        Login with GitHub
      </Button>
    </div>
  );
}
