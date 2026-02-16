"use client"

import React, { useState, useEffect } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import EventCard from "./components/user/EventCard";
import TicketList from "./components/user/TicketList";
import EventGallery from "./components/user/EventGallery";
import UserSettings from "./components/user/UserSettings";
import { Search, LogOut, Bell, User as UserIcon, Loader2, Calendar } from "lucide-react";
import axiosInstance from "../../service/axiosInstance";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { User } from "./page";

interface EventData {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventDate: string;
  location: string;
  category: string;
  price: number;
  capacity: {
    premium: number;
    standard: number;
    economy: number;
  };
  status: string;
}

interface Props {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function UserDashboard({ user, setUser }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
  const [exploreEvents, setExploreEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("auth");
      const response = await axiosInstance.get("/api/events", {
        headers: {
          auth: token
        }
      });
      if (response.data.success) {
        const allEvents = response.data.events;

        // Filter only approved events for users
        const approvedEvents = allEvents.filter((e: any) => e.status === "approved");

        const now = new Date();
        const upcoming = approvedEvents
          .filter((e: any) => new Date(e.eventDate || e.startDate) > now)
          .sort((a: any, b: any) => new Date(a.eventDate || a.startDate).getTime() - new Date(b.eventDate || b.startDate).getTime())
          .slice(0, 3);

        const explore = approvedEvents.slice(0, 6);

        setUpcomingEvents(upcoming);
        setExploreEvents(explore);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLogout = () => {
    Cookies.remove("auth");
    toast.success("Successfully logged out");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30 overflow-hidden">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="p-8 lg:p-12 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-white/5 pb-8">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 w-5 h-5 pointer-events-none transition-colors" />
              <input
                type="text"
                placeholder="Search events, organizers or vibes..."
                className="w-full bg-[#111113] border border-white/5 text-gray-200 rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 outline-none placeholder-gray-600 transition-all font-light shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-end">
              <button className="p-3 bg-[#111113] border border-white/5 rounded-2xl text-gray-500 hover:text-white hover:border-white/10 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2 h-2 bg-purple-500 rounded-full border-2 border-[#111113]" />
              </button>

              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                <div className="w-11 h-11 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl shadow-purple-600/20">
                  U
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <header>
                <h1 className="text-5xl font-serif text-white tracking-tight leading-tight">Your <span className="text-purple-500">Dashboard</span></h1>
                <p className="text-gray-500 mt-3 text-lg max-w-lg font-light">Explore the most anticipated events and manage your bookings in one place.</p>
              </header>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 className="animate-spin text-purple-500" size={40} />
                  <p className="text-gray-500 font-serif italic">Synchronizing your experience...</p>
                </div>
              ) : (
                <>
                  {/* Your Upcoming Events */}
                  <section>
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h2 className="text-2xl font-serif text-white">Your Upcoming Events</h2>
                        <p className="text-gray-500 text-sm mt-1">Events you are attending soon.</p>
                      </div>
                    </div>

                    {upcomingEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => (
                          <EventCard
                            key={event._id}
                            title={event.title}
                            description={event.description}
                            date={new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            location={event.location || "Global"}
                            image={"https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"}
                            onView={() => console.log("View", event._id)}
                            onJoin={() => console.log("Join", event._id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-[#111113] rounded-4xl p-12 text-center border border-white/5 border-dashed">
                        <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-medium">No Upcoming Events</h3>
                        <p className="text-gray-600 text-sm mt-2">Time to discover something new and exciting!</p>
                      </div>
                    )}
                  </section>

                  {/* Explore New Events */}
                  <section>
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h2 className="text-2xl font-serif text-white">Explore New Events</h2>
                        <p className="text-gray-500 text-sm mt-1">Recommended for you based on your vibes.</p>
                      </div>
                    </div>

                    {exploreEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exploreEvents.map((event) => (
                          <EventCard
                            key={event._id}
                            title={event.title}
                            description={event.description}
                            date={new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            location={event.location || "Online"}
                            image={"https://images.unsplash.com/photo-1540575861501-7ad0582371f4?q=80&w=2070&auto=format&fit=crop"}
                            onView={() => console.log("View", event)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic py-10">No events to explore right now.</p>
                    )}
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === "tickets" && <TicketList />}
          {activeTab === "gallery" && <EventGallery />}
          {activeTab === "profile" && <UserSettings user={user} setUser={setUser} />}

        </div>
      </main>
    </div>
  );
}
