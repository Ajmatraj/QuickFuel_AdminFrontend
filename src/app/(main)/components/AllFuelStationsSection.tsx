import React, { useEffect, useState } from 'react';

interface FuelType {
  _id: string;
  fuelType: {
    name: string;
  };
  price: number;
  quantity: number;
}

interface FuelStation {
  _id: string;
  imageurl: string;
  name: string;
  stock: string;
  email: string;
  phone: string;
  location: string;
  fuelTypes: FuelType[];
}

const AllFuelStationsSection = () => {
  const [fuelStations, setFuelStations] = useState<FuelStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFuelStations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/fuelstations/getAllFuelStations');
        const data = await response.json();

        console.log(data)

        if (data.success && data.fuelStations) {
          setFuelStations(data.fuelStations); // Adjust based on your API response structure
        } else {
          setError('No fuel stations found or error in the data.');
          console.error('Error fetching fuel stations: ', data.message || 'Unknown error');
        }
      } catch (error) {
        setError('Error fetching fuel stations. Please try again later.');
        console.error('Error fetching fuel stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuelStations();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Fuel Stations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show the error message if any
      ) : fuelStations.length === 0 ? (
        <p>No fuel stations available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fuelStations.map((station) => (
            <div key={station._id} className="border p-4 rounded shadow">
              <img src={station.imageurl} alt={station.name} className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="font-semibold text-lg">{station.name}</h3>
              <p><strong>Stock:</strong> {station.stock}</p>
              <p><strong>Email:</strong> {station.email}</p>
              <p><strong>Phone:</strong> {station.phone}</p>
              <p><strong>Location:</strong> <a href={station.location} target="_blank" rel="noopener noreferrer" className="text-blue-500">View on Map</a></p>
              <div className="mt-4">
                <h4 className="font-semibold">Fuel Types:</h4>
                {station.fuelTypes.map((fuel) => (
                  <p key={fuel._id}>
                    <strong>{fuel.fuelType.name}</strong> - Price: {fuel.price} | Quantity: {fuel.quantity}L
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFuelStationsSection;
