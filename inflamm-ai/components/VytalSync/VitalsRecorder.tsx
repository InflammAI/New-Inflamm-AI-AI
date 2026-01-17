'use client';

import { useState } from 'react';
import { Heart, Droplets, Zap, Gauge, TrendingUp } from 'lucide-react';

interface VitalsRecorderProps {
  apiUrl: string;
  accessToken: string;
  onSuccess: () => void;
}

export function VitalsRecorder({ apiUrl, accessToken, onSuccess }: VitalsRecorderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vitals, setVitals] = useState({
    heart_rate: '',
    blood_oxygen: '',
    temperature: '',
    respiratory_rate: '',
    steps: '',
    sleep_duration: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/vitals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : undefined,
          blood_oxygen: vitals.blood_oxygen ? parseInt(vitals.blood_oxygen) : undefined,
          temperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
          respiratory_rate: vitals.respiratory_rate ? parseInt(vitals.respiratory_rate) : undefined,
          steps: vitals.steps ? parseInt(vitals.steps) : undefined,
          sleep_duration: vitals.sleep_duration ? parseFloat(vitals.sleep_duration) : undefined,
          is_manual_entry: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to record vitals');
      }

      setVitals({
        heart_rate: '',
        blood_oxygen: '',
        temperature: '',
        respiratory_rate: '',
        steps: '',
        sleep_duration: '',
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Vitals</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VitalInput
            label="Heart Rate (bpm)"
            name="heart_rate"
            value={vitals.heart_rate}
            onChange={handleChange}
            min={30}
            max={200}
            icon={Heart}
            color="red"
          />

          <VitalInput
            label="Blood Oxygen (%)"
            name="blood_oxygen"
            value={vitals.blood_oxygen}
            onChange={handleChange}
            min={70}
            max={100}
            icon={Droplets}
            color="blue"
          />

          <VitalInput
            label="Temperature (°C)"
            name="temperature"
            value={vitals.temperature}
            onChange={handleChange}
            min={35}
            max={42}
            step={0.1}
            icon={Zap}
            color="orange"
          />

          <VitalInput
            label="Respiratory Rate (breaths/min)"
            name="respiratory_rate"
            value={vitals.respiratory_rate}
            onChange={handleChange}
            min={10}
            max={60}
            icon={Gauge}
            color="green"
          />

          <VitalInput
            label="Steps"
            name="steps"
            value={vitals.steps}
            onChange={handleChange}
            min={0}
            icon={TrendingUp}
            color="purple"
          />

          <VitalInput
            label="Sleep Duration (hours)"
            name="sleep_duration"
            value={vitals.sleep_duration}
            onChange={handleChange}
            min={0}
            max={24}
            step={0.5}
            icon={Droplets}
            color="indigo"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Recording...' : 'Record Vitals'}
        </button>
      </form>
    </div>
  );
}

interface VitalInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number | string;
  icon: any;
  color: string;
}

function VitalInput({
  label,
  name,
  value,
  onChange,
  min,
  max,
  step,
  icon: Icon,
  color,
}: VitalInputProps) {
  const colorClasses = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500',
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon className={`absolute left-3 top-3 w-4 h-4 ${colorClasses[color as keyof typeof colorClasses]}`} />
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
