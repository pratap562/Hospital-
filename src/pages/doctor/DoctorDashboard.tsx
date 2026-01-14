import React, { useState } from 'react';
import { Search, ClipboardList, Users, Settings } from 'lucide-react';
import { DashboardLayout, type SidebarItem } from '@/components/layout/DashboardLayout';
import type { Hospital } from '@/services/mocks/hospitalData';
import HospitalSelector from '@/components/shared/HospitalSelector';
import SearchTab from './components/SearchTab';
import VisitsTab from './components/VisitsTab';
import PatientsTab from './components/PatientsTab';

const doctorMenuItems: SidebarItem[] = [
  { id: 'search', label: 'Search', icon: Search },
  { id: 'visits', label: 'Visits', icon: ClipboardList },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const getPageTitle = () => {
    if (!selectedHospital) {
      return 'Select Hospital';
    }
    switch (activeTab) {
      case 'search': return `Search Patient - ${selectedHospital.name}`;
      case 'visits': return `Today's Visits - ${selectedHospital.name}`;
      case 'patients': return 'Patient History';
      case 'settings': return 'Settings';
      default: return 'Doctor Dashboard';
    }
  };


  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  return (
    <DashboardLayout
      menuItems={doctorMenuItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      pageTitle={getPageTitle()}
    >
      {!selectedHospital ? (
        <HospitalSelector
          onSelect={handleHospitalSelect}
          title="Select Hospital"
          description="Choose the hospital to start your session"
        />
      ) : (
        <>
          {activeTab === 'search' && <SearchTab hospitalId={selectedHospital.id} />}
          
          {activeTab === 'visits' && <VisitsTab hospitalId={selectedHospital.id} />}
          
          {activeTab === 'patients' && <PatientsTab />}
          
          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-lg bg-card">
              <Settings className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Settings</p>
              <p className="text-sm">Coming Soon - Manage your profile and preferences.</p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
