import { format } from "date-fns";
import type { CalendarEvent } from "@src/features/calendar/schema/calendar.type";
import { Modal } from "../Modal";

interface AllEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

/**
 * Modal component for displaying all events for a specific date
 */
export function AllEventsModal({
  isOpen,
  onClose,
  date,
  events,
  onEventClick,
}: AllEventsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="w-full">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Events on {format(date, "MMMM d, yyyy")}
        </h3>

        <div className="mt-4 max-h-96 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No events for this date.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.event_id}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={`/${event.organization.logo.directory}/${event.organization.logo.filename}`}
                        alt={event.organization.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <p className="text-xs text-gray-500">
                        {event.organization.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(event.event_date), "h:mm a")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
