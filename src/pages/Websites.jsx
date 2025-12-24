import { useState } from 'react'
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
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
} from '@mui/icons-material'
import { websiteService } from '../services/api'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

export default function Websites() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState(null)
  const [editDialog, setEditDialog] = useState(null)
  const [createDialog, setCreateDialog] = useState(false)

  const { data, isLoading } = useQuery(
    ['websites', page, search],
    () => websiteService.getAll({ page, limit: 10, search }),
    { keepPreviousData: true }
  )

  const { control: createControl, handleSubmit: handleCreateSubmit, reset: resetCreate } = useForm({
    defaultValues: {
      name: '',
      url: '',
    },
  })

  const { control: editControl, handleSubmit: handleEditSubmit, reset: resetEdit } = useForm({
    defaultValues: {
      name: '',
      url: '',
    },
  })

  const createMutation = useMutation(
    (data) => websiteService.create(data),
    {
      onSuccess: () => {
        toast.success('Website created successfully')
        queryClient.invalidateQueries('websites')
        setCreateDialog(false)
        resetCreate()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create website')
      },
    }
  )

  const updateMutation = useMutation(
    ({ id, data }) => websiteService.update(id, data),
    {
      onSuccess: () => {
        toast.success('Website updated successfully')
        queryClient.invalidateQueries('websites')
        setEditDialog(null)
        resetEdit()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update website')
      },
    }
  )

  const deleteMutation = useMutation(
    (id) => websiteService.delete(id),
    {
      onSuccess: () => {
        toast.success('Website deleted successfully')
        queryClient.invalidateQueries('websites')
        setDeleteDialog(null)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete website')
      },
    }
  )

  // Backend returns: { success: true, data: { data: rows, total: count } }
  // axios response.data = { success: true, data: { data: rows, total: count } }
  // react-query result.data = axios response.data
  // So: data.data.data = { data: rows, total: count }
  //     data.data.data.data = rows array
  const websitesResponse = data?.data?.data || {}
  const websites = Array.isArray(websitesResponse.data) ? websitesResponse.data : []
  const total = websitesResponse.total || data?.data?.total || 0
  const totalPages = Math.ceil(total / 10)

  const handleDelete = () => {
    if (deleteDialog) {
      deleteMutation.mutate(deleteDialog)
    }
  }

  const handleEditOpen = (website) => {
    setEditDialog(website)
    resetEdit({
      name: website.name,
      url: website.url,
    })
  }

  const handleCreate = (data) => {
    createMutation.mutate(data)
  }

  const handleEdit = (data) => {
    if (editDialog) {
      updateMutation.mutate({ id: editDialog.id, data })
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Websites</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialog(true)}
        >
          Add Website
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search websites..."
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
                  <TableCell>URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : websites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No websites found
                    </TableCell>
                  </TableRow>
                ) : (
                  websites.map((website) => (
                    <TableRow key={website.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LanguageIcon color="primary" />
                          <Typography variant="body2" fontWeight="bold">
                            {website.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          component="a"
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          {website.url}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={website.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={website.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEditOpen(website)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog(website.id)}
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
          <DialogTitle>Create New Website</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="name"
                control={createControl}
                rules={{ required: 'Website name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Website Name"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="url"
                control={createControl}
                rules={{ 
                  required: 'URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Website URL"
                    error={!!error}
                    helperText={error?.message}
                  />
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
          <DialogTitle>Edit Website</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Controller
                name="name"
                control={editControl}
                rules={{ required: 'Website name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Website Name"
                    error={!!error}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name="url"
                control={editControl}
                rules={{ 
                  required: 'URL is required',
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL starting with http:// or https://'
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Website URL"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
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

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Website</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this website? This action cannot be undone and all associated coupons will need to be reassigned.
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

