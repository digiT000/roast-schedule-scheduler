
import React from 'react';
import { Machine, Order } from '../types';
import { MachineCard } from './MachineCard';
import { OrderCard } from './OrderCard';
import { Activity, Clock, CheckCircle } from 'lucide-react';

interface DashboardProps {
  machines: Machine[];
  orders: Order[];
}

export const Dashboard: React.FC<DashboardProps> = ({ machines, orders }) => {
  const activeMachines = machines.filter(m => m.status === 'roasting').length;
  const scheduledOrders = orders.filter(o => o.status === 'scheduled').length;
  const completedToday = orders.filter(o => o.status === 'completed').length;

  const todaysOrders = orders.filter(order => {
    const today = new Date().toDateString();
    return order.startTime.toDateString() === today;
  });

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Active Machines</p>
              <p className="text-3xl font-bold text-amber-900">{activeMachines}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Scheduled Orders</p>
              <p className="text-3xl font-bold text-amber-900">{scheduledOrders}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-700 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold text-amber-900">{completedToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Machines Overview */}
      <div>
        <h2 className="text-xl font-semibold text-amber-900 mb-4">Roasting Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map(machine => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      {/* Today's Orders */}
      <div>
        <h2 className="text-xl font-semibold text-amber-900 mb-4">Today's Roasting Schedule</h2>
        <div className="space-y-3">
          {todaysOrders.length > 0 ? (
            todaysOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-amber-100">
              <p className="text-amber-600">No orders scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
