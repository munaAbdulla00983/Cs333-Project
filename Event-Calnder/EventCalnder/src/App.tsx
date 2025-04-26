import React from 'react';
import { Calendar } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-teal-600 text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Events Calendar</h1>
            </div>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <a href="/events.html" className="hover:text-teal-200 transition">Events</a>
                </li>
                <li>
                  <a href="/create-event.html" className="hover:text-teal-200 transition">Create Event</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Event */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-teal-600 mb-4">Featured Event</h2>
              <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                <img 
                  src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg" 
                  alt="Tech Conference" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tech Conference 2025</h3>
              <p className="text-gray-600 mb-4">
                Join us for the biggest tech event of the year, featuring industry leaders,
                workshops, and cutting-edge innovations.
              </p>
              <a 
                href="/event-details.html?id=1" 
                className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                View Details
              </a>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-teal-600 mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold">Spring Campus Festival</h3>
                  <p className="text-sm text-gray-600">April 10, 2025</p>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold">Research Symposium</h3>
                  <p className="text-sm text-gray-600">June 20, 2025</p>
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold">Leadership Workshop</h3>
                  <p className="text-sm text-gray-600">March 25, 2025</p>
                </div>
              </div>
              <a 
                href="/events.html" 
                className="inline-block w-full text-center bg-gray-100 text-teal-600 px-4 py-2 rounded hover:bg-gray-200 transition mt-4"
              >
                View All Events
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;