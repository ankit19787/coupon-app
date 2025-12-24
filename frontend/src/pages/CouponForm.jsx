import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { couponService, websiteService } from '../services/api'
import { toast } from 'react-toastify'

export default function CouponForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id
  const [loading, setLoading] = useState(false)

  const { data: couponData, isLoading } = useQuery(
    ['coupon', id],
    () => couponService.getById(id),
    { enabled: isEdit }
  )

  const { data: websitesData } = useQuery(
    ['websites', 'all'],
    () => websiteService.getAll({ page: 1, limit: 100 }),
    { keepPreviousData: true }
  )

  // Backend returns: { success: true, data: { data: rows, total: count } }
  // axios response.data = { success: true, data: { data: rows, total: count } }
  // react-query result.data = axios response.data
  // So: websitesData.data.data = { data: rows, total: count }
  //     websitesData.data.data.data = rows array
  const websitesResponse = websitesData?.data?.data || {}
  const websites = Array.isArray(websitesResponse.data) ? websitesResponse.data : []

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      code: '',
      websiteId: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true,
    },
  })

  const discountType = watch('discountType')

  useEffect(() => {
    if (couponData?.data?.data) {
      const coupon = couponData.data.data
      reset({
        code: coupon.code,
        websiteId: coupon.websiteId || '',
        description: coupon.description || '',
        discount: coupon.discount,
        discountType: coupon.discountType,
        minPurchaseAmount: coupon.minPurchaseAmount || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        startDate: coupon.startDate.split('T')[0],
        endDate: coupon.endDate.split('T')[0],
        usageLimit: coupon.usageLimit || '',
        isActive: coupon.isActive,
      })
    }
  }, [couponData, reset])

  const createMutation = useMutation(
    (data) => couponService.create(data),
    {
      onSuccess: () => {
        toast.success('Coupon created successfully')
        queryClient.invalidateQueries('coupons')
        navigate('/coupons')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create coupon')
      },
    }
  )

  const updateMutation = useMutation(
    (data) => couponService.update(id, data),
    {
      onSuccess: () => {
        toast.success('Coupon updated successfully')
        queryClient.invalidateQueries('coupons')
        navigate('/coupons')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update coupon')
      },
    }
  )

  const onSubmit = async (data) => {
    setLoading(true)
    const submitData = {
      ...data,
      discount: parseFloat(data.discount),
      minPurchaseAmount: data.minPurchaseAmount ? parseFloat(data.minPurchaseAmount) : null,
      maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    }

    if (isEdit) {
      updateMutation.mutate(submitData)
    } else {
      createMutation.mutate(submitData)
    }
    setLoading(false)
  }

  if (isEdit && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/coupons')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          {isEdit ? 'Edit Coupon' : 'Create New Coupon'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="code"
                  control={control}
                  rules={{ required: 'Coupon code is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Coupon Code"
                      error={!!error}
                      helperText={error?.message}
                      disabled={isEdit}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="websiteId"
                  control={control}
                  rules={{ required: 'Website is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Website"
                      error={!!error}
                      helperText={error?.message}
                    >
                      {websites.map((website) => (
                        <MenuItem key={website.id} value={website.id}>
                          {website.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      select
                      label="Discount Type"
                    >
                      <MenuItem value="percentage">Percentage</MenuItem>
                      <MenuItem value="fixed">Fixed Amount</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="discount"
                  control={control}
                  rules={{ required: 'Discount is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={`Discount ${discountType === 'percentage' ? '(%)' : '(Amount)'}`}
                      error={!!error}
                      helperText={error?.message}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="maxDiscountAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Max Discount Amount (Optional)"
                      inputProps={{ min: 0, step: 0.01 }}
                      disabled={discountType === 'fixed'}
                      helperText={discountType === 'fixed' ? 'Not applicable for fixed discount' : 'Maximum discount amount for percentage type'}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={3}
                      label="Description (Optional)"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="minPurchaseAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Minimum Purchase Amount (Optional)"
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="usageLimit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Usage Limit (Optional)"
                      inputProps={{ min: 0 }}
                      helperText="Leave empty for unlimited usage"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="Start Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label="End Date"
                      InputLabelProps={{ shrink: true }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Active"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/coupons')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || createMutation.isLoading || updateMutation.isLoading}
                  >
                    {loading || createMutation.isLoading || updateMutation.isLoading
                      ? 'Saving...'
                      : isEdit
                      ? 'Update'
                      : 'Create'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

