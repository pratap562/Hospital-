import React, { useState } from 'react';
import { Calendar, Users, Settings } from 'lucide-react';
import { DashboardLayout, type SidebarItem } from '@/components/layout/DashboardLayout';
import type { Hospital } from '@/services/mocks/hospitalData';
import HospitalSelector from '@/components/shared/HospitalSelector';
import AppointmentsTab from './components/AppointmentsTab';

const receptionistMenuItems: SidebarItem[] = [
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const ReceptionistDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getPageTitle = () => {
    if (!selectedHospital && activeTab === 'appointments') {
      return 'Select Hospital';
    }
    switch (activeTab) {
      case 'appointments': return `Today's Appointments - ${selectedHospital?.name}`;
      case 'patients': return 'Patient Records';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };


  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleBackToSelection = () => {
    setSelectedHospital(null);
  };

  return (
    <DashboardLayout
      menuItems={receptionistMenuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pageTitle={getPageTitle()}
    >
      {activeTab === 'appointments' && (
        <>
          {!selectedHospital ? (
            <HospitalSelector
              onSelect={handleHospitalSelect}
              title="Select Hospital"
              description="Choose the hospital to view today's appointments"
            />
          ) : (
            <AppointmentsTab 
              hospitalId={selectedHospital.id}
              onBack={handleBackToSelection}
            />
          )}
        </>
      )}
      
      {activeTab === 'patients' && (
        <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
          <Users className="mr-2 h-8 w-8 opacity-50" />
          Patient Records (Coming Soon)
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg">
          <Settings className="mr-2 h-8 w-8 opacity-50" />
          Settings (Coming Soon)
        </div>
      )}
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
