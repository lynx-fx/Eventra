import React, { useState, useEffect } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import EventCard from "./components/user/EventCard";
import TicketList from "./components/user/TicketList";
import EventGallery from "./components/user/EventGallery";
import UserSettings from "./components/user/UserSettings";
import { Search, LogOut } from "lucide-react";
import Image from "next/image";
import api from "../utils/api";
import { useRouter } from "next/navigation";

// Interface for Event data
interface EventData {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  category: string;
  price: number;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [exploreEvents, setExploreEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        const allEvents = response.data.events;

        // Simple client-side filtering (ideally do this on backend)
        const now = new Date();
        const upcoming = allEvents.filter((e: any) => new Date(e.startDate) > now).slice(0, 3);
        const explore = allEvents.slice(0, 6); // Just show first 6 for explore

        setUpcomingEvents(upcoming);
        setExploreEvents(explore);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login'); // Assuming you have a login route
  };


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
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-10">
              {loading ? (
                <div className="text-center text-gray-400 py-10">Loading events...</div>
              ) : (
                <>
                  {/* Your Upcoming Events */}
                  <section>
                    <h2 className="text-2xl font-serif mb-6 text-white">Your Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingEvents.length > 0 ? upcomingEvents.map((event) => (
                        <EventCard
                          key={event._id}
                          title={event.title}
                          description={event.description}
                          date={new Date(event.startDate).toLocaleDateString()}
                          location={event.location}
                          // Fallback image if none provided
                          image={"https://placehold.co/400x300/1a1a1a/cccccc?text=" + encodeURIComponent(event.title)}
                          onView={() => console.log("View", event._id)}
                          onJoin={() => console.log("Join", event._id)}
                        />
                      )) : (
                        <p className="text-gray-500 italic">No upcoming events found.</p>
                      )}
                    </div>
                  </section>

                  <hr className="border-gray-800" />

                  {/* Explore New Events */}
                  <section>
                    <h2 className="text-2xl font-serif mb-6 text-white">Explore New Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {exploreEvents.map((event) => (
                        <EventCard
                          key={event._id}
                          title={event.title}
                          description={event.description}
                          date={new Date(event.startDate).toLocaleDateString()}
                          location={event.location}
                          image={"https://placehold.co/400x300/4a4a4a/cccccc?text=" + encodeURIComponent(event.title)}
                          onView={() => console.log("View", event)}
                        />
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === "tickets" && <TicketList />}
          {activeTab === "gallery" && <EventGallery />}
          {activeTab === "profile" && <UserSettings />}

        </div>
      </main>
    </div>
  );
}
