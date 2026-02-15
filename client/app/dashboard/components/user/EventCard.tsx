import React from "react";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  onView: () => void;
  onJoin?: () => void;
}

export default function EventCard({
  title,
  description,
  date,
  location,
  image,
  onView,
  onJoin,
}: EventCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-[#111113] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full border border-white/5 hover:border-purple-500/30 transition-all group"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#111113] via-transparent to-transparent opacity-60" />
        <div className="absolute top-4 right-4">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 relative">
        <h3 className="text-white font-bold text-xl mb-2 group-hover:text-purple-400 transition-colors leading-tight">{title}</h3>
        <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-light">
          {description}
        </p>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center text-gray-400 text-xs font-medium">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-purple-500" />
            </div>
            <span>{date}</span>
          </div>
          <div className="flex items-center text-gray-400 text-xs font-medium">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3">
              <MapPin className="w-4 h-4 text-purple-500" />
            </div>
            <span>{location}</span>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onView}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
          >
            Details
          </button>
          {onJoin && (
            <button
              onClick={onJoin}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              Get Ticket
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
