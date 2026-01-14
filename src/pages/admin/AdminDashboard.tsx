import React, { useState } from 'react';
import { Building2, Users, Settings } from 'lucide-react';
import HospitalTab from './components/HospitalTab';
import { DashboardLayout, type SidebarItem } from '@/components/layout/DashboardLayout';
import UserManagement from './components/user/UserManagement';

const adminMenuItems: SidebarItem[] = [
  { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hospitals');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'hospitals': return 'Hospital Management';
      case 'users': return 'User Management';
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
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
          Settings (Coming Soon)
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
