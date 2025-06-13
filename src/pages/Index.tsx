
import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { MachineManager } from '../components/MachineManager';
import { OrderManager } from '../components/OrderManager';
import { GanttChart } from '../components/GanttChart';
import { Machine, Order } from '../types';

const Index = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'machines' | 'orders' | 'gantt'>('dashboard');
  const [machines, setMachines] = useState<Machine[]>([
    { id: '1', name: 'Probat L12', capacity: 12, status: 'available' },
    { id: '2', name: 'Diedrich IR-12', capacity: 12, status: 'roasting' },
    { id: '3', name: 'Loring S15', capacity: 15, status: 'maintenance' }
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      clientName: 'Blue Bottle Coffee',
      weight: 10,
      beanType: 'Ethiopian Yirgacheffe',
      machineId: '1',
      startTime: new Date('2025-06-13T09:00:00'),
      endTime: new Date('2025-06-13T10:30:00'),
      status: 'scheduled'
    },
    {
      id: '2',
      clientName: 'Stumptown Coffee',
      weight: 8,
      beanType: 'Colombian Huila',
      machineId: '2',
      startTime: new Date('2025-06-13T11:00:00'),
      endTime: new Date('2025-06-13T12:20:00'),
      status: 'in-progress'
    }
  ]);

  const renderView = () => {
    switch (currentView) {
      case 'machines':
        return <MachineManager machines={machines} setMachines={setMachines} />;
      case 'orders':
        return <OrderManager orders={orders} setOrders={setOrders} machines={machines} />;
      case 'gantt':
        return <GanttChart orders={orders} machines={machines} />;
      default:
        return <Dashboard machines={machines} orders={orders} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto px-6 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
