import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WearableConnect } from '@/components/WearableIntegration/WearableConnect';
import { WearableDashboard } from '@/components/WearableIntegration/WearableDashboard';

export const metadata: Metadata = {
  title: 'Wearable Integration - App Vital Sync',
  description: 'Connect your wearable devices and sync health data securely with zero-knowledge encryption.',
};

export default function WearablePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wearable Integration</h1>
          <p className="text-lg text-gray-600">
            Connect your favorite wearable devices to automatically sync your health data. 
            All data is encrypted with zero-knowledge technology for maximum privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connection Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Connect Devices</h2>
              <WearableConnect />
            </div>
          </div>

          {/* Dashboard Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Dashboard</h2>
              <WearableDashboard connectedProviders={[]} />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure OAuth 2.0</h3>
            <p className="text-sm text-gray-600">
              Industry-standard authentication with encrypted token storage and automatic refresh.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Sync</h3>
            <p className="text-sm text-gray-600">
              Automatic data synchronization with support for steps, heart rate, and sleep tracking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Interactive charts and insights for your health trends and patterns.
            </p>
          </div>
        </div>

        {/* Supported Devices */}
        <div className="mt-12 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Devices & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">F</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Fitbit</h4>
                <p className="text-sm text-gray-600">Trackers, Smartwatches, Scales</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">G</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Google Fit</h4>
                <p className="text-sm text-gray-600">Android, Wear OS, Web</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold">G</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Garmin Connect</h4>
                <p className="text-sm text-gray-600">Watches, Fitness Trackers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-bold">A</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Apple Health</h4>
                <p className="text-sm text-gray-600">iPhone, Apple Watch</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">O</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Oura Ring</h4>
                <p className="text-sm text-gray-600">Smart Ring, App</p>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Integration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">OAuth 2.0 Flow</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`// 1. Initiate OAuth
GET /api/wearable/connect/{provider}

// 2. User authorization
// Redirect to provider's OAuth endpoint

// 3. Callback handling
GET /api/wearable/callback/{provider}?code=xxx&state=xxx

// 4. Token exchange
// Exchange authorization code for access token`}
                </pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retrieval</h3>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`// Fetch wearable data
GET /api/wearable/data/{provider}?date=2024-01-15

// Response format
{
  "provider": "fitbit",
  "date": "2024-01-15",
  "steps": 8432,
  "heartRate": { ... },
  "sleep": { ... }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
