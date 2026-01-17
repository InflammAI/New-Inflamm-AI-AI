import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function HealthDashboard() {
  const [showQRCode, setShowQRCode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [healthPoints, setHealthPoints] = useState(0);
  
  // Simulate health points loading
  useEffect(() => {
    // In a real app, this would be fetched from your backend
    const timer = setTimeout(() => {
      setHealthPoints(12478); // Example data point count
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  const healthMetrics = [
    { name: 'Steps', value: '8,452', target: '10,000', progress: 85, unit: 'steps' },
    { name: 'Sleep', value: '7.5', target: '8', progress: 94, unit: 'hours' },
    { name: 'Heart Rate', value: '72', target: '60-100', progress: 80, unit: 'bpm' },
    { name: 'Water Intake', value: '6', target: '8', progress: 75, unit: 'glasses' },
  ];

  const recentActivities = [
    { time: '10:30 AM', activity: 'Morning walk', points: 50 },
    { time: '12:15 PM', activity: 'Lunch logged', points: 10 },
    { time: '3:45 PM', activity: 'Workout completed', points: 100 },
    { time: '7:30 PM', activity: 'Meditation', points: 30 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Dashboard</h2>
        <p className="text-gray-600">Your health data and activity summary</p>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            className="bg-white overflow-hidden shadow rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {metric.value} <span className="text-sm text-gray-500">/ {metric.target} {metric.unit}</span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xl">{metric.progress}%</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full" 
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity */}
        <motion.div 
          className="bg-white shadow rounded-lg p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Activity</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Activity chart will be displayed here</p>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div 
          className="bg-white shadow rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {recentActivities.map((activity, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.activity}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        +{activity.points} pts
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              View All Activities
            </button>
          </div>
        </motion.div>
      </div>

      {/* Health Data Points */}
      <motion.div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Health Data Points</h3>
            <p className="mt-1 text-sm text-gray-600">Total health metrics collected</p>
            <div className="mt-3 flex items-baseline">
              <span className="text-3xl font-bold text-gray-900">
                {healthPoints.toLocaleString()}
              </span>
              <span className="ml-2 text-sm text-green-600 font-medium">
                +12.4% <span className="text-gray-500">this week</span>
              </span>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-gray-900">1,248</span> points from Apple Watch
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <span className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-gray-900">856</span> points from manual entries
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Rewards */}
        <motion.div 
          className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between h-full">
            <div>
              <h3 className="text-lg font-medium">Your INFLAMM Tokens</h3>
              <p className="mt-1 text-3xl font-bold">1,250 <span className="text-xl">INFL</span></p>
              <p className="mt-2 text-orange-100">Earn more by completing health activities</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Claim Rewards
            </button>
          </div>
        </motion.div>

        {/* Apple Watch Connection */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Apple Watch</h3>
              <p className="mt-1 text-sm text-gray-600">
                {isConnected 
                  ? 'Connected to your Apple Watch' 
                  : 'Connect your Apple Watch to track health data'}
              </p>
              
              <div className="mt-4">
                {!isConnected ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowQRCode(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2a8 8 0 0 1 3.292 15.293A8 8 0 1 1 6.706 6.707 8.001 8.001 0 0 1 18 2zm-5.205 12.293a1 1 0 1 0 1.414 1.414l3-3a1 1 0 0 0 0-1.416l-3-3a1 1 0 0 0-1.414 1.416l1.292 1.293H9a1 1 0 1 0 0 2h5.086l-1.291 1.293z"/>
                      </svg>
                      Connect Apple Watch
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Or pair with iPhone's Health app
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center text-green-600">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Connected</span>
                    </div>
                    <button
                      onClick={() => setIsConnected(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Connect Apple Watch</h3>
                <button 
                  onClick={() => setShowQRCode(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center">
                <div className="mx-auto bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4">
                  {/* Placeholder for QR Code - In a real app, generate a proper QR code */}
                  <div className="bg-gray-100 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-2">⌚</div>
                      <p className="text-xs text-gray-500">Scan with Apple Watch app</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Open the INFLAMM app on your Apple Watch and scan this code to connect.
                </p>
                
                <button
                  onClick={() => {
                    setIsConnected(true);
                    setShowQRCode(false);
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  I've scanned the code
                </button>
                
                <p className="mt-3 text-xs text-gray-500">
                  Don't have the app? Download it from the App Store.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
