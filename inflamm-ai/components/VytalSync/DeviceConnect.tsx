'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Wifi, WifiOff } from 'lucide-react';

interface DeviceConnectProps {
  apiUrl: string;
  accessToken: string;
  onSuccess: () => void;
}

export function DeviceConnect({ apiUrl, accessToken, onSuccess }: DeviceConnectProps) {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('fitbit');

  useEffect(() => {
    fetchDevices();
  }, [apiUrl, accessToken]);

  const fetchDevices = async () => {
    try {
      const response = await fetch(`${apiUrl}/devices`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDevices(data.devices || []);
      }
    } catch (err) {
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDevice = async () => {
    try {
      setError(null);
      // Redirect to OAuth flow
      const redirectUrl = `${apiUrl}/devices/connect?device=${selectedDevice}`;
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect device');
    }
  };

  const handleDisconnect = async (deviceId: string) => {
    try {
      const response = await fetch(`${apiUrl}/devices/${deviceId}/disconnect`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (response.ok) {
        setDevices(devices.filter((d) => d.id !== deviceId));
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect device');
    }
  };

  const handleSync = async (deviceId: string) => {
    try {
      const response = await fetch(`${apiUrl}/devices/${deviceId}/sync`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      if (response.ok) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync device');
    }
  };

  return (
    <div className="space-y-6">
      {/* Connected Devices */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Devices</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading devices...</div>
        ) : devices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No devices connected yet</p>
            <p className="text-sm mt-1">Connect a wearable device to start tracking</p>
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    device.connection_status === 'active'
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {device.connection_status === 'active' ? (
                      <Wifi className="w-5 h-5 text-green-600" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {device.device_type.charAt(0).toUpperCase() + device.device_type.slice(1)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connected {new Date(device.created_at).toLocaleDateString()}
                    </p>
                    {device.last_synced && (
                      <p className="text-xs text-gray-500">
                        Last synced: {new Date(device.last_synced).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSync(device.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Sync
                  </button>
                  <button
                    onClick={() => handleDisconnect(device.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Device */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Device</h2>
          <button
            onClick={() => setShowAddDevice(!showAddDevice)}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Connect</span>
          </button>
        </div>

        {showAddDevice && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Device Type
              </label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="fitbit">Fitbit</option>
                <option value="oura">Oura Ring</option>
                <option value="garmin">Garmin</option>
                <option value="applewatch">Apple Watch</option>
              </select>
            </div>

            <button
              onClick={handleConnectDevice}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Connect {selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
