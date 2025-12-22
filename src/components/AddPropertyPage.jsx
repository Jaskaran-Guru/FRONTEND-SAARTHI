import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, trackInteraction } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Hardcoded API URL
  const API_BASE_URL = 'https://backend-saarthi.onrender.com/api';

  const [propertyData, setPropertyData] = useState({
    title: "", description: "", propertyType: "", listingType: "sale",
    address: "", city: "", state: "", pincode: "", locality: "",
    bedrooms: "", bathrooms: "", balconies: "", area: "", areaUnit: "sqft",
    furnished: "unfurnished", facing: "", floor: "", totalFloors: "",
    price: "", pricePerSqft: "", priceNegotiable: false, maintenanceCharges: "",
    amenities: [], yearBuilt: "", possession: "ready", parkingSpaces: "",
    ownerName: user?.name || "", ownerPhone: "", ownerEmail: user?.email || "",
    images: [],
  });

  const amenitiesList = ["Swimming Pool", "Gym", "Parking", "Garden", "Security Guard", "Lift", "Power Backup", "Club House", "Children Play Area", "CCTV", "Intercom", "Maintenance Staff", "Fire Safety", "Water Supply", "Park", "Shopping Center"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // UPDATED: Convert Images to Base64 to send to backend
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    const base64Promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(base64Promises);

    setPropertyData((prev) => ({
      ...prev,
      
      images: [...prev.images, ...base64Images].slice(0, 4), 
    }));
  };

  const removeImage = (index) => {
    setPropertyData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => { if (currentStep < 5) setCurrentStep((prev) => prev + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((prev) => prev - 1); };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      console.log("📤 Sending Property Data...");
      
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      });

      const data = await response.json();

      if (data.success) {
        if(trackInteraction) trackInteraction("property_listed", { type: propertyData.propertyType });
        alert("✅ Property listed successfully!");
        navigate("/listing");
      } else {
        alert("❌ Failed: " + (data.error || "Unknown error"));
      }

    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Error submitting property. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Property Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
              <input type="text" name="title" value={propertyData.title} onChange={handleInputChange} required className="form-input" placeholder="e.g., Luxury 3BHK Apartment" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                <select name="propertyType" value={propertyData.propertyType} onChange={handleInputChange} required className="form-input">
                  <option value="">Select</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type *</label>
                <select name="listingType" value={propertyData.listingType} onChange={handleInputChange} required className="form-input">
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea name="description" value={propertyData.description} onChange={handleInputChange} required rows="5" className="form-input resize-none"></textarea>
            </div>
          </div>
        );
      case 2: return (<div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900 mb-6">Location</h2><div><label className="block text-sm font-medium">Address *</label><textarea name="address" value={propertyData.address} onChange={handleInputChange} required className="form-input"></textarea></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">City *</label><select name="city" value={propertyData.city} onChange={handleInputChange} required className="form-input"><option value="">Select</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className="block text-sm font-medium">State *</label><input type="text" name="state" value={propertyData.state} onChange={handleInputChange} required className="form-input" /></div></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Pincode *</label><input type="text" name="pincode" value={propertyData.pincode} onChange={handleInputChange} required className="form-input" /></div><div><label className="block text-sm font-medium">Locality *</label><input type="text" name="locality" value={propertyData.locality} onChange={handleInputChange} required className="form-input" /></div></div></div>);
      case 3: return (<div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900 mb-6">Specs</h2><div className="grid md:grid-cols-3 gap-4"><div><label className="block text-sm font-medium">Bedrooms</label><select name="bedrooms" value={propertyData.bedrooms} onChange={handleInputChange} required className="form-input"><option value="">Select</option><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></div><div><label className="block text-sm font-medium">Bathrooms</label><select name="bathrooms" value={propertyData.bathrooms} onChange={handleInputChange} required className="form-input"><option value="">Select</option><option value="1">1</option><option value="2">2</option></select></div><div><label className="block text-sm font-medium">Balconies</label><select name="balconies" value={propertyData.balconies} onChange={handleInputChange} className="form-input"><option value="0">0</option><option value="1">1</option></select></div></div><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Area</label><input type="number" name="area" value={propertyData.area} onChange={handleInputChange} required className="form-input" /></div><div><label className="block text-sm font-medium">Furnishing</label><select name="furnished" value={propertyData.furnished} onChange={handleInputChange} required className="form-input"><option value="unfurnished">Unfurnished</option><option value="furnished">Furnished</option></select></div></div></div>);
      case 4: return (<div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing</h2><div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium">Price (₹) *</label><input type="number" name="price" value={propertyData.price} onChange={handleInputChange} required className="form-input" /></div><div><label className="block text-sm font-medium">Maintenance</label><input type="number" name="maintenanceCharges" value={propertyData.maintenanceCharges} onChange={handleInputChange} className="form-input" /></div></div><div className="mt-4"><label className="block text-sm font-medium mb-2">Amenities</label><div className="grid grid-cols-2 gap-2">{amenitiesList.map(a => (<label key={a} className="flex items-center space-x-2"><input type="checkbox" checked={propertyData.amenities.includes(a)} onChange={() => handleAmenityToggle(a)} /><span>{a}</span></label>))}</div></div></div>);
      case 5: return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Images & Contact</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <span className="text-4xl">📸</span>
                    <span>Click to upload (Max 4)</span>
                </label>
            </div>
            {propertyData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                    {propertyData.images.map((img, i) => (
                        <div key={i} className="relative">
                            <img src={img} alt="preview" className="w-full h-20 object-cover rounded" />
                            <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">×</button>
                        </div>
                    ))}
                </div>
            )}
             <div className="border-t pt-6">
                 <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                     <input type="text" name="ownerName" value={propertyData.ownerName} onChange={handleInputChange} placeholder="Name" required className="form-input" />
                     <input type="text" name="ownerPhone" value={propertyData.ownerPhone} onChange={handleInputChange} placeholder="Phone" required className="form-input" />
                     <input type="email" name="ownerEmail" value={propertyData.ownerEmail} onChange={handleInputChange} placeholder="Email" required className="form-input" />
                 </div>
             </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white py-4 px-8 border-b"><div className="container mx-auto flex justify-between"><Link to="/" className="font-bold text-xl">Saarthi</Link></div></nav>
      <div className="container mx-auto px-8 py-8"><div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8"><form onSubmit={handleSubmit}>{renderStepContent()}<div className="flex justify-between mt-8"><button type="button" onClick={prevStep} disabled={currentStep===1} className="btn-secondary">Back</button>{currentStep===5 ? <button type="submit" disabled={loading} className="btn-primary">{loading ? "Saving..." : "Submit Property"}</button> : <button type="button" onClick={nextStep} className="btn-primary">Next</button>}</div></form></div></div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default AddPropertyPage;
