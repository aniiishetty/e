import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/list.css';

interface College {
  id: number;
  name: string;
}

interface Registration {
  id: number;
  name: string;
  designation: string;
  college?: College | null;
  phone: string;
  email: string;
  reason: string;
  photoUrl: string; // This will be a Base64 data URL from the backend
}

const List: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get<Registration[]>('/api/registrations'); // Replace with your API endpoint
        console.log(response.data); // Log the data to verify
        setRegistrations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setError('Failed to load registrations');
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredRegistrations = registrations.filter(registration =>
    registration.name.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
          className="search-bar"
        />
        <button onClick={() => setViewType('grid')} className={viewType === 'grid' ? 'active' : ''}>Grid View</button>
        <button onClick={() => setViewType('list')} className={viewType === 'list' ? 'active' : ''}>List View</button>
      </div>

      {viewType === 'grid' ? (
        <div className={`registration-list grid`}>
          {filteredRegistrations.map((registration) => (
            <div className="registration-card" key={registration.id}>
              {registration.photoUrl ? (
                <img
                  src={registration.photoUrl}
                  alt={`${registration.name}'s photo`}
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => {
                    console.error('Image failed to load', e);
                    (e.target as HTMLImageElement).src = 'path/to/placeholder-image.png'; // Placeholder image
                  }}
                />
              ) : (
                <div>No image available</div>
              )}
              <h2>{registration.name}</h2>
              <p><strong>Designation:</strong> {registration.designation}</p>
              <p><strong>College:</strong> {registration.college ? registration.college.name : 'N/A'}</p>
              <p><strong>Email:</strong> {registration.email}</p>
              <p><strong>Phone:</strong> {registration.phone}</p>
              <p><strong>Reason:</strong> {registration.reason}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="registration-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>College Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Event ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((registration) => (
              <tr key={registration.id}>
                <td>
                  {registration.photoUrl ? (
                    <img
                      src={registration.photoUrl}
                      alt={`${registration.name}'s photo`}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        console.error('Image failed to load', e);
                        (e.target as HTMLImageElement).src = 'path/to/placeholder-image.png'; // Placeholder image
                      }}
                    />
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{registration.name}</td>
                <td>{registration.college ? registration.college.name : 'N/A'}</td>
                <td>{registration.email}</td>
                <td>{registration.phone}</td>
                <td>{registration.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default List;
