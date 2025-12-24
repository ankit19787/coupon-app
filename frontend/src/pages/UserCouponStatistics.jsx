import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  LocalOffer as CouponIcon,
  TrendingUp as UsageIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material'
import { userService } from '../services/api'

export default function UserCouponStatistics() {
  const [expandedUser, setExpandedUser] = useState(null)

  const { data, isLoading, error } = useQuery(
    'userCouponStatistics',
    () => userService.getUserCouponStatistics(),
    { keepPreviousData: true }
  )

  const statistics = data?.data?.data || {}
  const summary = statistics.summary || {}
  const users = statistics.users || []

  const handleAccordionChange = (userId) => (event, isExpanded) => {
    setExpandedUser(isExpanded ? userId : null)
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          User Coupon Statistics
        </Typography>
        <Card>
          <CardContent>
            <Typography color="error">
              Error loading statistics: {error.message}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Coupon Statistics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Users
                  </Typography>
                  <Typography variant="h4">{summary.totalUsers || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Active Users
                  </Typography>
                  <Typography variant="h4">{summary.totalActiveUsers || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <ActiveIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Assignments
                  </Typography>
                  <Typography variant="h4">{summary.totalAssignedCoupons || 0}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {summary.usersWithCoupons || 0} users with coupons
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                  <CouponIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Usage
                  </Typography>
                  <Typography variant="h4">{summary.totalCouponUsage || 0}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <UsageIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Details */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            User Coupon Details
          </Typography>

          {users.length === 0 ? (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              No users found
            </Typography>
          ) : (
            users.map((user) => (
              <Accordion
                key={user.userId}
                expanded={expandedUser === user.userId}
                onChange={handleAccordionChange(user.userId)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PersonIcon color="primary" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {user.userName || user.userEmail}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {user.userEmail}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.userRole}
                        size="small"
                        color={user.userRole === 'admin' ? 'primary' : 'default'}
                      />
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                      />
                    </Box>
                    <Box display="flex" gap={3}>
                      <Box textAlign="center">
                        <Typography variant="caption" color="textSecondary" display="block">
                          Assigned
                        </Typography>
                        <Typography variant="h6">{user.totalAssignedCoupons}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="caption" color="textSecondary" display="block">
                          Active
                        </Typography>
                        <Typography variant="h6" color="success.main">{user.activeCoupons}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="caption" color="textSecondary" display="block">
                          Total Usage
                        </Typography>
                        <Typography variant="h6" color="warning.main">{user.totalCouponUsage}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {user.coupons.length === 0 ? (
                    <Typography color="textSecondary" sx={{ py: 2 }}>
                      No coupons assigned to this user
                    </Typography>
                  ) : (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Coupon Code</TableCell>
                            <TableCell>Website</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Discount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Usage</TableCell>
                            <TableCell align="right">Limit</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {user.coupons.map((coupon) => (
                            <TableRow key={coupon.couponId}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold">
                                  {coupon.couponCode}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {coupon.website ? (
                                  <Chip
                                    label={coupon.website.name}
                                    size="small"
                                    variant="outlined"
                                  />
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                  {coupon.couponDescription || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {coupon.discount}
                                  {coupon.discountType === 'percentage' ? '%' : ''}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={coupon.isActive ? 'Active' : 'Inactive'}
                                  size="small"
                                  color={coupon.isActive ? 'success' : 'default'}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight="bold">
                                  {coupon.usedCount}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" color="textSecondary">
                                  {coupon.usageLimit || '∞'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

