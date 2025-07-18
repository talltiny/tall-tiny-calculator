import React, { useState, useEffect } from 'react';

const TallTinyROICalculator = () => {
  // Model pricing and details
  const modelData = {
    studio: {
      price: 90000,
      size: '4.8m × 2.5m × 4.0m',
      features: 'Perfect studio/office space',
      description: 'Ideal for creative professionals or as a compact guest retreat',
      suggestedRate: 200,
      image: '/assets/studio_iso_1.avif'
    },
    backyard: {
      price: 105000,
      size: '6.0m × 2.5m × 4.0m',
      features: 'Queen bed + workspace',
      description: 'The perfect balance of space and functionality for guests',
      suggestedRate: 225,
      image: '/assets/backyard_iso_1.avif'
    },
    weekender: {
      price: 130000,
      size: '7.2m × 2.5m × 4.0m',
      features: 'Premium guest experience',
      description: 'Luxury tiny home designed for weekend escapes',
      suggestedRate: 250,
      image: '/assets/weekender_iso.avif'
    },
    residence: {
      price: 155000,
      size: '8.4m × 2.5m × 4.0m',
      features: 'Full-sized living experience',
      description: 'Complete tiny home with all amenities for extended stays',
      suggestedRate: 275,
      image: '/assets/residence_iso_1.avif'
    }
  };
  
  // State for all inputs with Blue Mountains specific defaults
  const [model, setModel] = useState('backyard');
  const [nightlyRate, setNightlyRate] = useState(modelData.backyard.suggestedRate);
  const [peakOccupancy, setPeakOccupancy] = useState(80);
  const [offPeakOccupancy, setOffPeakOccupancy] = useState(40);
  const [peakSeasonDays, setPeakSeasonDays] = useState(120);
  const [offSeasonDays, setOffSeasonDays] = useState(245);
  const [cleaningFee, setCleaningFee] = useState(65);
  const [personalUse, setPersonalUse] = useState(30);
  const [averageStayLength, setAverageStayLength] = useState(2);
  
  // State for expense breakdown visibility
  const [showExpenses, setShowExpenses] = useState(false);
  
  // Contact form state
  const [showContact, setShowContact] = useState(false);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Calculated values
  const [results, setResults] = useState({
    annualRevenue: 0,
    annualExpenses: 0,
    netIncome: 0,
    paybackYears: 0,
    fiveYearProfit: 0,
    tenYearProfit: 0,
    breakdownDetails: {}
  });
  
  // Calculate ROI whenever inputs change
  useEffect(() => {
    calculateROI();
  }, [model, nightlyRate, peakOccupancy, offPeakOccupancy, peakSeasonDays, offSeasonDays, cleaningFee, personalUse, averageStayLength]);
  
  const calculateROI = () => {
    const modelPrice = modelData[model].price;
    
    // Calculate available rental days
    const totalAvailableDays = 365 - personalUse;
    const availablePeakDays = Math.min(peakSeasonDays, totalAvailableDays);
    const availableOffPeakDays = Math.min(offSeasonDays, totalAvailableDays - availablePeakDays);
    
    // Calculate bookings based on average stay length
    const peakNights = Math.floor(availablePeakDays * (peakOccupancy / 100));
    const offPeakNights = Math.floor(availableOffPeakDays * (offPeakOccupancy / 100));
    const totalNights = peakNights + offPeakNights;
    
    // Calculate number of stays (bookings) based on average stay length
    const peakBookings = Math.floor(peakNights / averageStayLength);
    const offPeakBookings = Math.floor(offPeakNights / averageStayLength);
    const totalBookings = peakBookings + offPeakBookings;
    
    // Calculate revenue
    const peakNightlyRate = nightlyRate * 1.2; // 20% premium in peak season
    const peakRoomRevenue = peakNights * peakNightlyRate;
    const offPeakRoomRevenue = offPeakNights * nightlyRate;
    const cleaningRevenue = totalBookings * cleaningFee;
    const totalRevenue = peakRoomRevenue + offPeakRoomRevenue + cleaningRevenue;
    
    // Calculate expenses (Blue Mountains specific) - Removed marketing costs
    const annualExpenses = {
      insurance: 1200,
      maintenance: 1500,
      cleaning: 0, // Included in cleaning fee
      utilities: 800,
      councilRates: 0, // No additional rates for caravan classification
      total: 0
    };
    annualExpenses.total = Object.values(annualExpenses).reduce((sum, val) => sum + val, 0) - annualExpenses.total;
    
    // Calculate net income and ROI
    const netIncome = totalRevenue - annualExpenses.total;
    const paybackYears = modelPrice / netIncome;
    const fiveYearProfit = (netIncome * 5) - modelPrice;
    const tenYearProfit = (netIncome * 10) - modelPrice;
    
    // Store detailed breakdown
    const breakdownDetails = {
      peakNights,
      offPeakNights,
      totalNights,
      peakBookings,
      offPeakBookings,
      totalBookings,
      peakRoomRevenue,
      offPeakRoomRevenue,
      cleaningRevenue,
      totalRevenue,
      modelPrice,
      annualExpenses
    };
    
    setResults({
      annualRevenue: totalRevenue,
      annualExpenses: annualExpenses.total,
      netIncome,
      paybackYears,
      fiveYearProfit,
      tenYearProfit,
      breakdownDetails
    });
  };
  
  const handleModelChange = (selectedModel) => {
    setModel(selectedModel);
    // Update nightly rate based on selected model
    setNightlyRate(modelData[selectedModel].suggestedRate);
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // Using Netlify's form handling
    const form = e.target;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
      alert(`Thank you ${name}! We'll contact you within 24 hours about your ${model} tiny home investment.`);
      setShowContact(false);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
    })
    .catch((error) => {
      alert('There was an error submitting your form. Please try again.');
      console.error(error);
    });
  };
  
  const handleDownloadSubmit = (e) => {
    e.preventDefault();
    
    // Using Netlify's form handling
    const form = e.target;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
    .then(() => {
      // Redirect to PDF
      window.open('/assets/Tall Tiny - Technical Specifications - 2025.pdf', '_blank');
      setShowDownloadForm(false);
      
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
    })
    .catch((error) => {
      alert('There was an error processing your download. Please try again.');
      console.error(error);
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString();
  };
  
  const toggleExpenses = () => {
    setShowExpenses(!showExpenses);
  };
  
  // Style variables from the style guide
  const colors = {
    // Green palette
    green10: '#282a22',
    green20: '#3f4336',
    green30: '#575b49',
    green40: '#6f735d',
    green50: '#888b70',
    green60: '#9d9e88',
    green70: '#b1b1a1',
    green80: '#c5c4b9',
    green90: '#d8d8d1',
    green100: '#ecebe4',
    
    // Orange palette
    orange10: '#3f2c0e',
    orange20: '#634215',
    orange30: '#87541d',
    orange40: '#ab6425',
    orange50: '#ce712d',
    orange60: '#d58352',
    orange70: '#da9878',
    orange80: '#e1b09d',
    orange90: '#e9c9c0',
    orange100: '#f4e5e1',
    
    // Neutrals
    neutralTtGreen: '#797c64',
    neutralTtTimber: '#d27530',
    neutralLightest: '#fff8f3',
    neutralLighter: '#ecebe4',
    neutralLight: '#adada8',
    neutral: '#666',
    neutralDark: '#444',
    neutralDarkest: '#41472f',
    white: '#ffffff',
    black: '#313638',
    
    // Cards
    lightCardBg: '#faf9f0',
    lightCardBorder: '#dbdad4'
  };
  
  const fonts = {
    heading: "'Roslindale Variable', 'Roslindalevariable Opsz Slnt Wdth Wght', Times, serif",
    body: "'Inter Variable', 'Intervariable', Arial, sans-serif"
  };
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.green100, fontFamily: fonts.body }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Logo */}
        <div className="text-center mb-4">
          <div className="mb-3">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-16 md:h-20"
              />
            </a>
          </div>
          
          {/* Hero Section */}
          <h1 
            className="text-4xl font-bold mb-4" 
            style={{ 
              color: colors.neutralDarkest, 
              fontFamily: fonts.heading,
              fontVariationSettings: '"wght" 300, "wdth" 90, "opsz" 72'
            }}
          >
            Welcome to Tall Tiny Eco-Stays
          </h1>
          <p 
            className="text-xl mb-6 italic" 
            style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
          >
            Your backyard investment opportunity in the Blue Mountains
          </p>
          
          <div className="max-w-3xl mx-auto mb-6 text-base" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
            <p className="mb-4">
              Transform your property into a revenue-generating eco-stay that pays for itself while providing unique experiences for visitors to our UNESCO World Heritage region.
            </p>
          </div>
          
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden mb-8 shadow-lg">
            <img 
              src="/assets/talltiny-residence-ribbongum.png" 
              alt="Tall Tiny Residence in Ribbon Gum" 
              className="w-full"
              style={{ borderRadius: '16px' }}
            />
          </div>
          
          {/* Social Proof Section */}
          <div 
            className="max-w-4xl mx-auto mb-8 p-6 rounded-lg"
            style={{ 
              backgroundColor: colors.lightCardBg,
              border: `1px solid ${colors.lightCardBorder}`,
              borderRadius: '16px'
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-lg italic mb-2" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
                  "Highest quality craftsmanship I've ever seen"
                </p>
                <p className="text-sm" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                  — Declan's Father-in-law
                </p>
              </div>
              <div>
                <p className="text-lg italic mb-2" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
                  "Far exceeded our expectations... exceptional craftsmanship"
                </p>
                <p className="text-sm" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                  — Dan & Rosie, Airbnb hosts
                </p>
              </div>
              <div>
                <p className="text-lg italic mb-2" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
                  "Outstanding customer service... second to none workmanship"
                </p>
                <p className="text-sm" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                  — Anne S, Airbnb host
                </p>
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white border rounded-lg p-4 inline-block" 
            style={{ 
              borderColor: colors.orange50,
              backgroundColor: colors.lightCardBg,
              borderRadius: '16px'
            }}
          >
            <p style={{ color: colors.orange50, fontFamily: fonts.body }}>
              ✓ No Council Approval Required ✓ 75%+ Occupancy Achieved ✓ 12-Week Delivery
            </p>
          </div>
        </div>
        
        {/* The Blue Mountains Opportunity */}
        <div 
          className="mt-8 mb-8 rounded-lg p-6 shadow-sm" 
          style={{ 
            backgroundColor: colors.lightCardBg,
            borderTop: `4px solid ${colors.orange50}`,
            borderRadius: '16px',
            boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
          }}
        >
          <h3 
            className="text-xl font-semibold mb-4" 
            style={{ 
              color: colors.neutralDarkest, 
              fontFamily: fonts.heading,
              fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
            }}
          >
            The Blue Mountains Opportunity
          </h3>
          <div className="space-y-3 text-sm" style={{ fontFamily: fonts.body }}>
            <div className="flex items-start">
              <span className="mr-3" style={{ color: colors.orange50 }}>✓</span>
              <div>
                <span className="font-semibold" style={{ color: colors.orange50 }}>$1.2 billion</span>
                <span style={{ color: colors.neutralDarkest }}> annual tourism revenue in the Blue Mountains</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3" style={{ color: colors.orange50 }}>✓</span>
              <div>
                <span className="font-semibold" style={{ color: colors.orange50 }}>Western Sydney Airport</span>
                <span style={{ color: colors.neutralDarkest }}> opening 2026 - projected 15-20% visitor increase</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3" style={{ color: colors.orange50 }}>✓</span>
              <div>
                <span className="font-semibold" style={{ color: colors.orange50 }}>No council approval required</span>
                <span style={{ color: colors.neutralDarkest }}> - delivered in 12 weeks</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3" style={{ color: colors.orange50 }}>✓</span>
              <div>
                <span className="font-semibold" style={{ color: colors.orange50 }}>75%+ occupancy rates</span>
                <span style={{ color: colors.neutralDarkest }}> achieved by current Tall Tiny hosts</span>
              </div>
            </div>
            <div className="flex items-start">
              <span className="mr-3" style={{ color: colors.orange50 }}>✓</span>
              <div>
                <span className="font-semibold" style={{ color: colors.orange50 }}>Carbon neutral construction</span>
                <span style={{ color: colors.neutralDarkest }}> supporting sustainable tourism</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Model Selection */}
        <div className="mb-8">
          <h2 
            className="text-2xl font-semibold mb-2 text-center" 
            style={{ 
              color: colors.neutralDarkest, 
              fontFamily: fonts.heading,
              fontVariationSettings: '"wght" 360, "wdth" 90, "opsz" 36'
            }}
          >
            Calculate Your Potential Returns
          </h2>
          <p className="text-center mb-4" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
            See how a custom-designed Tall Tiny eco-stay could perform on your property. Our luxury tiny homes are already generating strong returns for Blue Mountains property owners through Airbnb and unique accommodation experiences.
          </p>
          <h3 
            className="text-xl font-semibold mb-4 text-center" 
            style={{ 
              color: colors.neutralDarkest, 
              fontFamily: fonts.heading,
              fontVariationSettings: '"wght" 360, "wdth" 90, "opsz" 28'
            }}
          >
            Choose Your Tiny Home Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modelData).map(([key, data]) => (
              <div
                key={key}
                onClick={() => handleModelChange(key)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  model === key 
                    ? 'border-2' 
                    : 'hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: model === key ? colors.lightCardBg : colors.white,
                  borderColor: model === key ? colors.orange50 : colors.lightCardBorder,
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Model Image */}
                <div className="mb-3 h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src={data.image} 
                    alt={`${key} model`} 
                    className="object-contain h-full w-full"
                  />
                </div>
                <h3 
                  className="font-semibold capitalize text-lg mb-2" 
                  style={{ 
                    color: colors.neutralDarkest, 
                    fontFamily: fonts.heading,
                    fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 24'
                  }}
                >
                  {key}
                </h3>
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>{data.size}</p>
                <p className="text-sm mb-2" style={{ color: colors.neutral, fontFamily: fonts.body }}>{data.features}</p>
                <p className="font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {formatCurrency(data.price)}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  Suggested nightly rate: {formatCurrency(data.suggestedRate)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div 
            className="rounded-lg p-6 shadow-sm"
            style={{
              backgroundColor: colors.lightCardBg,
              border: `1px solid ${colors.lightCardBorder}`,
              borderRadius: '16px',
              boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
            }}
          >
            <h3 
              className="text-xl font-semibold mb-4" 
              style={{ 
                color: colors.neutralDarkest, 
                fontFamily: fonts.heading,
                fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
              }}
            >
              Your Investment Details
            </h3>
            
            {/* Selected Model Info */}
            <div 
              className="rounded-lg p-4 mb-6 border" 
              style={{ 
                borderColor: colors.orange50,
                backgroundColor: colors.white,
                borderRadius: '16px'
              }}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 
                    className="font-semibold text-lg capitalize mb-2" 
                    style={{ 
                      color: colors.neutralDarkest, 
                      fontFamily: fonts.heading,
                      fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 24'
                    }}
                  >
                    {model} Model
                  </h4>
                  <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>{modelData[model].description}</p>
                  <p className="text-sm mb-2" style={{ color: colors.neutral, fontFamily: fonts.body }}>Size: {modelData[model].size}</p>
                  <p className="font-bold text-lg" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                    {formatCurrency(modelData[model].price)}
                  </p>
                </div>
                <div className="w-24 h-24 ml-2">
                  <img 
                    src={modelData[model].image} 
                    alt={`${model} model`} 
                    className="object-contain h-full w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Input Fields - styled according to style guide */}
            <div className="space-y-4">
              {/* Nightly Rate */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Base Nightly Rate (Peak +20% automatically applied)
                </label>
                <div className="relative">
                  <span 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                    style={{ color: colors.neutralLight, fontFamily: fonts.body }}
                  >$</span>
                  <input
                    type="number"
                    value={nightlyRate}
                    onChange={(e) => setNightlyRate(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                    min="0"
                    step="10"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  Blue Mountains average: $220-$280 
                  <a 
                    href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-1 underline"
                    style={{ color: colors.orange50, fontFamily: fonts.body }}
                  >
                    (Source: AirDNA)
                  </a>
                </p>
              </div>
              
              {/* Average Stay Length */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Average Length of Stay (nights)
                </label>
                <input
                  type="number"
                  value={averageStayLength}
                  onChange={(e) => setAverageStayLength(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{ 
                    borderColor: colors.black,
                    height: '2.75rem',
                    fontFamily: fonts.body
                  }}
                  min="1"
                  step="0.5"
                />
                <p className="text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  Blue Mountains average: 2-3 nights
                </p>
              </div>
              
              {/* Peak Season Occupancy */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Peak Season Occupancy: {peakOccupancy}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={peakOccupancy}
                  onChange={(e) => setPeakOccupancy(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                  style={{ backgroundColor: colors.neutralLight }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  <span>0%</span>
                  <span>Blue Mountains peak average: 76-85%</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* Off-Peak Occupancy */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Off-Peak Occupancy: {offPeakOccupancy}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={offPeakOccupancy}
                  onChange={(e) => setOffPeakOccupancy(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                  style={{ backgroundColor: colors.neutralLight }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  <span>0%</span>
                  <span>Blue Mountains off-peak average: 35-45%</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* Peak Season Days */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Peak Season Days (Summer, holidays, events)
                </label>
                <input
                  type="number"
                  value={peakSeasonDays}
                  onChange={(e) => setPeakSeasonDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{ 
                    borderColor: colors.black,
                    height: '2.75rem',
                    fontFamily: fonts.body
                  }}
                  min="0"
                  max="365"
                />
                <p className="text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>Blue Mountains peak: Dec-Feb, Easter, long weekends</p>
              </div>
              
              {/* Cleaning Fee */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Cleaning Fee per Stay
                </label>
                <div className="relative">
                  <span 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                    style={{ color: colors.neutralLight, fontFamily: fonts.body }}
                  >$</span>
                  <input
                    type="number"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                    min="0"
                    step="5"
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
                  Charged per booking, not per night. Blue Mountains average: $60-85
                </p>
              </div>
              
              {/* Personal Use */}
              <div>
                <label 
                  className="block text-sm font-medium mb-2" 
                  style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                >
                  Your Personal Use (days per year)
                </label>
                <input
                  type="number"
                  value={personalUse}
                  onChange={(e) => setPersonalUse(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none"
                  style={{ 
                    borderColor: colors.black,
                    height: '2.75rem',
                    fontFamily: fonts.body
                  }}
                  min="0"
                  max="365"
                />
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div 
            className="rounded-lg p-6 shadow-sm" 
            style={{ 
              backgroundColor: colors.lightCardBg,
              border: `1px solid ${colors.lightCardBorder}`,
              borderLeft: `4px solid ${colors.orange50}`,
              borderRadius: '16px',
              boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
            }}
          >
            <h3 
              className="text-xl font-semibold mb-4" 
              style={{ 
                color: colors.neutralDarkest, 
                fontFamily: fonts.heading,
                fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
              }}
            >
              Your ROI Projection
            </h3>
            
            {/* Key Metrics */}
            <div className="space-y-4 mb-6">
              <div 
                className="rounded-lg p-4 shadow-sm border" 
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>Annual Revenue</p>
                <p className="text-2xl font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {formatCurrency(results.annualRevenue)}
                </p>
              </div>
              
              <div 
                className="rounded-lg p-4 shadow-sm border cursor-pointer"
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
                onClick={toggleExpenses}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                    Annual Expenses <span className="text-xs" style={{ color: colors.neutralLight }}>(click to view details)</span>
                  </p>
                  <span style={{ color: colors.neutralDarkest }}>{showExpenses ? '▲' : '▼'}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
                  {formatCurrency(results.annualExpenses)}
                </p>
                
                {/* Expense Breakdown */}
                {showExpenses && (
                  <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${colors.lightCardBorder}` }}>
                    <div className="space-y-1">
                      {Object.entries(results.breakdownDetails.annualExpenses || {}).map(([key, value]) => {
                        if (key !== 'total' && key !== 'cleaning' && value > 0) {
                          return (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize" style={{ fontFamily: fonts.body }}>{key}</span>
                              <span style={{ fontFamily: fonts.body }}>{formatCurrency(value)}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div 
                className="rounded-lg p-4 shadow-sm border" 
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>Net Annual Income</p>
                <p className="text-2xl font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {formatCurrency(results.netIncome)}
                </p>
              </div>
              
              <div 
                className="rounded-lg p-4 shadow-sm border" 
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>Payback Period</p>
                <p className="text-2xl font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {results.paybackYears.toFixed(1)} years
                </p>
              </div>
            </div>
            
            {/* Future Returns */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div 
                className="rounded-lg p-3 shadow-sm border" 
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>5-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {formatCurrency(results.fiveYearProfit)}
                </p>
              </div>
              <div 
                className="rounded-lg p-3 shadow-sm border" 
                style={{ 
                  borderColor: colors.orange50,
                  backgroundColor: colors.white,
                  borderRadius: '16px'
                }}
              >
                <p className="text-sm mb-1" style={{ color: colors.neutral, fontFamily: fonts.body }}>10-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: colors.orange50, fontFamily: fonts.body }}>
                  {formatCurrency(results.tenYearProfit)}
                </p>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div 
              className="rounded-lg p-4 shadow-sm mb-6 border" 
              style={{ 
                borderColor: colors.orange50,
                backgroundColor: colors.white,
                borderRadius: '16px'
              }}
            >
              <h4 
                className="font-semibold mb-3" 
                style={{ 
                  color: colors.neutralDarkest, 
                  fontFamily: fonts.heading,
                  fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 20'
                }}
              >
                Annual Breakdown
              </h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: fonts.body }}>
                <div className="flex justify-between">
                  <span>Peak Season Nights ({results.breakdownDetails.peakNights || 0})</span>
                  <span>{formatCurrency(results.breakdownDetails.peakRoomRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Off-Peak Nights ({results.breakdownDetails.offPeakNights || 0})</span>
                  <span>{formatCurrency(results.breakdownDetails.offPeakRoomRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning Fees ({results.breakdownDetails.totalBookings || 0} stays)</span>
                  <span>{formatCurrency(results.breakdownDetails.cleaningRevenue || 0)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold" style={{ borderTop: `1px solid ${colors.lightCardBorder}` }}>
                  <span>Total Revenue</span>
                  <span>{formatCurrency(results.annualRevenue)}</span>
                </div>
                <div className="flex justify-between" style={{ color: colors.orange50 }}>
                  <span>Annual Expenses</span>
                  <span>-{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold" style={{ color: colors.orange50, borderTop: `1px solid ${colors.lightCardBorder}` }}>
                  <span>Net Income</span>
                  <span>{formatCurrency(results.netIncome)}</span>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons - styled according to style guide */}
            <div className="space-y-3">
              <button
                onClick={() => setShowContact(true)}
                className="w-full font-bold py-3 px-4 transition duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: colors.green50,
                  color: colors.white,
                  fontFamily: fonts.body,
                  borderRadius: '24px 4px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Get Your Free Site Assessment
              </button>
              
              <button
                onClick={() => setShowDownloadForm(true)}
                className="w-full font-bold py-3 px-4 transition duration-200 hover:opacity-90 border"
                style={{ 
                  borderColor: colors.green50,
                  color: colors.green50,
                  fontFamily: fonts.body,
                  backgroundColor: 'transparent',
                  borderRadius: '24px 4px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Download Our Tech Specs
              </button>
              
              <a
                href="https://calendly.com/hello-talltiny/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full font-bold py-3 px-4 transition duration-200 hover:opacity-90 text-center"
                style={{ 
                  backgroundColor: colors.orange50,
                  color: colors.white,
                  fontFamily: fonts.body,
                  borderRadius: '24px 4px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Let's Chat!
              </a>
            </div>
            
            {/* Western Sydney Airport Note */}
            <div 
              className="mt-4 rounded-lg p-3" 
              style={{ 
                backgroundColor: colors.orange100,
                border: `1px solid ${colors.orange50}`,
                borderRadius: '16px'
              }}
            >
              <p className="text-sm" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
                <strong>Future Opportunity:</strong> Western Sydney Airport opens in 2026. 
                Blue Mountains accommodation demand projected to increase 15-20%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Why Tall Tiny Section */}
        <div 
          className="mt-8 rounded-lg p-6 shadow-sm" 
          style={{ 
            backgroundColor: colors.lightCardBg,
            borderLeft: `4px solid ${colors.green50}`,
            borderRadius: '16px',
            boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
          }}
        >
          <h3 
            className="text-xl font-semibold mb-4" 
            style={{ 
              color: colors.neutralDarkest, 
              fontFamily: fonts.heading,
              fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
            }}
          >
            Why Tall Tiny
          </h3>
          <div className="space-y-4 text-sm" style={{ fontFamily: fonts.body }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.green50 }}>Built to Last</p>
              <p style={{ color: colors.neutralDarkest }}>Custom-designed for your needs using sustainable, low-toxicity materials</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.green50 }}>Proven Returns</p>
              <p style={{ color: colors.neutralDarkest }}>Current hosts achieving 75%+ occupancy</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.green50 }}>Sustainable</p>
              <p style={{ color: colors.neutralDarkest }}>Carbon neutral construction aligning with eco-tourism demand</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.green50 }}>Authentic</p>
              <p style={{ color: colors.neutralDarkest }}>Family-owned business based in Lawson, supporting local community</p>
            </div>
          </div>
        </div>
        
        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              style={{ 
                backgroundColor: colors.white,
                borderRadius: '16px'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-4" 
                style={{ 
                  color: colors.neutralDarkest, 
                  fontFamily: fonts.heading,
                  fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
                }}
              >
                Get Your Free Site Assessment
              </h3>
              <div>
                <input type="hidden" name="form-name" value="site-assessment" />
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <div className="mb-4">
                  <p className="text-sm" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                    Selected Model: <strong className="capitalize">{model}</strong> 
                    {' '}({formatCurrency(modelData[model].price)})
                  </p>
                  <p className="text-sm" style={{ color: colors.neutral, fontFamily: fonts.body }}>
                    Projected Annual Income: <strong>{formatCurrency(results.netIncome)}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                    style={{ 
                      fontFamily: fonts.body,
                      borderColor: colors.neutralLight,
                      borderRadius: '24px 4px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleContactSubmit}
                    className="flex-1 px-4 py-2 rounded-md hover:opacity-90"
                    style={{ 
                      backgroundColor: colors.green50,
                      color: colors.white,
                      fontFamily: fonts.body,
                      borderRadius: '24px 4px'
                    }}
                  >
                    Get Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Download Tech Specs Modal */}
        {showDownloadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              style={{ 
                backgroundColor: colors.white,
                borderRadius: '16px'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-4" 
                style={{ 
                  color: colors.neutralDarkest, 
                  fontFamily: fonts.heading,
                  fontVariationSettings: '"wght" 400, "wdth" 90, "opsz" 28'
                }}
              >
                Download Technical Specifications
              </h3>
              <div>
                <input type="hidden" name="form-name" value="tech-specs-download" />
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label 
                    className="block text-sm font-medium mb-2" 
                    style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    style={{ 
                      borderColor: colors.black,
                      height: '2.75rem',
                      fontFamily: fonts.body
                    }}
                  />
                </div>
                <input type="hidden" name="requestType" value="Tech Specs Download" />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDownloadForm(false)}
                    className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                    style={{ 
                      fontFamily: fonts.body,
                      borderColor: colors.neutralLight,
                      borderRadius: '24px 4px'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleDownloadSubmit}
                    className="flex-1 px-4 py-2 rounded-md hover:opacity-90"
                    style={{ 
                      backgroundColor: colors.green50,
                      color: colors.white,
                      fontFamily: fonts.body,
                      borderRadius: '24px 4px'
                    }}
                  >
                    Download Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Added Website Link Section */}
        <div className="mt-8 relative rounded-lg overflow-hidden shadow-lg" style={{ borderRadius: '16px' }}>
          <img 
            src="/assets/talltiny-weekender-lawson.avif" 
            alt="Tall Tiny Weekender in Lawson" 
            className="w-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <a 
              href="https://talltiny.com.au" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-8 py-4 bg-white bg-opacity-90 rounded-lg text-2xl font-bold transition-transform transform hover:scale-105"
              style={{ 
                color: colors.neutralDarkest, 
                fontFamily: fonts.heading,
                fontVariationSettings: '"wght" 300, "wdth" 90, "opsz" 30',
                borderRadius: '16px'
              }}
            >
              Explore Our Website & Guides
            </a>
          </div>
        </div>
        
        {/* Updated Footer with Phone Number */}
        <footer className="mt-12 pt-6 text-center" style={{ borderTop: `1px solid ${colors.lightCardBorder}` }}>
          <div className="mb-4">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-12"
              />
            </a>
          </div>
          <div className="mb-4 text-sm" style={{ color: colors.neutralDarkest, fontFamily: fonts.body }}>
            <p>39 Park St, Lawson, NSW 2783</p>
            <p>
              <a 
                href="mailto:hello@talltiny.com.au" 
                className="underline hover:opacity-80"
                style={{ color: colors.orange50 }}
              >
                hello@talltiny.com.au
              </a>
            </p>
            <p>
              <a 
                href="tel:0400755135" 
                className="underline hover:opacity-80"
                style={{ color: colors.orange50 }}
              >
                0400 755 135
              </a>
            </p>
          </div>
          <div className="text-xs" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
            <p>&copy; {new Date().getFullYear()} Tall Tiny. All rights reserved.</p>
            <p>
              <a 
                href="https://talltiny.com.au/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:opacity-80"
                style={{ color: colors.orange50 }}
              >
                Privacy Policy
              </a>
              {' | '}
              <a 
                href="https://talltiny.com.au/terms-of-service" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:opacity-80"
                style={{ color: colors.orange50 }}
              >
                Terms of Service
              </a>
            </p>
          </div>
        </footer>
        
        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: colors.neutralLight, fontFamily: fonts.body }}>
            * ROI calculations are estimates based on current Blue Mountains market conditions. 
            Actual results may vary based on location, property setup, marketing effectiveness, and market changes.
            Past performance does not guarantee future results. This ROI tool is for general advice only, any investment decisions need to take into account your individual situation.
            <a 
              href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-1 underline"
              style={{ color: colors.orange50 }}
            >
              (Market Data Source: AirDNA)
            </a>
          </p>
        </div>
        
        {/* Inline CSS for slider styling */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: ${colors.orange50};
            cursor: pointer;
          }
          
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: ${colors.orange50};
            cursor: pointer;
            border: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TallTinyROICalculator;