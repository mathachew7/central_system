import React from 'react';

const Livestream: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Livestream</h1>
        <p className="page-description">
          Live broadcasts and recorded sessions from government proceedings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🔴 LIVE: Parliament Session</h3>
            <p className="card-description">Currently Broadcasting</p>
          </div>
          <div className="card-content">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">▶️</span>
                </div>
                <p className="text-lg font-semibold">Live Stream Active</p>
                <p className="text-sm opacity-75">Parliament Session - December 15, 2024</p>
              </div>
            </div>
            <p>Watch the live proceedings of the current parliamentary session discussing the national budget.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Sessions</h3>
            <p className="card-description">Archived Broadcasts</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🎥</span>
                <div>
                  <p className="font-medium">Cabinet Meeting - Dec 12</p>
                  <p className="text-sm text-gray-600">2 hours 15 minutes</p>
                </div>
                <button className="btn btn-secondary ml-auto">Watch</button>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🎥</span>
                <div>
                  <p className="font-medium">Press Conference - Dec 10</p>
                  <p className="text-sm text-gray-600">45 minutes</p>
                </div>
                <button className="btn btn-secondary ml-auto">Watch</button>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">🎥</span>
                <div>
                  <p className="font-medium">Policy Announcement - Dec 8</p>
                  <p className="text-sm text-gray-600">1 hour 30 minutes</p>
                </div>
                <button className="btn btn-secondary ml-auto">Watch</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Livestream;