import { format, isPast } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

export default function CalendarView({ medications }) {
  // Combine all "last_taken" and "next_due" events into a single sorted timeline
  const timelineEvents = [];

  medications.forEach(med => {
    if (med.last_taken) {
      timelineEvents.push({
        id: `${med.id}-taken-${med.last_taken}`,
        medName: med.name,
        dosage: med.dosage,
        time: new Date(med.last_taken + 'Z'), // append Z to parse as UTC from FastAPI
        type: 'taken'
      });
    }
    if (med.next_due) {
      timelineEvents.push({
        id: `${med.id}-due-${med.next_due}`,
        medName: med.name,
        dosage: med.dosage,
        time: new Date(med.next_due + 'Z'),
        type: 'due'
      });
    }
  });

  // Sort events by time
  timelineEvents.sort((a, b) => a.time - b.time);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="flex-between mb-4">
        <h2><Calendar size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Daily Schedule</h2>
      </div>

      <div className="timeline">
        {timelineEvents.length === 0 ? (
          <p className="text-muted" style={{ paddingLeft: '1rem' }}>No schedule available yet. Take a medication to start the timeline.</p>
        ) : (
          timelineEvents.map(event => (
            <div key={event.id} className={`timeline-item ${event.type}`}>
              <div className="timeline-time flex-center" style={{ justifyContent: 'flex-start', gap: '0.5rem' }}>
                <Clock size={14} /> 
                {format(event.time, 'MMM d, h:mm a')}
                {event.type === 'due' && isPast(event.time) && (
                  <span style={{ background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>OVERDUE</span>
                )}
              </div>
              <div className="timeline-content">
                <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{event.medName} <span className="text-muted text-sm" style={{ fontWeight: 'normal' }}>({event.dosage})</span></h4>
                <p className="text-muted text-sm" style={{ margin: '0.25rem 0 0' }}>
                  {event.type === 'taken' ? '✅ Taken' : '⏳ Scheduled'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
