'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
          }}
        >
          FarmTrip
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} href="/communityBoard">
            게시판
          </Button>
          <Button color="inherit" component={Link} href="/experiences">
            농장 체험
          </Button>
          <Button color="inherit" component={Link} href="/products">
            농산품
          </Button>
          <Button color="inherit" component={Link} href="/login">
            로그인
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

