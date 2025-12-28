// "use client"

// import { useState } from "react"
// import {
//   Calendar,
//   Ticket,
//   Heart,
//   Share2,
//   LogOut,
//   User as UserIcon,
//   CreditCard,
//   Settings,
//   Bell,
//   MapPin,
//   Clock,
//   ChevronRight,
//   Download,
//   Copy,
//   ImageIcon,
// } from "lucide-react"
// import Link from "next/link";
// import {User} from "./page"

// interface Props {
//   user: User;
// }

// // TODO: Handle props
// export default function userDashboard(
//   { user }: Props
// ) {
//   const [activeTab, setActiveTab] = useState("upcoming")
//   const [sidebarOpen, setSidebarOpen] = useState(true)

//   const userTickets = [
//     {
//       id: 1,
//       title: "Summer Music Festival 2025",
//       date: "June 15, 2025",
//       time: "7:00 PM",
//       location: "City Park, Kathmandu",
//       category: "Music",
//       price: 2500,
//       status: "Confirmed",
//       ticketNumber: "EVT-2025-0001",
//       image: "/summer-music-festival-stage-lights.jpg",
//       quantity: 2,
//       gallery: ["/music-festival-crowd.jpg", "/concert-stage-lights.png", "/festival-performers.jpg"],
//     },
//     {
//       id: 2,
//       title: "Tech Conference Asia",
//       date: "July 22, 2025",
//       time: "9:00 AM",
//       location: "Convention Center, Kathmandu",
//       category: "Tech",
//       price: 5000,
//       status: "Confirmed",
//       ticketNumber: "EVT-2025-0002",
//       image: "/tech-conference-stage.jpg",
//       quantity: 1,
//       gallery: ["/tech-conference-keynote.png", "/tech-talk-presentation.png", "/tech-expo-booths.jpg"],
//     },
//     {
//       id: 3,
//       title: "Food & Wine Expo",
//       date: "August 10, 2025",
//       time: "6:00 PM",
//       location: "Exhibition Hall, Kathmandu",
//       category: "Food",
//       price: 1800,
//       status: "Pending",
//       ticketNumber: "EVT-2025-0003",
//       image: "/food-wine-tasting-gourmet.jpg",
//       quantity: 3,
//       gallery: ["/gourmet-food-tasting.jpg", "/wine-showcase-event.jpg", "/chef-cooking-demonstration.png"],
//     },
//   ]

//   const transactionHistory = [
//     {
//       id: 1,
//       event: "Summer Music Festival 2025",
//       amount: 5000,
//       date: "Jan 15, 2025",
//       status: "Completed",
//       type: "Purchase",
//     },
//     { id: 2, event: "Tech Conference Asia", amount: 5000, date: "Jan 10, 2025", status: "Completed", type: "Purchase" },
//     { id: 3, event: "Food & Wine Expo", amount: 5400, date: "Jan 5, 2025", status: "Completed", type: "Purchase" },
//     { id: 4, event: "Art Gallery Opening", amount: 0, date: "Dec 28, 2024", status: "Refunded", type: "Refund" },
//   ]

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
//       {/* Navigation Header */}
//       <nav className="fixed top-0 w-full z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <div className="text-2xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Eventra
//           </div>

//           <div className="flex items-center gap-6">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 hover:bg-slate-700/30 rounded-lg transition duration-200"
//             >
//               <UserIcon size={20} />
//             </button>
//             <Link
//               href="/login"
//               className="px-4 py-2 text-slate-300 hover:text-white transition flex items-center gap-2 rounded-lg hover:bg-slate-700/30"
//             >
//               <LogOut size={18} />
//               Logout
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="pt-20 flex">
//         {/* Sidebar */}
//         <aside
//           className={`${sidebarOpen ? "w-64" : "w-0"} bg-slate-900/50 border-r border-slate-700/30 transition-all duration-300 overflow-hidden`}
//         >
//           <div className="p-6 space-y-8">
//             {/* User Profile Section */}
//             <div className="text-center">
//               <div className="w-16 h-16 bg-linear-to-br from-blue-400 via-cyan-400 to-purple-400 rounded-full mx-auto mb-3"></div>
//               <h3 className="font-bold text-lg">Anup Bhujel</h3>
//               <p className="text-slate-400 text-sm">mail@example.com</p>
//             </div>

