
import React, { useState } from 'react';
import { Machine } from '../types';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';

interface MachineManagerProps {
  machines: Machine[];
  setMachines: (machines: Machine[]) => void;
}

export const MachineManager: React.FC<MachineManagerProps> = ({ machines, setMachines }) => {
  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [newMachine, setNewMachine] = useState({ name: '', capacity: 0 });

  const handleAddMachine = () => {
    if (newMachine.name && newMachine.capacity > 0) {
      const machine: Machine = {
        id: Date.now().toString(),
        name: newMachine.name,
        capacity: newMachine.capacity,
        status: 'available'
      };
      setMachines([...machines, machine]);
      setNewMachine({ name: '', capacity: 0 });
      setIsAddingMachine(false);
    }
  };

  const handleEditMachine = (machine: Machine) => {
    const updatedMachines = machines.map(m => 
      m.id === machine.id ? machine : m
    );
    setMachines(updatedMachines);
    setEditingMachine(null);
  };

  const handleDeleteMachine = (id: string) => {
    setMachines(machines.filter(m => m.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'roasting':
        return 'bg-orange-100 text-orange-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-900">Machine Management</h2>
        <button
          onClick={() => setIsAddingMachine(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
        >
          <Plus size={20} />
          <span>Add Machine</span>
        </button>
      </div>

      {isAddingMachine && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Add New Machine</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Machine name"
              value={newMachine.name}
              onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="number"
              placeholder="Capacity (kg)"
              value={newMachine.capacity || ''}
              onChange={(e) => setNewMachine({ ...newMachine, capacity: parseInt(e.target.value) || 0 })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddMachine}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Add Machine
            </button>
            <button
              onClick={() => setIsAddingMachine(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map(machine => (
          <div key={machine.id} className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
            {editingMachine?.id === machine.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingMachine.name}
                  onChange={(e) => setEditingMachine({ ...editingMachine, name: e.target.value })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="number"
                  value={editingMachine.capacity}
                  onChange={(e) => setEditingMachine({ ...editingMachine, capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <select
                  value={editingMachine.status}
                  onChange={(e) => setEditingMachine({ ...editingMachine, status: e.target.value as Machine['status'] })}
                  className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="available">Available</option>
                  <option value="roasting">Roasting</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditMachine(editingMachine)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingMachine(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Settings className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900">{machine.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                    {machine.status}
                  </span>
                </div>
                
                <p className="text-amber-700 mb-4">Capacity: {machine.capacity} kg</p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMachine(machine)}
                    className="flex items-center space-x-1 text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMachine(machine.id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
