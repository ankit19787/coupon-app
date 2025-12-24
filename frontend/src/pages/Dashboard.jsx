import { useQuery } from 'react-query'
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material'
import {
  LocalOffer as CouponIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  TrendingUp as UsageIcon,
} from '@mui/icons-material'
import { couponService } from '../services/api'

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 2,
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery('couponStats', () =>
    couponService.getStats()
  )

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const statsData = stats?.data?.data || {}

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Coupons"
            value={statsData.totalCoupons || 0}
            icon={<CouponIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Coupons"
            value={statsData.activeCoupons || 0}
            icon={<ActiveIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expired Coupons"
            value={statsData.expiredCoupons || 0}
            icon={<InactiveIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Usage"
            value={statsData.totalUsage || 0}
            icon={<UsageIcon />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  )
}

