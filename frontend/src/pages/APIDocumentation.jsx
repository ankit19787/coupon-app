import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  GetApp as GetIcon,
  PostAdd as PostIcon,
  Edit as PutIcon,
  Delete as DeleteIcon,
  SwapHoriz as PatchIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

const MethodChip = ({ method }) => {
  const colors = {
    GET: 'success',
    POST: 'primary',
    PUT: 'warning',
    DELETE: 'error',
    PATCH: 'info',
  }
  const icons = {
    GET: <GetIcon />,
    POST: <PostIcon />,
    PUT: <PutIcon />,
    DELETE: <DeleteIcon />,
    PATCH: <PatchIcon />,
  }

  return (
    <Chip
      icon={icons[method]}
      label={method}
      color={colors[method]}
      size="small"
      sx={{ minWidth: 80, fontWeight: 'bold' }}
    />
  )
}

const EndpointCard = ({ method, path, description, auth, admin, requestBody, response, queryParams }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <MethodChip method={method} />
        <Typography variant="h6" component="code" sx={{ fontFamily: 'monospace', flex: 1 }}>
          {path}
        </Typography>
        {auth && (
          <Chip label="Auth Required" size="small" color="secondary" variant="outlined" />
        )}
        {admin && (
          <Chip label="Admin Only" size="small" color="error" variant="outlined" />
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" paragraph>
        {description}
      </Typography>

      {queryParams && queryParams.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Query Parameters:
          </Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: 600 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queryParams.map((param, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <code>{param.name}</code>
                    </TableCell>
                    <TableCell>{param.type}</TableCell>
                    <TableCell>{param.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {requestBody && (
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Request Body:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(requestBody, null, 2)}
            </Typography>
          </Paper>
        </Box>
      )}

      {response && (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Example Response:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(response, null, 2)}
            </Typography>
          </Paper>
        </Box>
      )}
    </CardContent>
  </Card>
)

const endpoints = {
  authentication: [
    {
      method: 'POST',
      path: '/api/auth/login',
      description: 'Login to get authentication token',
      auth: false,
      admin: false,
      requestBody: {
        email: 'admin@example.com',
        password: 'admin123',
      },
      response: {
        success: true,
        message: 'Login successful',
        data: {
          token: 'jwt-token-here',
          user: {
            id: 'user-uuid',
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
          },
        },
      },
    },
  ],
  coupons: [
    {
      method: 'GET',
      path: '/api/coupons',
      description: 'Get all coupons with pagination and filters',
      auth: true,
      admin: false,
      queryParams: [
        { name: 'page', type: 'number', description: 'Page number (default: 1)' },
        { name: 'limit', type: 'number', description: 'Items per page (default: 10)' },
        { name: 'search', type: 'string', description: 'Search by coupon code' },
        { name: 'websiteId', type: 'UUID', description: 'Filter by website ID' },
        { name: 'isActive', type: 'boolean', description: 'Filter by active status' },
      ],
      response: {
        success: true,
        data: [
          {
            id: 'coupon-uuid',
            code: 'SUMMER2024',
            description: 'Summer sale',
            discount: 25.0,
            discountType: 'percentage',
            websiteId: 'website-uuid',
            Website: { name: 'Example Website' },
            users: [],
          },
        ],
        pagination: {
          total: 100,
          page: 1,
          limit: 10,
          totalPages: 10,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/coupons/:id',
      description: 'Get a specific coupon by ID',
      auth: true,
      admin: false,
      response: {
        success: true,
        data: {
          id: 'coupon-uuid',
          code: 'SUMMER2024',
          description: 'Summer sale',
          discount: 25.0,
          discountType: 'percentage',
          usedCount: 50,
          usageLimit: 1000,
          isActive: true,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/coupons/code/:code',
      description: 'Get coupon by code (public endpoint)',
      auth: false,
      admin: false,
      response: {
        success: true,
        data: {
          id: 'coupon-uuid',
          code: 'SUMMER2024',
          description: 'Summer sale',
          discount: 25.0,
        },
      },
    },
    {
      method: 'POST',
      path: '/api/coupons',
      description: 'Create a new coupon',
      auth: true,
      admin: true,
      requestBody: {
        code: 'SUMMER2024',
        websiteId: 'website-uuid',
        description: 'Summer sale 2024',
        discount: 25.0,
        discountType: 'percentage',
        minPurchaseAmount: 100.0,
        maxDiscountAmount: 500.0,
        startDate: '2024-06-01T00:00:00.000Z',
        endDate: '2024-08-31T23:59:59.000Z',
        usageLimit: 1000,
        isActive: true,
      },
      response: {
        success: true,
        message: 'Coupon created successfully',
        data: {
          id: 'coupon-uuid',
          code: 'SUMMER2024',
        },
      },
    },
    {
      method: 'PUT',
      path: '/api/coupons/:id',
      description: 'Update a coupon',
      auth: true,
      admin: true,
      requestBody: {
        code: 'SUMMER2024',
        description: 'Updated description',
        discount: 30.0,
      },
      response: {
        success: true,
        message: 'Coupon updated successfully',
        data: {},
      },
    },
    {
      method: 'DELETE',
      path: '/api/coupons/:id',
      description: 'Delete a coupon (soft delete)',
      auth: true,
      admin: true,
      response: {
        success: true,
        message: 'Coupon deleted successfully',
      },
    },
    {
      method: 'PATCH',
      path: '/api/coupons/:id/toggle-status',
      description: 'Toggle coupon active/inactive status',
      auth: true,
      admin: true,
      response: {
        success: true,
        message: 'Coupon activated successfully',
        data: {},
      },
    },
    {
      method: 'POST',
      path: '/api/coupons/validate',
      description: 'Validate a coupon code and calculate discount',
      auth: true,
      admin: false,
      requestBody: {
        code: 'SUMMER2024',
        amount: 150.0,
      },
      response: {
        success: true,
        valid: true,
        data: {
          coupon: {
            id: 'coupon-uuid',
            code: 'SUMMER2024',
            discount: 25.0,
            discountType: 'percentage',
          },
          discountAmount: 37.5,
          finalAmount: 112.5,
        },
      },
    },
    {
      method: 'POST',
      path: '/api/coupons/apply',
      description: 'Apply a coupon (increments usage count)',
      auth: true,
      admin: false,
      requestBody: {
        code: 'SUMMER2024',
      },
      response: {
        success: true,
        message: 'Coupon applied successfully',
        data: {},
      },
    },
    {
      method: 'GET',
      path: '/api/coupons/stats',
      description: 'Get coupon statistics',
      auth: true,
      admin: true,
      response: {
        success: true,
        data: {
          totalCoupons: 100,
          activeCoupons: 75,
          expiredCoupons: 25,
          totalUsage: 5000,
        },
      },
    },
  ],
  websites: [
    {
      method: 'GET',
      path: '/api/websites',
      description: 'Get all websites with pagination',
      auth: true,
      admin: false,
      queryParams: [
        { name: 'page', type: 'number', description: 'Page number (default: 1)' },
        { name: 'limit', type: 'number', description: 'Items per page (default: 10)' },
        { name: 'search', type: 'string', description: 'Search by website name' },
      ],
      response: {
        success: true,
        data: {
          data: [
            {
              id: 'website-uuid',
              name: 'Example Website',
              url: 'https://example.com',
              description: 'Example description',
            },
          ],
          total: 50,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/websites/:id',
      description: 'Get a specific website by ID',
      auth: true,
      admin: false,
      response: {
        success: true,
        data: {
          id: 'website-uuid',
          name: 'Example Website',
          url: 'https://example.com',
          description: 'Example description',
        },
      },
    },
    {
      method: 'POST',
      path: '/api/websites',
      description: 'Create a new website',
      auth: true,
      admin: false,
      requestBody: {
        name: 'Example Website',
        url: 'https://example.com',
        description: 'Example description',
      },
      response: {
        success: true,
        message: 'Website created successfully',
        data: {
          id: 'website-uuid',
        },
      },
    },
    {
      method: 'PUT',
      path: '/api/websites/:id',
      description: 'Update a website',
      auth: true,
      admin: false,
      requestBody: {
        name: 'Updated Website',
        url: 'https://updated.com',
        description: 'Updated description',
      },
      response: {
        success: true,
        message: 'Website updated successfully',
        data: {},
      },
    },
    {
      method: 'DELETE',
      path: '/api/websites/:id',
      description: 'Delete a website',
      auth: true,
      admin: false,
      response: {
        success: true,
        message: 'Website deleted successfully',
      },
    },
  ],
  users: [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Get all users with pagination',
      auth: true,
      admin: true,
      queryParams: [
        { name: 'page', type: 'number', description: 'Page number (default: 1)' },
        { name: 'limit', type: 'number', description: 'Items per page (default: 10)' },
        { name: 'search', type: 'string', description: 'Search by name or email' },
      ],
      response: {
        success: true,
        data: [
          {
            id: 'user-uuid',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            isActive: true,
          },
        ],
        pagination: {
          total: 50,
          page: 1,
          limit: 10,
          totalPages: 5,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/users/:id',
      description: 'Get a specific user by ID with assigned websites and coupons',
      auth: true,
      admin: true,
      response: {
        success: true,
        data: {
          id: 'user-uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          websites: [],
          coupons: [],
        },
      },
    },
    {
      method: 'POST',
      path: '/api/users',
      description: 'Create a new user',
      auth: true,
      admin: true,
      requestBody: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      response: {
        success: true,
        message: 'User created successfully',
        data: {
          id: 'user-uuid',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
      },
    },
    {
      method: 'PUT',
      path: '/api/users/:id',
      description: 'Update a user',
      auth: true,
      admin: true,
      requestBody: {
        name: 'John Doe Updated',
        email: 'john.updated@example.com',
        password: 'newpassword123',
        role: 'admin',
        isActive: true,
      },
      response: {
        success: true,
        message: 'User updated successfully',
        data: {},
      },
    },
    {
      method: 'DELETE',
      path: '/api/users/:id',
      description: 'Delete (deactivate) a user',
      auth: true,
      admin: true,
      response: {
        success: true,
        message: 'User deactivated successfully',
      },
    },
    {
      method: 'POST',
      path: '/api/users/:id/websites',
      description: 'Assign websites to a user',
      auth: true,
      admin: true,
      requestBody: {
        websiteIds: ['website-uuid-1', 'website-uuid-2'],
      },
      response: {
        success: true,
        message: 'Websites assigned successfully',
        data: {},
      },
    },
    {
      method: 'POST',
      path: '/api/users/:id/coupons',
      description: 'Assign coupons to a user',
      auth: true,
      admin: true,
      requestBody: {
        couponIds: ['coupon-uuid-1', 'coupon-uuid-2'],
      },
      response: {
        success: true,
        message: 'Coupons assigned successfully',
        data: {},
      },
    },
    {
      method: 'GET',
      path: '/api/users/:id/websites',
      description: 'Get all websites assigned to a user',
      auth: true,
      admin: true,
      response: {
        success: true,
        data: [
          {
            id: 'website-uuid',
            name: 'Example Website',
            url: 'https://example.com',
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/:id/coupons',
      description: 'Get all coupons assigned to a user',
      auth: true,
      admin: true,
      response: {
        success: true,
        data: [
          {
            id: 'coupon-uuid',
            code: 'SUMMER2024',
            discount: 25.0,
            discountType: 'percentage',
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/users/statistics/coupon-usage',
      description: 'Get user coupon utilization statistics',
      auth: true,
      admin: true,
      response: {
        success: true,
        data: {
          summary: {
            totalUsers: 50,
            totalActiveUsers: 45,
            totalAssignedCoupons: 200,
            totalCouponUsage: 5000,
            usersWithCoupons: 40,
          },
          users: [
            {
              userId: 'user-uuid',
              userName: 'John Doe',
              userEmail: 'john@example.com',
              totalAssignedCoupons: 5,
              activeCoupons: 4,
              totalCouponUsage: 25,
              coupons: [],
            },
          ],
        },
      },
    },
  ],
}

export default function APIDocumentation() {
  const [expandedSection, setExpandedSection] = useState('authentication')

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? section : null)
  }

  const baseUrl = `${window.location.protocol}//${window.location.hostname}:3001/api`

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          API Documentation
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete API reference for the Coupon Management System. All endpoints are documented
          with request/response examples, parameters, and authentication requirements.
        </Typography>

        <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <InfoIcon />
            <Typography variant="subtitle1" fontWeight="bold">
              Base URL
            </Typography>
          </Box>
          <Typography component="code" sx={{ fontFamily: 'monospace' }}>
            {baseUrl}
          </Typography>
        </Paper>

        <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Authentication
          </Typography>
          <Typography variant="body2">
            Most endpoints require authentication. Include the JWT token in the Authorization
            header: <code>Bearer {'{token}'}</code>
          </Typography>
        </Paper>
      </Box>

      {Object.entries(endpoints).map(([section, sectionEndpoints]) => (
        <Accordion
          key={section}
          expanded={expandedSection === section}
          onChange={handleAccordionChange(section)}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              {section} ({sectionEndpoints.length} endpoints)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {sectionEndpoints.map((endpoint, index) => (
              <EndpointCard key={index} {...endpoint} />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      <Card sx={{ mt: 4, bgcolor: 'grey.100' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Reference
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Status Codes
              </Typography>
              <Typography variant="body2">200 - Success</Typography>
              <Typography variant="body2">201 - Created</Typography>
              <Typography variant="body2">400 - Bad Request</Typography>
              <Typography variant="body2">401 - Unauthorized</Typography>
              <Typography variant="body2">403 - Forbidden</Typography>
              <Typography variant="body2">404 - Not Found</Typography>
              <Typography variant="body2">409 - Conflict</Typography>
              <Typography variant="body2">422 - Validation Error</Typography>
              <Typography variant="body2">500 - Server Error</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Notes
              </Typography>
              <Typography variant="body2">
                • Replace <code>:id</code>, <code>:code</code> with actual UUIDs
              </Typography>
              <Typography variant="body2">• All dates should be in ISO 8601 format</Typography>
              <Typography variant="body2">• Admin-only endpoints require role: "admin"</Typography>
              <Typography variant="body2">
                • Use Content-Type: application/json for POST/PUT requests
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

