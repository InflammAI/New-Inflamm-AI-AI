import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { IntegratedHealthDashboard } from '../../components/HealthTracker/IntegratedHealthDashboard';

export const metadata: Metadata = {
  title: 'Health Tracker - App Vital Sync',
  description: 'Monitor your health metrics and sync with Vytal Sync for comprehensive health data management.',
};

export default function HealthTrackerPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Tracker</h1>
          <p className="text-lg text-gray-600">
            Connect your wearable devices and monitor your health metrics in real-time. 
            Sync seamlessly with Vytal Sync for secure, encrypted health data management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Integrated Health Dashboard */}
          <div className="lg:col-span-3">
            <IntegratedHealthDashboard />
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h4>
            <p className="text-sm text-gray-600">
              Get instant updates on your heart rate, steps, and other vital signs as they happen.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Historical Trends</h4>
            <p className="text-sm text-gray-600">
              Track your progress over time with detailed charts and analytics.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Smart Alerts</h4>
            <p className="text-sm text-gray-600">
              Receive notifications for abnormal readings or when you reach your goals.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
