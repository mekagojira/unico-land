import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import {
  Article as ArticleIcon,
  Publish as PublishIcon,
  EditNote as DraftIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { contentAPI, Content } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [all, published, draft, archived] = await Promise.all([
          contentAPI.getAll({ limit: 1 }),
          contentAPI.getAll({ status: 'published', limit: 1 }),
          contentAPI.getAll({ status: 'draft', limit: 1 }),
          contentAPI.getAll({ status: 'archived', limit: 1 }),
        ]);

        setStats({
          total: all.pagination.total,
          published: published.pagination.total,
          draft: draft.pagination.total,
          archived: archived.pagination.total,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Tổng nội dung', value: stats.total, icon: <ArticleIcon />, color: '#1976d2' },
    { title: 'Đã xuất bản', value: stats.published, icon: <PublishIcon />, color: '#2e7d32' },
    { title: 'Bản nháp', value: stats.draft, icon: <DraftIcon />, color: '#ed6c02' },
    { title: 'Đã lưu trữ', value: stats.archived, icon: <ArchiveIcon />, color: '#d32f2f' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Chào mừng đến với Bảng quản trị Uni-Co
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4">{stat.value}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

