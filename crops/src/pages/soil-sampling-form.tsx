import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { MapPin } from "lucide-react"; // Import map icon (if you want to use it)

export function SoilSamplingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
    soilType: "",
    location: "",
  });

  const [useLocation, setUseLocation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("https://crop-prediction-645c.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features: [
            parseFloat(formData.nitrogen),
            parseFloat(formData.phosphorus),
            parseFloat(formData.potassium),
            parseFloat(formData.temperature),
            parseFloat(formData.humidity),
            parseFloat(formData.ph),
            parseFloat(formData.rainfall),
          ],
          soilType: formData.soilType,
          location: formData.location,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend error:", errorData);
        throw new Error("Failed to fetch prediction from the server.");
      }

      const data = await response.json();
      toast.success(`Recommended Crop: ${data.prediction}`);

      navigate("/results", {
        state: {
          ph: formData.ph,
          moisture: formData.humidity,
          texture: formData.soilType,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get prediction. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchLocationData = async () => {
    try {
      // Replace YOUR_API_KEY with your actual API key for weatherapi.com or similar
      const response = await fetch("https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=auto:ip");
      if (!response.ok) {
        throw new Error("Failed to fetch location data.");
      }
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        temperature: data.current.temp_c.toString(),
        humidity: data.current.humidity.toString(),
        rainfall: data.current.precip_mm.toString(),
      }));
      toast.success("Location data fetched successfully!");
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast.error("Failed to fetch location data. Please try again.");
    }
  };

  return (
    <div className="container py-12 flex justify-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Soil Sampling Form</h1>
        <Card className="p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nitrogen">Nitrogen (N) (0.00 - 200.00)</Label>
              <Input
                id="nitrogen"
                name="nitrogen"
                type="number"
                min="0"
                max="200"
                step="0.01"
                value={formData.nitrogen}
                onChange={handleInputChange}
                placeholder="Enter Nitrogen value"
                required
              />
            </div>
            <div>
              <Label htmlFor="phosphorus">Phosphorus (P) (0.00 - 100.00)</Label>
              <Input
                id="phosphorus"
                name="phosphorus"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.phosphorus}
                onChange={handleInputChange}
                placeholder="Enter Phosphorus value"
                required
              />
            </div>
            <div>
              <Label htmlFor="potassium">Potassium (K) (0.00 - 200.00)</Label>
              <Input
                id="potassium"
                name="potassium"
                type="number"
                min="0"
                max="200"
                step="0.01"
                value={formData.potassium}
                onChange={handleInputChange}
                placeholder="Enter Potassium value"
                required
              />
            </div>
            <div>
              <Label htmlFor="ph">pH Level (0.00 - 14.00)</Label>
              <Input
                id="ph"
                name="ph"
                type="number"
                min="0"
                max="14"
                step="0.01"
                value={formData.ph}
                onChange={handleInputChange}
                placeholder="Enter pH value"
                required
              />
            </div>
            <div>
              <Label>Temperature, Humidity, and Rainfall</Label>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  type="button"
                  variant={useLocation ? "default" : "outline"}
                  className={useLocation ? "bg-blue-500 text-white" : ""}
                  onClick={() => {
                    setUseLocation(true);
                    fetchLocationData();
                  }}
                >
                  Use Location
                </Button>
                <Button
                  type="button"
                  variant={!useLocation ? "default" : "outline"}
                  className={!useLocation ? "bg-blue-500 text-white" : ""}
                  onClick={() => setUseLocation(false)}
                >
                  Enter Manually
                </Button>
              </div>
            </div>
            {!useLocation && (
              <>
                <div>
                  <Label htmlFor="temperature">Temperature (°C) (0.00 - 50.00)</Label>
                  <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    min="0"
                    max="50"
                    step="0.01"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Enter Temperature value"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="humidity">Humidity (%) (0.00 - 100.00)</Label>
                  <Input
                    id="humidity"
                    name="humidity"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    placeholder="Enter Humidity value"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rainfall">Rainfall (mm/year) (0.00 - 500.00)</Label>
                  <Input
                    id="rainfall"
                    name="rainfall"
                    type="number"
                    min="0"
                    max="500"
                    step="0.01"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    placeholder="Enter Rainfall value"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="soilType">Soil Type</Label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-white text-gray-700"
                required
              >
                <option value="" disabled>
                  Select Soil Type
                </option>
                <option value="sandy">Sandy</option>
                <option value="clay">Clay</option>
                <option value="silt">Silt</option>
                <option value="peat">Peat</option>
                <option value="chalk">Chalk</option>
                <option value="loam">Loam</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Submit Sample
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}