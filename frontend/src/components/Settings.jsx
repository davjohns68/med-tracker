import { useState } from 'react';
import { updateProfile } from '../api';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [webhook, setWebhook] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(webhook);
      setStatus('Settings saved successfully! 🤘');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Error saving settings.');
    }
  };

  return (
    <div className="card mt-4">
      <div className="flex-between mb-4">
        <h2><SettingsIcon size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Notification Settings</h2>
      </div>
      <p className="text-muted text-sm mb-4">Enter a Discord Webhook URL to receive free, instant push notifications to your phone when a medication is due!</p>
      
      {status && <div style={{ color: status.includes('Error') ? 'var(--accent)' : 'var(--secondary)', marginBottom: '1rem' }}>{status}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label>Discord Webhook URL</label>
          <input 
            type="url" 
            placeholder="https://discord.com/api/webhooks/..." 
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