//             {/* Navigation Links */}
//             <nav className="space-y-2">
//               {[
//                 { id: "upcoming", icon: Calendar, label: "Upcoming Events" },
//                 { id: "tickets", icon: Ticket, label: "My Tickets" },
//                 { id: "transactions", icon: CreditCard, label: "Transactions" },
//                 { id: "favorites", icon: Heart, label: "Favorites" },
//                 { id: "settings", icon: Settings, label: "Settings" },
//               ].map(({ id, icon: Icon, label }) => (
//                 <button
//                   key={id}
//                   onClick={() => setActiveTab(id)}
//                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
//                     activeTab === id
//                       ? "bg-linear-to-r from-blue-500/30 to-cyan-500/30 border border-cyan-500/50 text-cyan-300"
//                       : "text-slate-300 hover:bg-slate-700/30"
//                   }`}
//                 >
//                   <Icon size={18} />
//                   <span>{label}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content Area */}
//         <main className={`flex-1 p-8`}>
//           {/* Upcoming Events Tab */}
//           {activeTab === "upcoming" && (
//             <div>
//               <div className="mb-8">
//                 <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
//                   <Calendar size={36} className="text-cyan-400" />
//                   Upcoming Events
//                 </h2>
//                 <p className="text-slate-400">Your reserved tickets for upcoming events</p>
//               </div>

//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {userTickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="group rounded-xl overflow-hidden bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
//                   >
//                     {/* Main Image */}
//                     <div className="relative overflow-hidden h-56 bg-slate-700">
//                       <img
//                         src={ticket.image || "/placeholder.svg"}
//                         alt={ticket.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
//                       />
//                       <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
//                         {ticket.category}
//                       </div>
//                       <div
//                         className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
//                           ticket.status === "Confirmed" ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"
//                         }`}
//                       >
//                         {ticket.status}
//                       </div>
//                     </div>

//                     <div className="p-5">
//                       <h3 className="font-bold text-lg mb-3 line-clamp-2">{ticket.title}</h3>

//                       <div className="space-y-2 mb-4 text-slate-300 text-sm">
//                         <div className="flex items-center gap-2">
//                           <Calendar size={16} className="text-cyan-400 shrink-0" />
//                           <span>{ticket.date}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Clock size={16} className="text-cyan-400 shrink-0" />
//                           <span>{ticket.time}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <MapPin size={16} className="text-cyan-400 shrink-0" />
//                           <span className="line-clamp-1">{ticket.location}</span>
//                         </div>
//                       </div>

//                       <div className="mb-4 pb-4 border-t border-slate-700/50">
//                         <p className="text-xs text-slate-400 mb-2 flex items-center gap-1">
//                           <ImageIcon size={14} />
//                           Event Gallery
//                         </p>
//                         <div className="grid grid-cols-3 gap-2">
//                           {ticket.gallery.map((img, idx) => (
//                             <div key={idx} className="rounded-lg overflow-hidden h-16 cursor-pointer group/img">
//                               <img
//                                 src={img || "/placeholder.svg"}
//                                 alt={`Gallery ${idx + 1}`}
//                                 className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between text-sm mb-4 border-t border-slate-700/50 pt-3">
//                         <span className="text-slate-400">
//                           Qty: <span className="text-cyan-400 font-semibold">{ticket.quantity}</span>
//                         </span>
//                         <span className="text-slate-400">
//                           Rs. <span className="text-cyan-400 font-semibold">{ticket.price}</span>
//                         </span>
//                       </div>

//                       <div className="flex gap-2">
//                         <button className="flex-1 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition duration-200 text-sm flex items-center justify-center gap-2">
//                           <Ticket size={16} />
//                           View Ticket
//                         </button>
//                         <button className="px-3 py-2.5 border border-cyan-500/50 rounded-lg hover:bg-slate-700/50 transition duration-200">
//                           <Share2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* My Tickets Tab */}
//           {activeTab === "tickets" && (
//             <div>
//               <div className="mb-8">
//                 <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
//                   <Ticket size={36} className="text-cyan-400" />
//                   My Tickets
//                 </h2>
//                 <p className="text-slate-400">Download and manage your event tickets</p>
//               </div>

//               <div className="space-y-4">
//                 {userTickets.map((ticket) => (
//                   <div
//                     key={ticket.id}
//                     className="p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition duration-300"
//                   >
//                     <div className="grid md:grid-cols-5 gap-6 mb-6">
//                       {/* Ticket Image */}
//                       <div className="md:col-span-2">
//                         <div className="rounded-lg overflow-hidden h-48 bg-slate-700 mb-3">
//                           <img
//                             src={ticket.image || "/placeholder.svg"}
//                             alt={ticket.title}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                         <div className="grid grid-cols-3 gap-2">
//                           {ticket.gallery.map((img, idx) => (
//                             <div key={idx} className="rounded-lg overflow-hidden h-20 cursor-pointer group/img">
//                               <img
//                                 src={img || "/placeholder.svg"}
//                                 alt={`Gallery ${idx + 1}`}
//                                 className="w-full h-full object-cover group-hover/img:scale-110 transition duration-300"
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Ticket Details */}
//                       <div className="md:col-span-3">
//                         <div className="flex items-start justify-between mb-4">
//                           <div>
//                             <h3 className="font-bold text-xl mb-2">{ticket.title}</h3>
//                             <p className="text-slate-400 text-sm">
//                               Ticket #: <span className="text-cyan-400 font-mono">{ticket.ticketNumber}</span>
//                             </p>
//                           </div>
//                           <span
//                             className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
//                               ticket.status === "Confizrmed"
//                                 ? "bg-emerald-500/20 text-emerald-300"
//                                 : "bg-amber-500/20 text-amber-300"
//                             }`}
//                           >
//                             {ticket.status}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
//                           <div>
//                             <p className="text-slate-400 mb-1">Date</p>
//                             <p className="font-semibold text-cyan-300 flex items-center gap-2">
//                               <Calendar size={16} />
//                               {ticket.date}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-slate-400 mb-1">Time</p>
//                             <p className="font-semibold text-cyan-300 flex items-center gap-2">
//                               <Clock size={16} />
//                               {ticket.time}
//                             </p>
//                           </div>
//                           <div className="col-span-2">
//                             <p className="text-slate-400 mb-1">Location</p>
//                             <p className="font-semibold text-cyan-300 flex items-center gap-2">
//                               <MapPin size={16} />
//                               {ticket.location}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex gap-3">
//                           <button className="flex-1 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition duration-200 text-sm flex items-center justify-center gap-2">
//                             <Download size={16} />
//                             Download PDF
//                           </button>
//                           <button className="flex-1 py-2.5 border border-cyan-500/50 rounded-lg hover:bg-slate-700/50 transition duration-200 text-sm flex items-center justify-center gap-2">
//                             <Share2 size={16} />
//                             Share Ticket
//                           </button>
//                           <button className="px-3 py-2.5 border border-cyan-500/50 rounded-lg hover:bg-slate-700/50 transition duration-200">
//                             <Copy size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Transactions Tab */}
//           {activeTab === "transactions" && (
//             <div>
//               <div className="mb-8">
//                 <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
//                   <CreditCard size={36} className="text-cyan-400" />
//                   Transaction History
//                 </h2>
//                 <p className="text-slate-400">Complete record of your transactions</p>
//               </div>

//               <div className="rounded-xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="border-b border-slate-700/50">
//                       <tr>
//                         <th className="px-6 py-4 text-left text-slate-400 font-semibold">Event</th>
//                         <th className="px-6 py-4 text-left text-slate-400 font-semibold">Type</th>
//                         <th className="px-6 py-4 text-left text-slate-400 font-semibold">Amount</th>
//                         <th className="px-6 py-4 text-left text-slate-400 font-semibold">Date</th>
//                         <th className="px-6 py-4 text-left text-slate-400 font-semibold">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {transactionHistory.map((transaction, idx) => (
//                         <tr
//                           key={transaction.id}
//                           className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition duration-200 ${idx === transactionHistory.length - 1 ? "border-b-0" : ""}`}
//                         >
//                           <td className="px-6 py-4 font-medium">{transaction.event}</td>
//                           <td className="px-6 py-4">
//                             <span
//                               className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                                 transaction.type === "Purchase"
//                                   ? "bg-blue-500/20 text-blue-300"
//                                   : "bg-red-500/20 text-red-300"
//                               }`}
//                             >
//                               {transaction.type}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 font-semibold text-cyan-300">
//                             {transaction.amount > 0 ? `Rs. ${transaction.amount}` : "Free"}
//                           </td>
//                           <td className="px-6 py-4 text-slate-400">{transaction.date}</td>
//                           <td className="px-6 py-4">
//                             <span
//                               className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
//                                 transaction.status === "Completed"
//                                   ? "bg-emerald-500/20 text-emerald-300"
//                                   : "bg-amber-500/20 text-amber-300"
//                               }`}
//                             >
//                               {transaction.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Favorites Tab */}
//           {activeTab === "favorites" && (
//             <div>
//               <div className="mb-8">
//                 <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
//                   <Heart size={36} className="text-cyan-400" />
//                   Favorite Events
//                 </h2>
//               </div>
//               <div className="p-12 text-center bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl">
//                 <Heart size={56} className="mx-auto mb-4 text-slate-600" />
//                 <p className="text-slate-400 mb-6">No favorite events yet. Start adding events to your favorites!</p>
//                 <Link
//                   href="/"
//                   className="inline-block px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition duration-200 items-center gap-2"
//                 >
//                   Browse Events
//                   <ChevronRight size={16} />
//                 </Link>
//               </div>
//             </div>
//           )}

//           {/* Settings Tab */}
//           {activeTab === "settings" && (
//             <div>
//               <div className="mb-8">
//                 <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
//                   <Settings size={36} className="text-cyan-400" />
//                   Settings
//                 </h2>
//               </div>

//               <div className="max-w-2xl space-y-6">
//                 {/* Profile Settings */}
//                 <div className="p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl">
//                   <h3 className="text-xl font-bold mb-6">Profile Information</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-slate-400 text-sm mb-2 font-medium">Full Name</label>
//                       <input
//                         type="text"
//                         placeholder="Your name"
//                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/70 transition duration-200"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-slate-400 text-sm mb-2 font-medium">Email</label>
//                       <input
//                         type="email"
//                         placeholder="john@example.com"
//                         className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/70 transition duration-200"
//                       />
//                     </div>
//                     <button className="w-full py-3 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500 transition duration-200">
//                       Save Changes
//                     </button>
//                   </div>
//                 </div>

//                 {/* Notifications */}
//                 <div className="p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl">
//                   <h3 className="text-xl font-bold mb-6">Notifications</h3>
//                   <div className="space-y-4">
//                     {[
//                       "Email notifications for event reminders",
//                       "Notifications for new events in my interests",
//                       "Marketing emails and promotions",
//                     ].map((label, idx) => (
//                       <label key={idx} className="flex items-center gap-3 cursor-pointer group">
//                         <input
//                           type="checkbox"
//                           className="w-5 h-5 rounded border border-slate-600 bg-slate-700/50 cursor-pointer accent-cyan-500"
//                           defaultChecked={idx < 2}
//                         />
//                         <span className="text-slate-300 group-hover:text-white transition">{label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }

import React from 'react'

export default function userDashboard() {
  return (
    <div>
      User Dashboard    </div>
  )
}

