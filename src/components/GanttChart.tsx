import React from 'react';
import { Machine, Order } from '../types';
import { Calendar, Clock, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface GanttChartProps {
  orders: Order[];
  machines: Machine[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ orders, machines }) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(8, 0, 0, 0); // Start at 8 AM
  const endOfDay = new Date(today);
  endOfDay.setHours(18, 0, 0, 0); // End at 6 PM

  const timeSlots: string[] = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const exportToExcel = () => {
    const exportData = orders.map(order => {
      const machine = machines.find(m => m.id === order.machineId);
      return {
        'Client Name': order.clientName,
        'Bean Type': order.beanType,
        'Weight (kg)': order.weight,
        'Machine': machine?.name || 'Unknown',
        'Machine Capacity (kg)': machine?.capacity || 'Unknown',
        'Start Time': order.startTime.toLocaleString(),
        'End Time': order.endTime.toLocaleString(),
        'Status': order.status.replace('-', ' '),
        'Date': order.startTime.toLocaleDateString(),
        'Duration (minutes)': Math.round((order.endTime.getTime() - order.startTime.getTime()) / (1000 * 60))
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    
    // Auto-size columns
    const columnWidths = [
      { wch: 20 }, // Client Name
      { wch: 25 }, // Bean Type
      { wch: 12 }, // Weight
      { wch: 15 }, // Machine
      { wch: 18 }, // Machine Capacity
      { wch: 20 }, // Start Time
      { wch: 20 }, // End Time
      { wch: 12 }, // Status
      { wch: 12 }, // Date
      { wch: 15 }  // Duration
    ];
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Roasting Schedule');
    
    const fileName = `roasting-schedule-${today.toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const getOrderPosition = (order: Order) => {
    const orderStart = new Date(order.startTime);
    const orderEnd = new Date(order.endTime);
    
    const dayStart = startOfDay.getTime();
    const dayDuration = endOfDay.getTime() - startOfDay.getTime();
    
    const orderStartTime = orderStart.getTime();
    const orderDuration = orderEnd.getTime() - orderStartTime;
    
    const left = ((orderStartTime - dayStart) / dayDuration) * 100;
    const width = (orderDuration / dayDuration) * 100;
    
    return { left: Math.max(0, left), width: Math.min(width, 100 - left) };
  };

  const getBeanTypeColor = (beanType: string) => {
    const colors = {
      'Ethiopian': 'bg-yellow-200 border-yellow-400 text-yellow-800',
      'Colombian': 'bg-green-200 border-green-400 text-green-800',
      'Brazilian': 'bg-blue-200 border-blue-400 text-blue-800',
      'Guatemalan': 'bg-purple-200 border-purple-400 text-purple-800',
      'default': 'bg-amber-200 border-amber-400 text-amber-800'
    };
    
    const matchedColor = Object.keys(colors).find(key => beanType.includes(key));
    return colors[matchedColor as keyof typeof colors] || colors.default;
  };

  const todaysOrders = orders.filter(order => {
    const orderDate = new Date(order.startTime).toDateString();
    return orderDate === today.toDateString();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-amber-900">Roasting Schedule</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileSpreadsheet size={18} />
            <span>Export to Excel</span>
          </button>
          <div className="text-sm text-amber-700">
            {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
        {/* Time Header */}
        <div className="grid grid-cols-12 border-b border-amber-100">
          <div className="p-4 bg-amber-50 font-semibold text-amber-900 border-r border-amber-100">
            Machine
          </div>
          {timeSlots.map((slot, index) => (
            <div key={slot} className={`p-2 text-center text-xs font-medium text-amber-700 bg-amber-50 ${index < timeSlots.length - 1 ? 'border-r border-amber-100' : ''}`}>
              {slot}
            </div>
          ))}
        </div>

        {/* Machine Rows */}
        {machines.map(machine => {
          const machineOrders = todaysOrders.filter(order => order.machineId === machine.id);
          
          return (
            <div key={machine.id} className="relative">
              <div className="grid grid-cols-12 min-h-[80px] border-b border-amber-100">
                <div className="p-4 bg-gray-50 border-r border-amber-100 flex items-center">
                  <div>
                    <h3 className="font-semibold text-amber-900">{machine.name}</h3>
                    <p className="text-xs text-amber-600">{machine.capacity}kg capacity</p>
                  </div>
                </div>
                
                <div className="col-span-11 relative">
                  {/* Time grid lines */}
                  {timeSlots.slice(0, -1).map((_, index) => (
                    <div
                      key={index}
                      className="absolute top-0 h-full border-r border-amber-100"
                      style={{ left: `${((index + 1) / (timeSlots.length - 1)) * 100}%` }}
                    />
                  ))}
                  
                  {/* Orders */}
                  {machineOrders.map(order => {
                    const position = getOrderPosition(order);
                    return (
                      <div
                        key={order.id}
                        className={`absolute top-2 h-12 rounded border-2 px-2 py-1 text-xs ${getBeanTypeColor(order.beanType)}`}
                        style={{ left: `${position.left}%`, width: `${position.width}%` }}
                      >
                        <div className="font-medium truncate">{order.clientName}</div>
                        <div className="truncate">{order.weight}kg</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
        <h3 className="text-lg font-semibold text-amber-900 mb-4">Bean Type Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Ethiopian', 'Colombian', 'Brazilian', 'Guatemalan', 'Other'].map(type => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border-2 ${getBeanTypeColor(type)}`} />
              <span className="text-sm text-amber-700">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {todaysOrders.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center border border-amber-100">
          <Clock className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <p className="text-amber-600">No roasting orders scheduled for today</p>
        </div>
      )}
    </div>
  );
};
