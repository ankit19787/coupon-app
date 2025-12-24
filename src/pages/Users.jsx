import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
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
  DialogContentText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Tabs,
  Tab,
  Grid,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  LocalOffer as CouponIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'
import { userService, websiteService, couponService } from '../services/api'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

export default function Users() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [editDialog, setEditDialog] = useState(null)
  const [createDialog, setCreateDialog] = useState(false)
  const [assignmentDialog, setAssignmentDialog] = useState(null)
  const [assignmentTab, setAssignmentTab] = useState(0)

  const { data, isLoading } = useQuery(
    ['users', page, search],
    () => userService.getAll({ page, limit: 10, search }),
    { keepPreviousData: true }
  )

  const { data: websitesData } = useQuery(
    ['websites', 'all'],
    () => websiteService.getAll({ page: 1, limit: 1000 }),
    { keepPreviousData: true }
  )

  const { data: couponsData, isLoading: couponsLoading, error: couponsError } = useQuery(
    ['coupons', 'all'],
    () => couponService.getAll({ page: 1, limit: 1000 }),
    { keepPreviousData: true }
  )

  const { data: userWebsitesData } = useQuery(
    ['userWebsites', assignmentDialog?.id],
    () => userService.getUserWebsites(assignmentDialog.id),
    { enabled: !!assignmentDialog }
  )

  const { data: userCouponsData } = useQuery(
    ['userCoupons', assignmentDialog?.id],
    () => userService.getUserCoupons(assignmentDialog.id),
    { enabled: !!assignmentDialog }
  )

  // Backend returns: { success: true, data: { data: rows, total: count } } for websites
  const websitesResponse = websitesData?.data?.data || {}
  const websites = Array.isArray(websitesResponse.data) ? websitesResponse.data : []

  // Backend returns: { success: true, data: rows, pagination: {...} } for coupons
  // axios response: response.data = { success: true, data: rows, pagination: {...} }
  // react-query: queryResult.data = response.data
  // So: couponsData.data.data = rows array (same structure as Coupons.jsx uses)
  // Handle both possible response structures
  let coupons = []
  if (couponsData?.data) {
    if (Array.isArray(couponsData.data.data)) {
      coupons = couponsData.data.data
    } else if (Array.isArray(couponsData.data)) {
      coupons = couponsData.data
    }
  }
  
  // Debug: log to see what we're getting
  console.log('Coupons data:', { couponsData, coupons })

  const usersResponse = data?.data || {}
  const users = Array.isArray(usersResponse.data) ? usersResponse.data : []
  const total = usersResponse.pagination?.total || 0
  const totalPages = usersResponse.pagination?.totalPages || 0

  // Handle response structure: { success: true, data: [...] }
  const assignedWebsites = Array.isArray(userWebsitesData?.data?.data) 
    ? userWebsitesData.data.data 
    : []
  
  const assignedCoupons = Array.isArray(userCouponsData?.data?.data) 
    ? userCouponsData.data.data 
    : []

  const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  })

  const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true,
    },
  })

  const { control: assignmentControl, handleSubmit: handleAssignmentSubmit, reset: resetAssignment, watch: watchAssignment } = useForm({
    defaultValues: {
      websiteIds: [],
      couponIds: [],
    },
  })

  const selectedWebsiteIds = watchAssignment('websiteIds') || []
  const selectedCouponIds = watchAssignment('couponIds') || []

  const createMutation = useMutation(
    (data) => userService.create(data),
    {
      onSuccess: () => {
        toast.success('User created successfully')
        queryClient.invalidateQueries('users')
        setCreateDialog(false)
        resetCreate()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create user')
      },
    }
  )

  const updateMutation = useMutation(
    ({ id, data }) => userService.update(id, data),
    {
      onSuccess: () => {
        toast.success('User updated successfully')
        queryClient.invalidateQueries('users')
        setEditDialog(null)
        resetEdit()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update user')
      },
    }
  )

  const deleteMutation = useMutation(
    (id) => userService.delete(id),
    {
      onSuccess: () => {
        toast.success('User deleted successfully')
        queryClient.invalidateQueries('users')
        setDeleteDialog(null)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete user')
      },
    }
  )

  const assignWebsitesMutation = useMutation(
    ({ id, websiteIds }) => userService.assignWebsites(id, websiteIds),
    {
      onSuccess: () => {
        toast.success('Websites assigned successfully')
        queryClient.invalidateQueries('userWebsites')
        queryClient.invalidateQueries('users')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign websites')
      },
    }
  )

  const assignCouponsMutation = useMutation(
    ({ id, couponIds }) => userService.assignCoupons(id, couponIds),
    {
      onSuccess: () => {
        toast.success('Coupons assigned successfully')
        queryClient.invalidateQueries('userCoupons')
        queryClient.invalidateQueries('users')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign coupons')
      },
    }
  )

  const handleDelete = () => {
    if (deleteDialog) {
      deleteMutation.mutate(deleteDialog)
    }
  }

  const handleEditOpen = (user) => {
    setEditDialog(user)
    resetEdit({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
    })
  }

  const handleAssignmentOpen = (user) => {
    setAssignmentDialog(user)
    setAssignmentTab(0)
    resetAssignment({
      websiteIds: [],
      couponIds: [],
    })
  }

  const handleCreate = (data) => {
    createMutation.mutate(data)
  }

  const handleEdit = (data) => {
    if (editDialog) {
      const updateData = { ...data }
      if (!updateData.password) {
        delete updateData.password
      }
      updateMutation.mutate({ id: editDialog.id, data: updateData })
    }
  }

  const handleAssignmentSave = (data) => {
    if (assignmentDialog) {
      if (assignmentTab === 0) {
        assignWebsitesMutation.mutate({ id: assignmentDialog.id, websiteIds: data.websiteIds || [] })
      } else {
        assignCouponsMutation.mutate({ id: assignmentDialog.id, couponIds: data.couponIds || [] })
      }
    }
  }

  // Load existing assignments when dialog opens
  useEffect(() => {
    if (assignmentDialog) {
      resetAssignment({
        websiteIds: assignedWebsites.map(w => w.id),
        couponIds: assignedCoupons.map(c => c.id),
      })
    }
  }, [assignmentDialog, assignedWebsites, assignedCoupons, resetAssignment])

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog(true)}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search users..."
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon color="primary" />
                          <Typography variant="body2" fontWeight="bold">
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === 'admin' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={user.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleAssignmentOpen(user)}
                          title="Assign Websites & Coupons"
                        >
                          <AssignmentIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditOpen(user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog(user.id)}
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

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateSubmit(handleCreate)}>
          <DialogTitle>Create New User</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="name"
                control={createControl}
                rules={{ required: 'Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="email"
                control={createControl}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    label="Email"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="password"
                control={createControl}
                rules={{ 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="role"
                control={createControl}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select {...field} label="Role">
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onClose={() => setEditDialog(null)} maxWidth="sm" fullWidth>
        <form onSubmit={handleEditSubmit(handleEdit)}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="name"
                control={editControl}
                rules={{ required: 'Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Name"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="email"
                control={editControl}
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="email"
                    label="Email"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="password"
                control={editControl}
                rules={{ 
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password (leave empty to keep current)"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="role"
                    control={editControl}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select {...field} label="Role">
                          <MenuItem value="user">User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="isActive"
                    control={editControl}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value={true}>Active</MenuItem>
                          <MenuItem value={false}>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={!!assignmentDialog} onClose={() => setAssignmentDialog(null)} maxWidth="md" fullWidth>
        <form onSubmit={handleAssignmentSubmit(handleAssignmentSave)}>
          <DialogTitle>
            Assign to {assignmentDialog?.name}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Tabs value={assignmentTab} onChange={(e, newValue) => setAssignmentTab(newValue)}>
                <Tab icon={<LanguageIcon />} iconPosition="start" label="Websites" />
                <Tab icon={<CouponIcon />} iconPosition="start" label="Coupons" />
              </Tabs>

              {assignmentTab === 0 ? (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Websites</InputLabel>
                    <Controller
                      name="websiteIds"
                      control={assignmentControl}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          label="Select Websites"
                          renderValue={(selected) => selected.length === 0 
                            ? 'No websites selected' 
                            : `${selected.length} website(s) selected`
                          }
                        >
                          {websites.map((website) => (
                            <MenuItem key={website.id} value={website.id}>
                              <Checkbox checked={field.value?.indexOf(website.id) > -1} />
                              <ListItemText primary={website.name} secondary={website.url} />
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Select Coupons</InputLabel>
                    <Controller
                      name="couponIds"
                      control={assignmentControl}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          label="Select Coupons"
                          renderValue={(selected) => selected.length === 0 
                            ? 'No coupons selected' 
                            : `${selected.length} coupon(s) selected`
                          }
                        >
                          {coupons.length === 0 ? (
                            <MenuItem disabled>No coupons available</MenuItem>
                          ) : (
                            coupons.map((coupon) => (
                              <MenuItem key={coupon.id} value={coupon.id}>
                                <Checkbox checked={field.value?.indexOf(coupon.id) > -1} />
                                <ListItemText 
                                  primary={coupon.code} 
                                  secondary={`${coupon.discount}${coupon.discountType === 'percentage' ? '%' : ''} - ${coupon.Website?.name || 'N/A'}`}
                                />
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      )}
                    />
                    {couponsLoading && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Loading coupons...
                      </Typography>
                    )}
                    {!couponsLoading && coupons.length === 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        No coupons found. Create coupons first to assign them to users.
                      </Typography>
                    )}
                    {couponsError && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        Error loading coupons: {couponsError.message}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignmentDialog(null)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={assignWebsitesMutation.isLoading || assignCouponsMutation.isLoading}
            >
              {(assignWebsitesMutation.isLoading || assignCouponsMutation.isLoading) 
                ? 'Saving...' 
                : 'Save Assignments'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate this user? This action cannot be undone.
          </DialogContentText>
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

