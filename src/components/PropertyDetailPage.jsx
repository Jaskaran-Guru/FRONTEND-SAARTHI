import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import FavoriteButton from './FavoriteButton';
import EMICalculator from './EMICalculator';
import LoginModal from './LoginModal';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, trackInteraction } = useAuth();
  const { isFavorite } = useFavorites();
  
  const [property, setProperty] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEMI, setShowEMI] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactFormData, setContactFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    interestedIn: 'site-visit'
  });

  // Complete Enhanced property data with all properties
  const allProperties = [
    {
      id: 1,
      title: "Sea View Luxury Apartment",
      price: 25000000,
      location: "Mumbai",
      address: "Bandra West, Mumbai, Maharashtra 400050",
      bedrooms: 3,
      bathrooms: 3,
      garages: 2,
      area: 1200,
      propertyType: "apartment",
      possession: "ready",
      furnishing: "furnished",
      amenities: ["Swimming Pool", "Gym", "Security Guard", "Lift", "Parking", "Garden", "Club House", "CCTV", "Intercom"],
      images: [
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Experience luxury living at its finest in this stunning 3BHK apartment with breathtaking sea views. Located in the heart of Bandra West, this premium property offers the perfect blend of comfort, style, and convenience. The apartment features spacious rooms, modern amenities, and panoramic views of the Arabian Sea.",
      features: [
        "Sea-facing balconies in all rooms",
        "Premium marble flooring",
        "Modular kitchen with branded appliances",
        "Central air conditioning",
        "24/7 security with CCTV surveillance",
        "High-speed elevators",
        "Vastu-compliant design"
      ],
      nearby: [
        { name: "Bandra Station", distance: "2 km", type: "Transport" },
        { name: "Linking Road", distance: "1.5 km", type: "Shopping" },
        { name: "Lilavati Hospital", distance: "3 km", type: "Healthcare" },
        { name: "St. Andrews School", distance: "1 km", type: "Education" }
      ],
      yearBuilt: 2020,
      developer: "Lodha Group",
      rera: "P51700018657",
      agent: {
        name: "Priya Sharma",
        phone: "+91 98765 43210",
        email: "priya.sharma@saarthi.com",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b0b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      }
    },
    {
      id: 2,
      title: "Modern Villa in DLF City",
      price: 32000000,
      location: "Gurgaon",
      address: "DLF Phase 2, Gurgaon, Haryana 122002",
      bedrooms: 4,
      bathrooms: 4,
      garages: 3,
      area: 2500,
      propertyType: "villa",
      possession: "ready",
      furnishing: "semi-furnished",
      amenities: ["Garden", "Security Guard", "Parking", "Power Backup", "Club House", "Swimming Pool"],
      images: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Spacious 4BHK independent villa with private garden in DLF Phase 2, perfect for families seeking luxury and comfort in Gurgaon's premium location.",
      features: [
        "Private garden and lawn",
        "Independent parking for 3 cars",
        "Modern architecture with high ceilings",
        "Semi-furnished with premium fittings",
        "Power backup for entire house",
        "Separate servant quarters"
      ],
      nearby: [
        { name: "DLF Mega Mall", distance: "1 km", type: "Shopping" },
        { name: "Cyber Hub", distance: "5 km", type: "Business" },
        { name: "Medanta Hospital", distance: "3 km", type: "Healthcare" }
      ],
      yearBuilt: 2019,
      developer: "DLF Limited",
      rera: "GGM/298/2019/15",
      agent: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43211",
        email: "rajesh.kumar@saarthi.com",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      }
    },
    {
      id: 3,
      title: "Tech Hub Premium Apartment",
      price: 18000000,
      location: "Bangalore",
      address: "Electronic City, Bangalore, Karnataka 560100",
      bedrooms: 3,
      bathrooms: 2,
      garages: 2,
      area: 1400,
      propertyType: "apartment",
      possession: "under-construction",
      furnishing: "unfurnished",
      amenities: ["Gym", "Swimming Pool", "CCTV", "Lift", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Modern 3BHK apartment near Electronic City, perfect for IT professionals with world-class amenities...",
      features: [
        "IT hub proximity",
        "Modern amenities",
        "High-speed internet ready",
        "Premium construction quality"
      ],
      nearby: [
        { name: "Electronic City", distance: "2 km", type: "Business" },
        { name: "FORUM Mall", distance: "3 km", type: "Shopping" }
      ],
      yearBuilt: 2024,
      developer: "Prestige Group",
      rera: "PRM/KA/RERA/1251/310/PR/050420/003152",
      agent: {
        name: "Suresh Nair",
        phone: "+91 98765 43212",
        email: "suresh.nair@saarthi.com",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
      }
    },

    {
  id: 4,
  title: "Heritage Bungalow in Koregaon Park",
  price: 45000000,
  location: "Pune",
  address: "Koregaon Park, Pune, Maharashtra 411001",
  bedrooms: 5,
  bathrooms: 5,
  garages: 4,
  area: 3500,
  propertyType: "bungalow",
  possession: "ready",
  furnishing: "furnished",
  amenities: ["Private Pool", "Garden", "Security Guard", "Parking", "Power Backup", "Home Theater", "Wine Cellar"],
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  description: "Exquisite 5BHK heritage bungalow with colonial architecture in Pune's most prestigious neighborhood, featuring private pool and landscaped gardens.",
  features: [
    "Colonial architecture with modern amenities",
    "Private swimming pool and gazebo",
    "Landscaped garden with fountain",
    "Home theater and wine cellar",
    "Servant quarters and driver room",
    "High-end modular kitchen"
  ],
  nearby: [
    { name: "Phoenix Market City", distance: "3 km", type: "Shopping" },
    { name: "Aga Khan Palace", distance: "2 km", type: "Heritage" },
    { name: "Ruby Hall Clinic", distance: "1.5 km", type: "Healthcare" },
    { name: "The Bishop's School", distance: "2.5 km", type: "Education" }
  ],
  yearBuilt: 2018,
  developer: "Kumar Properties",
  rera: "P52100018234",
  agent: {
    name: "Meera Deshmukh",
    phone: "+91 98765 43213",
    email: "meera.deshmukh@saarthi.com",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
},
{
  id: 5,
  title: "Riverside Penthouse",
  price: 55000000,
  location: "Ahmedabad",
  address: "Sabarmati Riverfront, Ahmedabad, Gujarat 380005",
  bedrooms: 4,
  bathrooms: 5,
  garages: 3,
  area: 3200,
  propertyType: "penthouse",
  possession: "ready",
  furnishing: "furnished",
  amenities: ["Private Terrace", "Jacuzzi", "Gym", "Swimming Pool", "Lift", "Security", "CCTV", "Smart Home"],
  images: [
    "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  description: "Ultra-luxury 4BHK duplex penthouse with stunning Sabarmati River views, private terrace, and state-of-the-art smart home automation.",
  features: [
    "360-degree river and city views",
    "Private terrace with outdoor jacuzzi",
    "Full home automation system",
    "Italian marble flooring",
    "Designer modular kitchen",
    "Master bedroom with walk-in closet"
  ],
  nearby: [
    { name: "Riverfront Promenade", distance: "0.5 km", type: "Recreation" },
    { name: "Manek Chowk", distance: "4 km", type: "Shopping" },
    { name: "Sterling Hospital", distance: "2 km", type: "Healthcare" },
    { name: "Nirma University", distance: "8 km", type: "Education" }
  ],
  yearBuilt: 2021,
  developer: "Adani Realty",
  rera: "PR/GJ/AHMEDABAD/AHMEDABAD/RERA/10/01/2020/4357",
  agent: {
    name: "Vikram Patel",
    phone: "+91 98765 43214",
    email: "vikram.patel@saarthi.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
},
{
  id: 6,
  title: "Smart Home in Noida Extension",
  price: 12500000,
  location: "Noida",
  address: "Greater Noida West, Noida, Uttar Pradesh 201306",
  bedrooms: 3,
  bathrooms: 3,
  garages: 2,
  area: 1650,
  propertyType: "apartment",
  possession: "ready",
  furnishing: "semi-furnished",
  amenities: ["Club House", "Gym", "Swimming Pool", "Kids Play Area", "Parking", "Security", "CCTV", "Power Backup"],
  images: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  description: "Contemporary 3BHK smart apartment in rapidly developing Greater Noida West with excellent connectivity to Delhi-NCR and modern amenities.",
  features: [
    "Smart home pre-wiring",
    "Earthquake-resistant structure",
    "Vitrified tile flooring",
    "Premium bathroom fittings",
    "Piped gas connection",
    "Video door phone"
  ],
  nearby: [
    { name: "Knowledge Park Metro", distance: "3 km", type: "Transport" },
    { name: "Grand Venice Mall", distance: "2 km", type: "Shopping" },
    { name: "Yatharth Hospital", distance: "4 km", type: "Healthcare" },
    { name: "Shiv Nadar University", distance: "6 km", type: "Education" }
  ],
  yearBuilt: 2022,
  developer: "Gaur Group",
  rera: "UPRERAPRJ15690",
  agent: {
    name: "Anjali Singh",
    phone: "+91 98765 43215",
    email: "anjali.singh@saarthi.com",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
},
{
  id: 7,
  title: "Lake View Farmhouse",
  price: 38000000,
  location: "Hyderabad",
  address: "Shamirpet, Hyderabad, Telangana 500078",
  bedrooms: 4,
  bathrooms: 4,
  garages: 4,
  area: 5000,
  propertyType: "farmhouse",
  possession: "ready",
  furnishing: "semi-furnished",
  amenities: ["Private Lake", "Garden", "Security", "Parking", "Power Backup", "Bore Well", "Fruit Orchard"],
  images: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  description: "Serene 4BHK farmhouse with private lake frontage, sprawling gardens, and fruit orchards—perfect weekend getaway near Hyderabad.",
  features: [
    "5-acre plot with private lake",
    "Mango and coconut orchards",
    "Independent borewell",
    "Covered sit-out areas",
    "Caretaker room",
    "Solar panels for water heating"
  ],
  nearby: [
    { name: "Shamirpet Lake", distance: "1 km", type: "Recreation" },
    { name: "Wonderla", distance: "5 km", type: "Entertainment" },
    { name: "Medchal", distance: "10 km", type: "Town" }
  ],
  yearBuilt: 2017,
  developer: "Independent Owner",
  rera: "N/A (Individual Property)",
  agent: {
    name: "Ramesh Reddy",
    phone: "+91 98765 43216",
    email: "ramesh.reddy@saarthi.com",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
},
{
  id: 8,
  title: "Compact Studio Near Metro",
  price: 4500000,
  location: "Jaipur",
  address: "Vaishali Nagar, Jaipur, Rajasthan 302021",
  bedrooms: 1,
  bathrooms: 1,
  garages: 1,
  area: 450,
  propertyType: "studio",
  possession: "ready",
  furnishing: "furnished",
  amenities: ["Lift", "Security", "CCTV", "Parking", "Power Backup"],
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  description: "Affordable 1RK studio apartment with modern fittings near Jaipur Metro station—ideal for young professionals and students.",
  features: [
    "Metro connectivity (500m)",
    "Fully furnished with AC",
    "Compact modular kitchen",
    "Affordable maintenance",
    "Investor-friendly rental yield",
    "Gated community"
  ],
  nearby: [
    { name: "Vaishali Nagar Metro", distance: "0.5 km", type: "Transport" },
    { name: "World Trade Park", distance: "4 km", type: "Shopping" },
    { name: "SMS Hospital", distance: "6 km", type: "Healthcare" },
    { name: "Manipal University", distance: "3 km", type: "Education" }
  ],
  yearBuilt: 2023,
  developer: "Ansal API",
  rera: "RAJ/P/2023/1234",
  agent: {
    name: "Kavita Rathore",
    phone: "+91 98765 43217",
    email: "kavita.rathore@saarthi.com",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
}
  ];

  useEffect(() => {
    const foundProperty = allProperties.find(p => p.id === parseInt(id));
    if (foundProperty) {
      setProperty(foundProperty);
      if (isAuthenticated && trackInteraction) {
        trackInteraction('property_view', {
          propertyId: foundProperty.id,
          propertyTitle: foundProperty.title,
          propertyPrice: foundProperty.price
        });
      }
    }
    setLoading(false);
  }, [id, isAuthenticated, trackInteraction]);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(0)} Lakh`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowContactForm(true);
    if (trackInteraction) {
      trackInteraction('contact_agent_click', {
        propertyId: property.id,
        agentName: property.agent.name
      });
    }
  };

  

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your interest! The agent will contact you within 24 hours.');
    setShowContactForm(false);
    if (trackInteraction) {
      trackInteraction('contact_form_submit', {
        propertyId: property.id,
        interestedIn: contactFormData.interestedIn
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this amazing property: ${property.title} in ${property.location}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/listing" className="btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white py-4 px-8 border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              title="Go Back"
            >
              ← Back
            </button>
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Saarthi</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
              title="Share Property"
            >
              📤 Share
            </button>
            
            <FavoriteButton propertyId={property.id} />
            
            <button
              onClick={() => setShowEMI(true)}
              className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-semibold"
            >
              💰 EMI Calculator
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition"
                >
                  <span className="text-white font-bold">
                    {getUserInitial()}
                  </span>
                </button>
                
                {showUserMenu && (
                  <>
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border py-2 w-48 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link 
                        to="/favorites" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        ❤️ My Favorites
                      </Link>
                      
                      <Link 
                        to="/add-property" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        🏠 Add Property
                      </Link>
                      
                      <hr className="my-2" />
                      
                      <button 
                        onClick={() => {
                          // Add logout functionality here
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                    
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-primary"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Image Navigation */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? property.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === property.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition"
                    >
                      →
                    </button>
                  </>
                )}
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition flex-shrink-0 ${
                        index === currentImageIndex ? 'ring-2 ring-primary-500' : 'hover:opacity-75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    📍 {property.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{Math.round(property.price / property.area).toLocaleString()}/sq ft
                  </div>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.area}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.garages}</div>
                  <div className="text-sm text-gray-600">Parking</div>
                </div>
              </div>

              {/* Property Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold capitalize">{property.propertyType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold capitalize">{property.possession}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Furnishing:</span>
                  <span className="font-semibold capitalize">{property.furnishing}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Built:</span>
                  <span className="font-semibold">{property.yearBuilt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">RERA:</span>
                  <span className="font-semibold">{property.rera}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Developer:</span>
                  <span className="font-semibold">{property.developer}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Property</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-primary-500">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nearby Places */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What's Nearby</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {property.nearby.map((place, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{place.name}</div>
                        <div className="text-sm text-gray-600">{place.type}</div>
                      </div>
                      <div className="text-primary-600 font-semibold">{place.distance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{property.agent.name}</h3>
                <p className="text-gray-600">Property Consultant</p>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <span>📞</span>
                  {property.agent.phone}
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition"
                >
                  <span>✉️</span>
                  {property.agent.email}
                </a>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContactAgent}
                  className="btn-primary w-full"
                >
                  📞 Contact Agent
                </button>
              
                <button
                  onClick={() => setShowEMI(true)}
                  className="btn-secondary w-full"
                >
                  💰 Calculate EMI
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
               
                <button
                  onClick={handleShare}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                >
                  📤 Share Property
                </button>
                <Link
                  to="/listing"
                  className="block w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                >
                  🏠 Similar Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Contact Agent</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleContactFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={contactFormData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I'm interested in</label>
                <select
                  name="interestedIn"
                  value={contactFormData.interestedIn}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="site-visit">Scheduling a site visit</option>
                  <option value="more-info">Getting more information</option>
                  <option value="price-negotiation">Price negotiation</option>
                  <option value="loan-assistance">Loan assistance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={contactFormData.message}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Any specific questions or requirements..."
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <EMICalculator
        isOpen={showEMI}
        onClose={() => setShowEMI(false)}
        propertyPrice={property.price}
      />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default PropertyDetailPage;
