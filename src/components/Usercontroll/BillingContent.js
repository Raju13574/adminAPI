import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, Typography, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert, AlertTitle, Box, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import API from '../../api/config';
import { toast } from 'react-toastify';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  borderRadius: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const BillingContent = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    subscription: true,
    plans: true,
    usage: true,
    transactions: true
  });
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
      fetchAvailablePlans();
      fetchUsageData();
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    if (generalError) {
      const timer = setTimeout(() => {
        setGeneralError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, generalError]);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await API.get('/subscription/status');
      console.log('Subscription status response:', response.data);
      setSubscriptionStatus(response.data);
      setCurrentPlan(response.data.plan);
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setErrors(prev => ({ ...prev, subscription: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, subscription: false }));
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const response = await API.get('/subscription/plans');
      setAvailablePlans(response.data);
    } catch (err) {
      console.error('Error fetching available plans:', err);
      setErrors(prev => ({ ...prev, plans: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await API.get('/usage/data');
      setUsageData(response.data);
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setErrors(prev => ({ ...prev, usage: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, usage: false }));
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/users/transactions');
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setErrors(prev => ({ ...prev, transactions: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      console.log('Upgrading to plan:', planId);
      const response = await API.post(`/subscription/plans/${planId}/upgrade`);
      console.log('Upgrade response:', response.data);
      await fetchSubscriptionStatus();
      toast.success(response.data.message || 'Subscribed successfully');
    } catch (err) {
      console.error('Error upgrading plan:', err);
      toast.error(err.response?.data?.error || 'Server error');
    }
  };

  const handleCancel = async () => {
    try {
      const response = await API.post('/subscription/cancel');
      await fetchSubscriptionStatus();
      toast.success(response.data.message || 'Subscription cancelled successfully');
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      toast.error(err.response?.data?.error || 'Server error');
    }
  };

  const renderCreditUsageChart = () => {
    if (!subscriptionStatus) return null;
    const data = [
      { name: 'Used Credits', value: subscriptionStatus.creditsPerDay - subscriptionStatus.remainingCredits },
      { name: 'Remaining Credits', value: subscriptionStatus.remainingCredits },
    ];
    const COLORS = ['#FF0000', '#00C49F']; // Red for used credits, Green for remaining credits

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderSection = (title, content, isLoading, error) => (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">{title}</Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error"><AlertTitle>Error</AlertTitle>{error}</Alert>
        ) : (
          content
        )}
      </StyledCardContent>
    </StyledCard>
  );

  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, fontWeight: 'bold' }}>Billing Dashboard</Typography>
      {generalError && (
        <Alert severity={generalError.severity} sx={{ mb: 3, width: '100%', maxWidth: '800px' }}>
          <AlertTitle>{generalError.severity === 'error' ? 'Error' : 'Success'}</AlertTitle>
          {generalError.message}
        </Alert>
      )}
      
      <Grid container spacing={4} sx={{ maxWidth: '1200px', width: '100%' }}>
        <Grid item xs={12} md={6}>
          {renderSection("Current Subscription", 
            subscriptionStatus && (
              <Box>
                <Typography variant="h5" color="secondary" fontWeight="bold">
                  {subscriptionStatus.plan === 'free' ? 'Free' : subscriptionStatus.plan}
                </Typography>
                <Typography variant="subtitle1">Status: <span style={{ color: 'green', fontWeight: 'bold' }}>{subscriptionStatus.status}</span></Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">Credits per day: <strong>{subscriptionStatus.creditsPerDay}</strong></Typography>
                <Typography variant="body1">Remaining credits: <strong>{subscriptionStatus.remainingCredits}</strong></Typography>
                {subscriptionStatus.plan !== 'free' && (
                  <Typography variant="body1">Expires on: <strong>{new Date(subscriptionStatus.endDate).toLocaleDateString()}</strong></Typography>
                )}
                {renderCreditUsageChart()}
                {subscriptionStatus.plan !== 'free' && (
                  <Button variant="contained" color="secondary" onClick={handleCancel} fullWidth sx={{ mt: 2 }}>
                    Cancel Subscription
                  </Button>
                )}
              </Box>
            ),
            loading.subscription,
            errors.subscription
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderSection("Available Plans", 
            <Paper elevation={0} sx={{ overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell><Typography fontWeight="bold">Plan</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Credits</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Price</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availablePlans
                    .filter(plan => plan.id !== 'pay_per_request') // Filter out the Pay Per Request plan
                    .map((plan) => (
                      <TableRow key={plan.id} hover>
                        <TableCell><Typography fontWeight="medium">{plan.name}</Typography></TableCell>
                        <TableCell>
                          {plan.creditsPerDay || plan.creditsPerMonth || plan.creditsPerYear || 'N/A'}
                        </TableCell>
                        <TableCell>${plan.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {plan.id !== currentPlan && plan.price > 0 && (
                            <Button 
                              variant="contained" 
                              color="primary"
                              onClick={() => handleUpgrade(plan.id)}
                              size="small"
                            >
                              Upgrade
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>,
            loading.plans,
            errors.plans
          )}
        </Grid>
        <Grid item xs={12}>
          {renderSection("Recent Transactions", 
            <Paper elevation={0} sx={{ overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                    <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Type</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Amount</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Description</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color={transaction.amount < 0 ? 'error' : 'success'}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>,
            loading.transactions,
            errors.transactions
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillingContent;