"use client"

import { useState } from "react"
import { Calendar, Ticket, Heart, Share2, LogOut, User, CreditCard, Settings, Bell, MapPin, Clock } from "lucide-react"
import { Link } from "react-router-dom"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Mock data for user tickets
  const userTickets = [
    {
      id: 1,
      title: "Summer Music Festival 2025",
      date: "June 15, 2025",
      time: "7:00 PM",
      location: "City Park, Kathmandu",
      category: "Music",
      price: 2500,
      status: "Confirmed",
      ticketNumber: "EVT-2025-0001",
      image: "/summer-music-festival-stage-lights.jpg",
      quantity: 2,
    },
    {
      id: 2,
      title: "Tech Conference Asia",
      date: "July 22, 2025",
      time: "9:00 AM",
      location: "Convention Center, Kathmandu",
      category: "Tech",
      price: 5000,
      status: "Confirmed",
      ticketNumber: "EVT-2025-0002",
      image: "/tech-conference-stage.png",
      quantity: 1,
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "August 10, 2025",
      time: "6:00 PM",
      location: "Exhibition Hall, Kathmandu",
      category: "Food",
      price: 1800,
      status: "Pending",
      ticketNumber: "EVT-2025-0003",
      image: "/food-wine-tasting-event-gourmet.jpg",
      quantity: 3,
    },
  ]

  const transactionHistory = [
    {
      id: 1,
      event: "Summer Music Festival 2025",
      amount: 5000,
      date: "Jan 15, 2025",
      status: "Completed",
      type: "Purchase",
    },
    { id: 2, event: "Tech Conference Asia", amount: 5000, date: "Jan 10, 2025", status: "Completed", type: "Purchase" },
    { id: 3, event: "Food & Wine Expo", amount: 5400, date: "Jan 5, 2025", status: "Completed", type: "Purchase" },
    { id: 4, event: "Art Gallery Opening", amount: 0, date: "Dec 28, 2024", status: "Refunded", type: "Refund" },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-40 bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Eventra
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-slate-700/50 rounded-lg transition">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition"
            >
              <User size={20} />
            </button>
            <Link to="/login" className="px-4 py-2 text-slate-300 hover:text-white transition flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} bg-slate-800/50 border-r border-slate-700/50 transition-all duration-300 overflow-hidden`}
        >
          <div className="p-6 space-y-8">
            {/* User Profile Section */}
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-cyan-400 rounded-full mx-auto mb-3"></div>
              <h3 className="font-bold text-lg">John Doe</h3>
              <p className="text-slate-400 text-sm">john@example.com</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === "upcoming"
                    ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Calendar size={18} />
                <span>Upcoming Events</span>
              </button>

              <button
                onClick={() => setActiveTab("tickets")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === "tickets"
                    ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Ticket size={18} />
                <span>My Tickets</span>
              </button>

              <button
                onClick={() => setActiveTab("transactions")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === "transactions"
                    ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <CreditCard size={18} />
                <span>Transactions</span>
              </button>

              <button
                onClick={() => setActiveTab("favorites")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === "favorites"
                    ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Heart size={18} />
                <span>Favorites</span>
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === "settings"
                    ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 ${sidebarOpen ? "" : ""} p-8`}>
          {/* Upcoming Events Tab */}
          {activeTab === "upcoming" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Calendar size={32} className="text-cyan-400" />
                Upcoming Events
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group rounded-xl overflow-hidden bg-slate-800/50 border border-cyan-500/20 hover:border-cyan-500/50 transition hover:shadow-lg hover:shadow-cyan-500/10"
                  >
                    <div className="relative overflow-hidden h-48 bg-slate-700">
                      <img
                        src={ticket.image || "/placeholder.svg"}
                        alt={ticket.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold">
                        {ticket.category}
                      </div>
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-semibold ${
                          ticket.status === "Confirmed" ? "bg-green-500/80" : "bg-yellow-500/80"
                        }`}
                      >
                        {ticket.status}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-3 line-clamp-2">{ticket.title}</h3>

                      <div className="space-y-2 mb-4 text-slate-300 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-cyan-400" />
                          <span>{ticket.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-cyan-400" />
                          <span>{ticket.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-cyan-400" />
                          <span className="line-clamp-1">{ticket.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-4 border-t border-slate-700/50 pt-3">
                        <span className="text-slate-400">
                          Quantity: <span className="text-cyan-400 font-semibold">{ticket.quantity}</span>
                        </span>
                        <span className="text-slate-400">
                          Rs. <span className="text-cyan-400 font-semibold">{ticket.price}</span>
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg transition text-sm">
                          View Ticket
                        </button>
                        <button className="px-3 py-2 border border-cyan-500/50 rounded-lg hover:bg-slate-700/50 transition">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Tickets Tab */}
          {activeTab === "tickets" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Ticket size={32} className="text-cyan-400" />
                My Tickets
              </h2>

              <div className="space-y-4">
                {userTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-6 bg-slate-800/50 border border-cyan-500/20 rounded-xl hover:border-cyan-500/50 transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{ticket.title}</h3>
                        <p className="text-slate-400 text-sm">Ticket #: {ticket.ticketNumber}</p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          ticket.status === "Confirmed"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-slate-400">Date</p>
                        <p className="font-semibold text-cyan-300">{ticket.date}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Time</p>
                        <p className="font-semibold text-cyan-300">{ticket.time}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Location</p>
                        <p className="font-semibold text-cyan-300 line-clamp-1">{ticket.location}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Quantity</p>
                        <p className="font-semibold text-cyan-300">{ticket.quantity} ticket(s)</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg transition text-sm">
                        Download PDF
                      </button>
                      <button className="flex-1 py-2 border border-cyan-500/50 rounded-lg hover:bg-slate-700/50 transition text-sm">
                        Share Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <CreditCard size={32} className="text-cyan-400" />
                Transaction History
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="px-4 py-3 text-left text-slate-400 font-semibold">Event</th>
                      <th className="px-4 py-3 text-left text-slate-400 font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-slate-400 font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left text-slate-400 font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-slate-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/30 transition"
                      >
                        <td className="px-4 py-3 font-medium">{transaction.event}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.type === "Purchase"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-cyan-300">
                          {transaction.amount > 0 ? `Rs. ${transaction.amount}` : "Free"}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{transaction.date}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              transaction.status === "Completed"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Heart size={32} className="text-cyan-400" />
                Favorite Events
              </h2>
              <div className="p-8 text-center bg-slate-800/50 border border-cyan-500/20 rounded-xl">
                <Heart size={48} className="mx-auto mb-4 text-slate-600" />
                <p className="text-slate-400">No favorite events yet. Start adding events to your favorites!</p>
                <Link
                  to="/"
                  className="mt-4 inline-block px-6 py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Settings size={32} className="text-cyan-400" />
                Settings
              </h2>

              <div className="max-w-2xl space-y-6">
                {/* Profile Settings */}
                <div className="p-6 bg-slate-800/50 border border-cyan-500/20 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <button className="w-full py-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg transition">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="p-6 bg-slate-800/50 border border-cyan-500/20 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Email notifications for event reminders</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                      <span>Notifications for new events in my interests</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>Marketing emails and promotions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
