import React from "react";

const EventCard = ({ event }) => {
  return (
    // <div className="bg-white p-4 rounded-lg shadow-lg">
    <div className="stats-card">
      <img
        src={event.eventImage ? URL.createObjectURL(event.eventImage) : "/icons/default-image.svg"}
        alt={event.eventName}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800">{event.eventName}</h3>
      <p className="text-sm text-gray-600 mt-2">{event.eventSummary}</p>
      <p className="text-sm text-gray-500 mt-2">{event.eventLocation}</p>
      <p className="text-sm text-gray-500 mt-1">{event.eventDate}</p>
    </div>
  );
};

export default EventCard;
