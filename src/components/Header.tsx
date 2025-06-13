
import React from 'react';
import { Coffee, Settings, Calendar, BarChart3 } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'machines', label: 'Machines', icon: Settings },
    { id: 'orders', label: 'Orders', icon: Coffee },
    { id: 'gantt', label: 'Schedule', icon: Calendar }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-amber-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg">
              <Coffee className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900">RoastMaster</h1>
              <p className="text-sm text-amber-700">Coffee Roasting Schedule Manager</p>
            </div>
          </div>
          
          <nav className="flex space-x-1 bg-amber-50 rounded-lg p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewType)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white text-amber-900 shadow-sm'
                      : 'text-amber-700 hover:text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
