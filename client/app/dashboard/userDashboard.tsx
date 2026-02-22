"use client"

import React, { useState, useEffect } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import EventCard from "./components/user/EventCard";
import TicketList from "./components/user/TicketList";
import EventGallery from "./components/user/EventGallery";
import BookingModal from "./components/user/BookingModal";
import UserSettings from "./components/user/UserSettings";
import { Search, LogOut, Bell, User as UserIcon, Loader2, Calendar } from "lucide-react";
import axiosInstance from "../../service/axiosInstance";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { User } from "./page";
import { ModeToggle } from "../../component/ThemeToggle";

interface EventData {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventDate: string;
  city: string;
  venue: string;
  category: string;
  price: {
    premium: number;
    standard: number;
    economy: number;
  };
  capacity: {
    premium: number;
    standard: number;
    economy: number;
  };
  soldTickets: {
    premium: number;
    standard: number;
    economy: number;
  };
  status: string;
  bannerImage?: string;
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
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const router = useRouter();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("auth");

      // 1. Fetch tickets to identify user's events
      const ticketsResponse = await axiosInstance.get("/api/tickets", {
        headers: { auth: token }
      });
      let purchasedEventIds: string[] = [];
      if (ticketsResponse.data.success) {
        purchasedEventIds = ticketsResponse.data.tickets
          .map((t: any) => t.eventId && (typeof t.eventId === 'object' ? t.eventId._id : t.eventId))
          .filter(Boolean);
      }

      // 2. Fetch all events
      const response = await axiosInstance.get("/api/events", {
        headers: { auth: token }
      });

      if (response.data.success) {
        const allEvents = response.data.events;

        const now = new Date();

        // Filter only approved events for users and those where sales have started
        const approvedEvents = allEvents.filter((e: any) => e.status === "approved" && (!e.startDate || new Date(e.startDate) <= now));

        // Filter upcoming events that the user HAS BOUGHT TICKETS for
        const upcoming = approvedEvents
          .filter((e: any) =>
            new Date(e.eventDate || e.startDate) > now &&
            purchasedEventIds.includes(e._id)
          )
          .sort((a: any, b: any) => new Date(a.eventDate || a.startDate).getTime() - new Date(b.eventDate || b.startDate).getTime());

        // Explore can be any approved events the user MIGHT want to join
        const explore = approvedEvents
          .filter((e: any) => !purchasedEventIds.includes(e._id))
          .sort((a: any, b: any) => new Date(a.eventDate || a.startDate).getTime() - new Date(b.eventDate || b.startDate).getTime());

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

  const categories = ["All", ...Array.from(new Set(exploreEvents.map(e => e.category).filter(Boolean)))];
  const cities = ["All", ...Array.from(new Set(exploreEvents.map(e => e.city).filter(Boolean)))];

  const filteredUpcoming = upcomingEvents.filter(event =>
    (event.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (event.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (event.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (event.venue?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (event.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredExplore = exploreEvents.filter(event => {
    const matchesSearch = (event.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.venue?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (event.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || event.city === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const displayedUpcoming = searchQuery ? filteredUpcoming : filteredUpcoming.slice(0, 3);
  const displayedExplore = (searchQuery || selectedCategory !== "All" || selectedLocation !== "All") ? filteredExplore : filteredExplore.slice(0, 6);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto relative h-screen custom-scrollbar">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="p-8 lg:p-12 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b border-border pb-8">
            <div className="relative w-full max-w-xl group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-purple-500 w-5 h-5 pointer-events-none transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, organizers or vibes..."
                className="w-full bg-card border border-border text-foreground rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none placeholder-muted-foreground transition-all font-light shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-end">
              <ModeToggle />
              <div className="flex items-center gap-4 pl-6 border-l border-border">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">{user.role}</p>
                </div>
                <div
                  onClick={() => setActiveTab("profile")}
                  className="w-11 h-11 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl shadow-purple-600/20 cursor-pointer overflow-hidden relative group"
                >
                  {user.profileUrl ? (
                    <img
                      src={user.profileUrl.startsWith("/images")
                        ? `${process.env.NEXT_PUBLIC_NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BACKEND_HOSTED : process.env.NEXT_PUBLIC_BACKEND_LOCAL}${user.profileUrl}`
                        : user.profileUrl
                      }
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt="Profile"
                    />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <header>
                <h1 className="text-5xl font-serif text-foreground tracking-tight leading-tight">Your <span className="text-primary">Dashboard</span></h1>
                <p className="text-muted-foreground mt-3 text-lg max-w-lg font-light">Explore the most anticipated events and manage your bookings in one place.</p>
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
                        <h2 className="text-2xl font-serif text-foreground">Your Upcoming Events</h2>
                        <p className="text-muted-foreground text-sm mt-1">Events you are attending soon.</p>
                      </div>
                    </div>

                    {displayedUpcoming.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedUpcoming.map((event) => (
                          <EventCard
                            key={event._id}
                            title={event.title}
                            description={event.description}
                            date={new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            city={event.city}
                            venue={event.venue}
                            image={event.bannerImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"}
                            salesEndDate={event.endDate}
                            onView={() => router.push(`/events/${event._id}`)}
                            onJoin={() => {
                              setSelectedEvent(event);
                              setIsBookingModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-card rounded-4xl p-12 text-center border border-border border-dashed">
                        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-muted-foreground font-medium">No Upcoming Events</h3>
                        <p className="text-muted-foreground text-sm mt-2">Time to discover something new and exciting!</p>
                      </div>
                    )}
                  </section>

                  {/* Explore New Events */}
                  <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                      <div>
                        <h2 className="text-2xl font-serif text-foreground">Explore New Events</h2>
                        <p className="text-muted-foreground text-sm mt-1">Recommended for you based on your vibes.</p>
                      </div>

                      <div className="flex gap-3">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-card border border-border text-foreground text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c === "All" ? "All Categories" : c}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedLocation}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                          className="bg-card border border-border text-foreground text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        >
                          {cities.map((l) => (
                            <option key={l} value={l}>
                              {l === "All" ? "All Cities" : l}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {displayedExplore.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedExplore.map((event) => (
                          <EventCard
                            key={event._id}
                            title={event.title}
                            description={event.description}
                            date={new Date(event.eventDate || event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            city={event.city}
                            venue={event.venue}
                            image={event.bannerImage || "https://images.unsplash.com/photo-1540575861501-7ad0582371f4?q=80&w=2070&auto=format&fit=crop"}
                            salesEndDate={event.endDate}
                            onView={() => router.push(`/events/${event._id}`)}
                            onJoin={() => {
                              setSelectedEvent(event);
                              setIsBookingModalOpen(true);
                            }
                            }
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

          {activeTab === "tickets" && <TicketList user={user} />}
          {activeTab === "gallery" && <EventGallery user={user} />}
          {activeTab === "profile" && <UserSettings user={user} setUser={setUser} />}

        </div>
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />
    </div>
  );
}
