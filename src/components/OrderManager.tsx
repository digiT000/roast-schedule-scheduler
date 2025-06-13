
import React, { useState } from 'react';
import { Machine, Order } from '../types';
import { Plus, Coffee } from 'lucide-react';

interface OrderManagerProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  machines: Machine[];
}

export const OrderManager: React.FC<OrderManagerProps> = ({ orders, setOrders, machines }) => {
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    weight: 0,
    beanType: '',
    machineId: ''
  });

  const calculateRoastingTime = (weight: number): number => {
    // Simple calculation: approximately 10 minutes per kg + 20 minutes base time
    return Math.ceil(weight * 10 + 20);
  };

  const findNextAvailableSlot = (machineId: string, duration: number): { start: Date; end: Date } => {
    const now = new Date();
    const machineOrders = orders
      .filter(order => order.machineId === machineId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    let startTime = new Date(now);
    startTime.setMinutes(0, 0, 0); // Round to next hour

    for (const order of machineOrders) {
      if (startTime < order.startTime) {
        const gap = order.startTime.getTime() - startTime.getTime();
        if (gap >= duration * 60 * 1000) {
          break;
        }
      }
      startTime = new Date(order.endTime.getTime() + 30 * 60 * 1000); // 30 min buffer
    }

    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    return { start: startTime, end: endTime };
  };

  const handleAddOrder = () => {
    if (newOrder.clientName && newOrder.weight > 0 && newOrder.beanType && newOrder.machineId) {
      const duration = calculateRoastingTime(newOrder.weight);
      const { start, end } = findNextAvailableSlot(newOrder.machineId, duration);

      const order: Order = {
        id: Date.now().toString(),
        clientName: newOrder.clientName,
        weight: newOrder.weight,
        beanType: newOrder.beanType,
        machineId: newOrder.machineId,
        startTime: start,
        endTime: end,
        status: 'scheduled'
      };

      setOrders([...orders, order]);
      setNewOrder({ clientName: '', weight: 0, beanType: '', machineId: '' });
      setIsAddingOrder(false);
    }
  };

  const availableMachines = machines.filter(m => m.status !== 'maintenance');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-amber-900">Order Management</h2>
        <button
          onClick={() => setIsAddingOrder(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all"
        >
          <Plus size={20} />
          <span>New Order</span>
        </button>
      </div>

      {isAddingOrder && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">Create New Roasting Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Client name"
              value={newOrder.clientName}
              onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={newOrder.weight || ''}
              onChange={(e) => setNewOrder({ ...newOrder, weight: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="text"
              placeholder="Bean type (e.g., Ethiopian Yirgacheffe)"
              value={newOrder.beanType}
              onChange={(e) => setNewOrder({ ...newOrder, beanType: e.target.value })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={newOrder.machineId}
              onChange={(e) => setNewOrder({ ...newOrder, machineId: e.target.value })}
              className="px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select machine</option>
              {availableMachines.map(machine => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} ({machine.capacity}kg)
                </option>
              ))}
            </select>
          </div>
          
          {newOrder.weight > 0 && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700">
                Estimated roasting time: <span className="font-medium">{calculateRoastingTime(newOrder.weight)} minutes</span>
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleAddOrder}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Schedule Order
            </button>
            <button
              onClick={() => setIsAddingOrder(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-900">All Orders</h3>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map(order => {
              const machine = machines.find(m => m.id === order.machineId);
              return (
                <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-amber-100 rounded-lg">
                        <Coffee className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-amber-900">{order.clientName}</h4>
                        <p className="text-amber-600">{order.beanType}</p>
                        <p className="text-sm text-amber-700">
                          {order.weight}kg on {machine?.name} • {order.startTime.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-amber-100">
            <p className="text-amber-600">No orders scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
