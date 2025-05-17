import React from 'react';
import { Bookmark, Heart, MessageCircle, PlayCircle } from 'lucide-react';

export default function PostCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="bg-gray-300 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">AC</div>
        <div className="ml-3">
          <div className="font-semibold">Alumni Connect</div>
          <div className="text-sm text-blue-500">Developer at AlumniConnect</div>
        </div>
      </div>
      <p className="text-sm mb-2">hello this is 1st sample post for testing / demo</p>
      <div className="bg-gray-300 h-20 rounded-xl mb-3" />
      <div className="flex justify-between text-gray-500">
        <Heart className="cursor-pointer" />
        <MessageCircle className="cursor-pointer" />
        <PlayCircle className="cursor-pointer" />
        <Bookmark className="cursor-pointer" />
      </div>
    </div>
  );
}
