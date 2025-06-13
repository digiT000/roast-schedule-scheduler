
import React from 'react';
import { Machine } from '../types';
import { Settings, Activity, AlertTriangle } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'roasting':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Settings className="h-4 w-4" />;
      case 'roasting':
        return <Activity className="h-4 w-4" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-amber-900">{machine.name}</h3>
        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(machine.status)}`}>
          {getStatusIcon(machine.status)}
          <span className="capitalize">{machine.status}</span>
        </span>
      </div>
      
      <div className="text-sm text-amber-700">
        <p>Capacity: <span className="font-medium">{machine.capacity} kg</span></p>
      </div>
    </div>
  );
};
