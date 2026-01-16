import React, { useState } from 'react';
import { Building2, Users, Settings, FileText, BarChart3 } from 'lucide-react';
import HospitalTab from './components/HospitalTab';
import { DashboardLayout, type SidebarItem } from '@/components/layout/DashboardLayout';
import UserManagement from './components/user/UserManagement';
import MetadataManagement from './components/MetadataManagement';
import AnalyticsTab from './components/AnalyticsTab';

import LeadsTab from './components/LeadsTab';

const adminMenuItems: SidebarItem[] = [
  { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'leads', label: 'Missed Leads', icon: Users }, // Reusing Users icon or find better one like UserMinus
  { id: 'metadata', label: 'Form Settings', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

import { useSearchParams } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'hospitals';

  const setActiveTab = (tab: string) => {
    setSearchParams(prev => {
        prev.set('tab', tab);
        return prev;
    });
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'hospitals': return 'Hospital Management';
      case 'users': return 'User Management';
      case 'leads': return 'Lead Analysis';
      case 'metadata': return 'Form Settings';
      case 'analytics': return 'Data Analytics';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };


  return (
    <DashboardLayout
      menuItems={adminMenuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pageTitle={getPageTitle()}
    >
      {activeTab === 'hospitals' && <HospitalTab />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'leads' && <LeadsTab />}
      {activeTab === 'metadata' && <MetadataManagement />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
          Settings (Coming Soon)
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
