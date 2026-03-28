import React from 'react';

const Gallery: React.FC = () => {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gallery</h1>
        <p className="page-description">
          Official photos and images from government events and activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Cabinet Meeting</h3>
            <p className="card-description">December 14, 2024</p>
          </div>
          <div className="card-content">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">📷 Official Photo</span>
            </div>
            <p>Weekly cabinet meeting discussing national priorities and policy initiatives.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Infrastructure Launch</h3>
            <p className="card-description">December 10, 2024</p>
          </div>
          <div className="card-content">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">📷 Event Photo</span>
            </div>
            <p>Ceremonial launch of the new transportation infrastructure project.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Diplomatic Visit</h3>
            <p className="card-description">December 8, 2024</p>
          </div>
          <div className="card-content">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-gray-500">📷 State Visit</span>
            </div>
            <p>Official welcoming ceremony for visiting international dignitaries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;