import React from "react";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

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
    <div className="bg-[#1C1C24] rounded-2xl overflow-hidden min-w-[300px] w-full max-w-[350px] shadow-lg flex flex-col h-full border border-gray-800">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-400 text-xs mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-auto space-y-2">
            <div className="flex items-center text-gray-400 text-xs">
            <Calendar className="w-3 h-3 mr-2" />
            <span>{date}</span>
            </div>
            <div className="flex items-center text-gray-400 text-xs">
            <MapPin className="w-3 h-3 mr-2" />
            <span>{location}</span>
            </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onView}
            className="flex-1 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white py-2 rounded-full text-sm font-medium transition-colors"
          >
            View
          </button>
          {onJoin && (
            <button
              onClick={onJoin}
              className="flex-1 bg-white hover:bg-gray-100 text-black py-2 rounded-full text-sm font-medium transition-colors"
            >
              Join
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
