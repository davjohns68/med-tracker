import { useState } from 'react';
import { Plus, Pill } from 'lucide-react';
import { addMedication, takeMedication } from '../api';

export default function MedicationList({ medications, refreshMeds }) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addMedication({ name, dosage, frequency_hours: parseFloat(frequency) });
    setName('');
    setDosage('');
    setFrequency('');
    setIsAdding(false);
    refreshMeds();
  };

  const handleTake = async (id) => {
    await takeMedication(id);
    refreshMeds();
  };

  return (
    <div className="card">
      <div className="flex-between mb-4">
        <h2>My Medications</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={18} /> {isAdding ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          <div className="form-group">
            <label>Medication Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Ibuprofen" />
          </div>
          <div className="form-group">
            <label>Dosage</label>
            <input type="text" value={dosage} onChange={e => setDosage(e.target.value)} required placeholder="e.g. 200mg" />
          </div>
          <div className="form-group">
            <label>Frequency (in hours)</label>
            <input type="number" step="0.5" value={frequency} onChange={e => setFrequency(e.target.value)} required placeholder="e.g. 8" />
          </div>
          <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Save Medication</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {medications.length === 0 ? (
          <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No medications added yet.</p>
        ) : (
          medications.map(med => (
            <div key={med.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '50%' }}>
                  <Pill size={20} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{med.name}</h3>
                  <div className="text-muted text-sm">{med.dosage} • Every {med.frequency_hours} hours</div>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => handleTake(med.id)}>
                Take Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
