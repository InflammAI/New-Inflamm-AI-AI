'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface VitalsChartProps {
  apiUrl: string;
  accessToken: string;
}

export function VitalsChart({ apiUrl, accessToken }: VitalsChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('heart_rate');

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch(`${apiUrl}/vitals/history?limit=30`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (response.ok) {
          const result = await response.json();
          // Format data for chart
          const chartData = (result.vitals || []).map((v: any) => ({
            date: new Date(v.recorded_at).toLocaleDateString(),
            heart_rate: v.heart_rate,
            blood_oxygen: v.blood_oxygen,
            temperature: v.temperature,
            steps: v.steps,
          }));
          setData(chartData);
        }
      } catch (err) {
        console.error('Failed to fetch vitals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, [apiUrl, accessToken]);

  if (loading) {
    return <div className="text-center text-gray-500 p-8">Loading chart...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center text-gray-500">
        No vital data available yet
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Vitals History</h2>

      <div className="mb-4 flex gap-2">
        {['heart_rate', 'blood_oxygen', 'temperature', 'steps'].map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedMetric === metric
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {metric === 'heart_rate' && 'Heart Rate'}
            {metric === 'blood_oxygen' && 'Blood Oxygen'}
            {metric === 'temperature' && 'Temperature'}
            {metric === 'steps' && 'Steps'}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedMetric === 'heart_rate' && (
            <Line type="monotone" dataKey="heart_rate" stroke="#ef4444" name="Heart Rate (bpm)" />
          )}
          {selectedMetric === 'blood_oxygen' && (
            <Line type="monotone" dataKey="blood_oxygen" stroke="#3b82f6" name="Blood Oxygen (%)" />
          )}
          {selectedMetric === 'temperature' && (
            <Line type="monotone" dataKey="temperature" stroke="#f97316" name="Temperature (°C)" />
          )}
          {selectedMetric === 'steps' && (
            <Line type="monotone" dataKey="steps" stroke="#a855f7" name="Steps" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
