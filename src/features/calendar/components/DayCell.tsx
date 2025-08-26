import { type CalendarEvent } from "../schema/calendar.type";
import { getDayString } from "../../main/member/profile/lib/calendarUtils";
import { EventChip } from "./EventChip";

// Import for the event modal
import { useState } from "react";
import { AllEventsModal } from "@src/shared/components/modals/AllEventsModal";
import { EventDetailsModal } from "@src/shared/components/modals/EventDetailsModal";

interface DayCellProps {
  date: Date;
  inMonth: boolean;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

// DayCell component that displays a single day with date and events (up to 2 visible)
export function DayCell({
  date,
  inMonth,
  events,
  onDateClick,
  onEventClick,
}: DayCellProps) {
  // State for modal visibility and selected event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  // Handle date click
  const handleClick = () => {
    onDateClick?.(date);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    if (onEventClick) {
      onEventClick(event);
    } else {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  // Handle showing all events
  const handleShowAllEvents = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setShowAllEventsModal(true);
  };

  // Handle event click from all events modal
  const handleAllEventsModalEventClick = (event: CalendarEvent) => {
    setShowAllEventsModal(false);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Get visible events (only show 1 with the new larger design)
  const visibleEvents = events.slice(0, 1);
  const remainingEvents = events.length > 1 ? events.length - 1 : 0;

  // Determine if cell is clickable (has events)
  const hasEvents = events.length > 0;
  const cellClass = `min-h-[100px] bg-white p-2 ${
    inMonth ? "text-primary" : "text-placeholderbg"
  } ${hasEvents ? "cursor-pointer hover:bg-gray-50" : ""}`;

  return (
    <>
      <div
        className={cellClass}
        onClick={hasEvents ? handleShowAllEvents : handleClick}
      >
        {/* Date number */}
        <div className="text-right text-sm font-medium">
          {getDayString(date)}
        </div>

        {/* Event list */}
        <div className="mt-2 overflow-y-auto max-h-[140px]">
          {visibleEvents.map((event) => (
            <div
              key={event.event_id}
              className="cursor-pointer"
              onClick={(e) => handleEventClick(event, e)}
            >
              <EventChip event={event} />
            </div>
          ))}

          {/* +N more button */}
          {remainingEvents > 0 && (
            <button
              className="text-sm p-2 mt-2 border border-gray-200 rounded-lg w-full text-center text-gray-600 hover:border-primary hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent onClick
                handleShowAllEvents(e);
              }}
            >
              +{remainingEvents} more
            </button>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <EventDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}

      {/* All Events Modal */}
      <AllEventsModal
        isOpen={showAllEventsModal}
        onClose={() => setShowAllEventsModal(false)}
        date={date}
        events={events}
        onEventClick={handleAllEventsModalEventClick}
      />
    </>
  );
}
