import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Pagination,
  InputAdornment,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { couponService } from '../services/api'
import { toast } from 'react-toastify'

export default function Coupons() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState(null)

  const { data, isLoading } = useQuery(
    ['coupons', page, search],
    () => couponService.getAll({ page, limit: 10, search }),
    { keepPreviousData: true }
  )

  const deleteMutation = useMutation(
    (id) => couponService.delete(id),
    {
      onSuccess: () => {
        toast.success('Coupon deleted successfully')
        queryClient.invalidateQueries('coupons')
        setDeleteDialog(null)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete coupon')
      },
    }
  )

  const toggleStatusMutation = useMutation(
    (id) => couponService.toggleStatus(id),
    {
      onSuccess: () => {
        toast.success('Coupon status updated')
        queryClient.invalidateQueries('coupons')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status')
      },
    }
  )

  const coupons = data?.data?.data || []
  const pagination = data?.data?.pagination || {}

  const handleDelete = () => {
    if (deleteDialog) {
      deleteMutation.mutate(deleteDialog)
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Coupons</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/coupons/new')}
        >
          Add Coupon
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Website</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Assigned Users</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Usage</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      No coupons found
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {coupon.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.Website?.name || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {coupon.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {coupon.discount}
                        {coupon.discountType === 'percentage' ? '%' : ''}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.discountType}
                          size="small"
                          color={coupon.discountType === 'percentage' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: 250 }}>
                          {coupon.users && coupon.users.length > 0 ? (
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {coupon.users.slice(0, 3).map((user) => (
                                <Chip
                                  key={user.id}
                                  icon={<PersonIcon />}
                                  label={user.name || user.email}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: '24px' }}
                                />
                              ))}
                              {coupon.users.length > 3 && (
                                <Chip
                                  label={`+${coupon.users.length - 3} more`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem', height: '24px' }}
                                />
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              No users assigned
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(new Date(coupon.startDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(coupon.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={coupon.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={coupon.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => toggleStatusMutation.mutate(coupon.id)}
                          disabled={toggleStatusMutation.isLoading}
                        >
                          {coupon.isActive ? (
                            <ToggleOnIcon color="success" />
                          ) : (
                            <ToggleOffIcon />
                          )}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/coupons/edit/${coupon.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog(coupon.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Coupon</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this coupon? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

