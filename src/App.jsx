import { useMemo, useState, useEffect } from 'react';

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
});

const weekDays = Array.from({ length: 7 }, (_, i) =>
  dayFormatter.format(new Date(2024, 0, i + 7))
);

const isSameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isBefore = (a, b) => a.getTime() < b.getTime();
const isAfter = (a, b) => a.getTime() > b.getTime();

const clampDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatRangeLabel = (start, end) => {
  if (!start) return 'No dates selected';
  const format = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const startLabel = format.format(start);
  const endLabel = format.format(end || start);
  return `${startLabel} - ${endLabel}`;
};

const buildCalendarDays = (viewDate) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = 42;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startWeekday + 1;
    const date = new Date(year, month, dayNumber);
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
    };
  });
};

const buildId = () => Math.random().toString(36).slice(2, 10);

const loadStored = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

const storeValue = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export default function App() {
  const today = useMemo(() => clampDate(new Date()), []);
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [generalNotes, setGeneralNotes] = useState(() => loadStored('wallCalendarGeneralNotes', ''));
  const [noteInput, setNoteInput] = useState('');
  const [rangeNotes, setRangeNotes] = useState(() => loadStored('wallCalendarRangeNotes', []));
  const [theme, setTheme] = useState(() => loadStored('wallCalendarTheme', 'paper'));
  const [monthTransition, setMonthTransition] = useState('');
  const [monthlySaved, setMonthlySaved] = useState(false);

  useEffect(() => {
    storeValue('wallCalendarGeneralNotes', generalNotes);
  }, [generalNotes]);

  useEffect(() => {
    storeValue('wallCalendarRangeNotes', rangeNotes);
  }, [rangeNotes]);

  useEffect(() => {
    storeValue('wallCalendarTheme', theme);
  }, [theme]);

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  const handleDayClick = (date) => {
    const day = clampDate(date);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      setHoverDate(null);
      return;
    }

    if (rangeStart && !rangeEnd) {
      if (isBefore(day, rangeStart)) {
        setRangeStart(day);
        setRangeEnd(null);
        setHoverDate(null);
        return;
      }
      setRangeEnd(day);
      setHoverDate(null);
    }
  };

  const clearSelection = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setHoverDate(null);
  };

  const isInSelectedRange = (date) => {
    if (!rangeStart) return false;
    const end = rangeEnd || hoverDate;
    if (!end) return isSameDay(date, rangeStart);
    if (isAfter(rangeStart, end)) return false;
    return !isBefore(date, rangeStart) && !isAfter(date, end);
  };

  const isRangeStart = (date) => isSameDay(date, rangeStart);
  const isRangeEnd = (date) => rangeEnd && isSameDay(date, rangeEnd);

  const handleAddNote = () => {
    if (!rangeStart || noteInput.trim().length === 0) return;
    const note = {
      id: buildId(),
      start: rangeStart.toISOString(),
      end: (rangeEnd || rangeStart).toISOString(),
      text: noteInput.trim(),
    };
    setRangeNotes((prev) => [note, ...prev]);
    setNoteInput('');
  };

  const handleMonthlySave = () => {
    storeValue('wallCalendarGeneralNotes', generalNotes);
    setMonthlySaved(true);
    window.setTimeout(() => setMonthlySaved(false), 1200);
  };

  const handleDeleteNote = (id) => {
    setRangeNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const shiftMonth = (direction) => {
    const nextDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1);
    setMonthTransition(direction > 0 ? 'flip-forward' : 'flip-back');
    setViewDate(nextDate);
  };

  useEffect(() => {
    if (!monthTransition) return;
    const timer = window.setTimeout(() => setMonthTransition(''), 500);
    return () => window.clearTimeout(timer);
  }, [monthTransition]);

  const selectedRangeLabel = formatRangeLabel(rangeStart, rangeEnd);

  return (
    <div className={`page theme-${theme}`}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-tag">Studio Calendar</span>
          <h1>Wall Planner</h1>
          <p>Pick a range, collect notes, and keep the month anchored to a hero image.</p>
        </div>
        <div className="theme-toggle">
          <button
            className={theme === 'paper' ? 'active' : ''}
            onClick={() => setTheme('paper')}
          >
            Paper
          </button>
          <button
            className={theme === 'ink' ? 'active' : ''}
            onClick={() => setTheme('ink')}
          >
            Ink
          </button>
        </div>
      </header>

      <main className="calendar-shell">
        <section className="hero-panel">
          <div className="hero-image" role="img" aria-label="Mountain climber hero" />
          <div className="hero-caption">
            <span className="hero-year">{viewDate.getFullYear()}</span>
            <span className="hero-month">{monthFormatter.format(viewDate)}</span>
            <div className="hero-range">
              <span>Selected Range</span>
              <strong>{selectedRangeLabel}</strong>
            </div>
          </div>
          <div className="hero-actions">
            <button onClick={() => shiftMonth(-1)}>Previous</button>
            <button onClick={() => shiftMonth(1)}>Next</button>
          </div>
        </section>

        <section className="calendar-panel">
          <div className="calendar-header">
            <div>
              <h2>{monthYearFormatter.format(viewDate)}</h2>
              <p>Tap a start date and an end date to mark your window.</p>
            </div>
            <div className="calendar-controls">
              <button className="ghost" onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}>
                Jump to Today
              </button>
              <button className="ghost" onClick={clearSelection}>
                Clear Selection
              </button>
            </div>
          </div>

          <div className={`calendar-grid ${monthTransition}`}>
            {weekDays.map((label) => (
              <div key={label} className="calendar-weekday">
                {label}
              </div>
            ))}
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const isToday = isSameDay(date, today);
              const inRange = isInSelectedRange(date);
              const isStart = isRangeStart(date);
              const isEnd = isRangeEnd(date);
              return (
                <button
                  key={date.toISOString()}
                  className={`calendar-day ${isCurrentMonth ? '' : 'muted'} ${
                    inRange ? 'range' : ''
                  } ${isStart ? 'range-start' : ''} ${isEnd ? 'range-end' : ''} ${
                    isToday ? 'today' : ''
                  }`}
                  onClick={() => handleDayClick(date)}
                  onMouseEnter={() => setHoverDate(rangeStart && !rangeEnd ? clampDate(date) : null)}
                  onMouseLeave={() => setHoverDate(null)}
                  type="button"
                >
                  <span>{date.getDate()}</span>
                </button>
              );
            })}
          </div>

          <div className="notes-panel">
            <div className="notes-block">
              <h3>Monthly Notes</h3>
              <textarea
                value={generalNotes}
                onChange={(event) => setGeneralNotes(event.target.value)}
                placeholder="Capture priorities, reminders, or milestones for this month."
                rows={6}
              />
              <div className="notes-actions">
                <button onClick={handleMonthlySave} className="primary">
                  {monthlySaved ? 'Saved' : 'Save'}
                </button>
                <span className="notes-hint">Autosaves as you type.</span>
              </div>
            </div>

            <div className="notes-block">
              <h3>Range Notes</h3>
              <p className="range-label">{selectedRangeLabel}</p>
              <div className="range-input">
                <input
                  value={noteInput}
                  onChange={(event) => setNoteInput(event.target.value)}
                  placeholder="Add a note tied to the selected dates"
                  type="text"
                />
                <button onClick={handleAddNote}>Save</button>
              </div>
              <div className="range-list">
                {rangeNotes.length === 0 && (
                  <p className="empty">No range notes yet. Select a range and add one.</p>
                )}
                {rangeNotes.map((note) => {
                  const start = new Date(note.start);
                  const end = new Date(note.end);
                  return (
                    <div key={note.id} className="range-card">
                      <div>
                        <strong>{formatRangeLabel(start, end)}</strong>
                        <p>{note.text}</p>
                      </div>
                      <button onClick={() => handleDeleteNote(note.id)} aria-label="Remove note">
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
