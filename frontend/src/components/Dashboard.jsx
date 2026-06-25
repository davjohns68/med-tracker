import { useEffect, useState } from 'react';
import { getMedications } from '../api';
import MedicationList from './MedicationList';
import CalendarView from './CalendarView';
import Settings from './Settings';
import { LogOut, Activity } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [medications, setMedications] = useState([]);

  const fetchMeds = async () => {
    try {
      const data = await getMedications();
      setMedications(data);
    } catch (err) {
      if (err.message === "Failed to fetch medications") {
        onLogout(); // Token might be expired
      }
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="flex-center" style={{ gap: '0.75rem' }}>
          <Activity size={32} color="var(--primary)" />
          <h1 className="header-title" style={{ margin: 0 }}>MedTracker</h1>
        </div>
        <button className="btn btn-secondary" onClick={onLogout}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <MedicationList medications={medications} refreshMeds={fetchMeds} />
          <Settings />
        </div>
        <CalendarView medications={medications} />
      </div>
    </div>
  );
}
