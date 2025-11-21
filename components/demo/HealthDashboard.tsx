'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check as FiCheck,
  X as FiX,
  RefreshCw as FiRefreshCw,
  Clock as FiClock,
  Activity as FiActivity,
  Zap as FiZap,
  Heart as FiHeart,
  Droplet as FiDroplet,
  Moon as FiMoon,
  Watch as FiWatch,
  Plus as FiPlus,
  CheckCircle as FiCheckCircle,
  AlertCircle as FiAlertCircle
} from 'react-feather';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Divider, 
  Grid, 
  LinearProgress, 
  Paper, 
  Typography,
  IconButton
} from '@mui/material';
import { useHealth } from '../../contexts/HealthContext';

const HealthDashboard = () => {
  const { healthData, isConnected, connectHealth, syncHealthData } = useHealth();
  const [showQRCode, setShowQRCode] = useState(false);
  const [healthPoints, setHealthPoints] = useState(0);

  useEffect(() => {
    // Initialize health points from healthData if available
    if (healthData?.points) {
      setHealthPoints(healthData.points);
    } else if (healthData?.steps) {
      // Fallback to steps if points not available
      setHealthPoints(healthData.steps);
    }
  }, [healthData]);

  const handleConnectDevice = () => {
    setShowQRCode(true);
  };

  const handleSync = async () => {
    try {
      await syncHealthData();
    } catch (error) {
      console.error('Error syncing health data:', error);
    }
  };

  // Mock health metrics data
  const healthMetrics = [
    { 
      name: 'Steps', 
      value: healthData?.steps || 0, 
      target: 10000, 
      progress: Math.min(100, ((healthData?.steps || 0) / 10000) * 100), 
      unit: 'steps',
      icon: <FiActivity size={20} />
    },
    { 
      name: 'Heart Rate', 
      value: healthData?.heartRate || 0, 
      target: 72, 
      progress: 85, 
      unit: 'bpm',
      icon: <FiHeart size={20} />
    },
    { 
      name: 'Sleep', 
      value: healthData?.sleep || 0, 
      target: 8, 
      progress: 75, 
      unit: 'hours',
      icon: <FiMoon size={20} />
    },
    { 
      name: 'Water', 
      value: healthData?.water || 0, 
      target: 8, 
      progress: 60, 
      unit: 'glasses',
      icon: <FiDroplet size={20} />
    }
  ];

  // Mock recent activities
  const recentActivities = [
    { id: 1, title: 'Morning Walk', time: '2 hours ago', points: 150, type: 'activity' },
    { id: 2, title: 'Synced Health Data', time: '5 hours ago', points: 50, type: 'sync' },
    { id: 3, title: 'Daily Goal Reached', time: '1 day ago', points: 200, type: 'achievement' },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Health Metrics Section */}
      <Grid container spacing={3}>
        {/* Health Metrics */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Health Metrics</Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<FiRefreshCw size={16} />}
                  onClick={handleSync}
                >
                  Refresh
                </Button>
              </Box>
              
              {/* Health Metrics Grid */}
              <Grid container spacing={2}>
                {healthMetrics.map((metric) => (
                  <Grid item xs={6} sm={4} key={`metric-${metric.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Box 
                      component={Paper} 
                      p={2} 
                      sx={{ 
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={1}>
                        <Box 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%',
                            backgroundColor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}
                        >
                          {metric.icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.name}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {metric.value} {metric.unit}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={metric.progress} 
                        sx={{ 
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" mt={0.5}>
                        {metric.progress}% of {metric.target} {metric.unit} goal
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Health Points Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Health Points
              </Typography>
              
              <Box textAlign="center" py={4}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">
                    {healthPoints.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<FiZap size={16} />}
                  onClick={handleSync}
                >
                  Sync Health Data
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Recent Activity
                </Typography>
                {recentActivities.length > 0 ? (
                  <Box>
                    {recentActivities.map((activity) => (
                      <Box 
                        key={activity.id}
                        display="flex" 
                        alignItems="center" 
                        py={1.5}
                        sx={{ 
                          borderBottom: activity.id < recentActivities.length ? '1px solid' : 'none',
                          borderColor: 'divider'
                        }}
                      >
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}
                        >
                          {activity.type === 'sync' ? (
                            <FiRefreshCw size={16} />
                          ) : activity.type === 'achievement' ? (
                            <FiZap size={16} />
                          ) : (
                            <FiActivity size={16} />
                          )}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={activity.points > 0 ? 'success.main' : 'text.primary'}
                        >
                          {activity.points > 0 ? `+${activity.points}` : activity.points}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box textAlign="center" py={2}>
                    <Typography variant="body2" color="text.secondary">
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Device Connection Section */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">Device Connection</Typography>
              {isConnected ? (
                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2" color="success.main">
                    Connected
                  </Typography>
                </Box>
              ) : (
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<FiWatch size={16} />}
                  onClick={handleConnectDevice}
                >
                  Connect Device
                </Button>
              )}
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <FiWatch size={32} color="#1976d2" />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Apple Watch
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Connect your Apple Watch to automatically track your health data and earn points.
                  </Typography>
                  <Button 
                    variant={isConnected ? 'outlined' : 'contained'} 
                    color="primary"
                    startIcon={isConnected ? <FiCheck size={16} /> : <FiPlus size={16} />}
                    onClick={isConnected ? undefined : handleConnectDevice}
                    fullWidth
                  >
                    {isConnected ? 'Connected' : 'Connect Apple Watch'}
                  </Button>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Health Data Points
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Track your health data points and see how they contribute to your overall wellness.
                  </Typography>
                  
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Total Points Earned</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {healthPoints.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={3}>
                      <Typography variant="body2">Daily Average</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {Math.round(healthPoints / 30).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Button 
                      variant="outlined" 
                      color="primary"
                      fullWidth
                      onClick={handleSync}
                      startIcon={<FiRefreshCw size={16} />}
                    >
                      Sync Now
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
      
      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              p: 2
            }}
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 24,
                maxWidth: 400,
                width: '100%',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <IconButton 
                onClick={() => setShowQRCode(false)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8
                }}
              >
                <FiX />
              </IconButton>
              
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Connect Your Device
              </Typography>
              
              <Box 
                sx={{
                  p: 2,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'inline-block',
                  mb: 3
                }}
              >
                {/* Replace with actual QR code component */}
                <Box 
                  sx={{ 
                    width: 200, 
                    height: 200, 
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    QR Code Placeholder
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" mb={3}>
                Scan this QR code with your device's camera to connect and start syncing your health data.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth
                onClick={() => {
                  connectHealth();
                  setShowQRCode(false);
                }}
              >
                I've Connected My Device
              </Button>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HealthDashboard;
