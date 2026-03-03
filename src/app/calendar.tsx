"use client";

import { useState, useEffect, useCallback } from "react";
import { createEvent, deleteEvent } from "./actions";

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  color: string;
};

const COLORS = [
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
  { value: "#22c55e", label: "Green" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#ec4899", label: "Pink" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/events?year=${currentYear}&month=${currentMonth + 1}`
      );
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function goToToday() {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  }

  function openModal(dateStr: string) {
    setSelectedDate(dateStr);
    setSelectedColor(COLORS[0].value);
    setShowModal(true);
  }

  async function handleCreateEvent(formData: FormData) {
    await createEvent(formData);
    setShowModal(false);
    fetchEvents();
  }

  async function handleDeleteEvent(id: number) {
    await deleteEvent(id);
    fetchEvents();
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function getDateStr(day: number) {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function getEventsForDay(day: number) {
    const dateStr = getDateStr(day);
    return events.filter((e) => e.date.startsWith(dateStr));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Calendar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click on a day to add an event
            </p>
          </div>
          <button
            onClick={goToToday}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Today
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const isToday = day ? getDateStr(day) === todayStr : false;
              const dayEvents = day ? getEventsForDay(day) : [];

              return (
                <div
                  key={i}
                  onClick={() => day && openModal(getDateStr(day))}
                  className={`
                    min-h-[100px] p-1.5 border-b border-r border-gray-100 dark:border-gray-800
                    ${day ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" : "bg-gray-50/50 dark:bg-gray-900/50"}
                    ${i % 7 === 6 ? "border-r-0" : ""}
                  `}
                >
                  {day && (
                    <>
                      <div
                        className={`
                          text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1
                          ${isToday ? "bg-blue-600 text-white font-bold" : "text-gray-700 dark:text-gray-300"}
                        `}
                      >
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="group flex items-center gap-1 text-xs px-1.5 py-0.5 rounded truncate"
                            style={{ backgroundColor: event.color + "20", color: event.color }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate flex-1 font-medium">{event.title}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 shrink-0 hover:text-red-500 transition-opacity"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-400 pl-1.5">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="text-center text-sm text-gray-400 mt-4">Loading events...</div>
        )}

        {/* Add Event Modal */}
        {showModal && selectedDate && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                New Event
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <form action={handleCreateEvent}>
                <input type="hidden" name="date" value={selectedDate} />
                <input type="hidden" name="color" value={selectedColor} />

                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    autoFocus
                    placeholder="Meeting, Birthday, Deadline..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color
                  </label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor === c.value
                            ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.value, "--tw-ring-color": c.value } as React.CSSProperties}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
