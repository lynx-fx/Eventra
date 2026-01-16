import React, { useState } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import EventCard from "./components/EventCard";
import { Search } from "lucide-react";
import Image from "next/image";

// Mock Data
const upcomingEvents = [
  {
    id: 1,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/1a1a1a/cccccc?text=Event+1",
  },
  {
    id: 2,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/2a2a2a/cccccc?text=Event+2",
  },
  {
    id: 3,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/3a3a3a/cccccc?text=Event+3",
  },
];

const exploreEvents = [
  {
    id: 4,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/4a4a4a/cccccc?text=Event+4",
  },
  {
    id: 5,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/5a5a5a/cccccc?text=Event+5",
  },
  {
    id: 6,
    title: "ICP X-mas Fest",
    description: "Christmas fest held on informatics college Pokhara which included music, dances and other performances ...",
    date: "Dec 25, 2025",
    location: "Pokhara",
    image: "https://placehold.co/400x300/6a6a6a/cccccc?text=Event+6",
  },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-[#0f0f11] text-white font-sans">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header / Search Bar */}
          <div className="flex justify-between items-center mb-10">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Your event, ticket or venues"
                className="w-full bg-[#1C1C24] border border-gray-800 text-gray-200 pl-12 pr-4 py-3 rounded-full focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-2">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-gray-400">email@gmail.com</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-10">
              {/* Your Upcoming Events */}
              <section>
                <h2 className="text-2xl font-serif mb-6 text-white">Your Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      {...event}
                      onView={() => console.log("View", event.id)}
                      // Based on image, upcoming events have 'View' and 'Join' ? 
                      // Actually image shows "View" and "Join" for upcoming events.
                      onJoin={() => console.log("Join", event.id)}
                    />
                  ))}
                </div>
              </section>

              <hr className="border-gray-800" />

              {/* Explore New Events */}
              <section>
                <h2 className="text-2xl font-serif mb-6 text-white">Explore New Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exploreEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      {...event}
                      onView={() => console.log("View", event)}
                    // Explore events might only be viewable initially or joinable? 
                    // Design shows explore events also having the specific look. I'll stick to the card style.
                    />
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab !== "overview" && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Content for {activeTab}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


