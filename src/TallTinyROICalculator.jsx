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
    
    // Calculate expenses (Blue Mountains specific)
    const annualExpenses = {
      insurance: 1200,
      maintenance: 1500,
      cleaning: 0, // Included in cleaning fee
      utilities: 800,
      marketing: 500,
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
    
    // Send email to hello@talltiny.com.au
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('model', model);
    formData.append('price', modelData[model].price);
    formData.append('projection', results.netIncome);
    
    // Using Netlify's form handling
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
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
    
    // Send email to hello@talltiny.com.au for download request
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('requestType', 'Tech Specs Download');
    
    // Using Netlify's form handling
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
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
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ecebe4', fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-16 md:h-20"
              />
            </a>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
            Your Backyard, Your Guest House
          </h1>
          <p className="text-xl mb-4" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
            Sustainable accommodation that pays for itself
          </p>
          
          {/* New intro text */}
          <div className="max-w-3xl mx-auto mb-6 text-base" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
            <p className="mb-3">
              This Return on Investment calculator helps Blue Mountains homeowners estimate the potential income from a Tall Tiny guest house on their property.
            </p>
            <p className="mb-3">
              Our luxury tiny homes require no council approval and can be delivered in just 12 weeks, allowing you to transform your backyard into a revenue-generating guest accommodation that pays for itself while providing a unique experience for visitors.
            </p>
            <p>
              Simply adjust the parameters below to see what your potential return could be with a Tall Tiny home placed on your property.
            </p>
          </div>
          
          <div className="bg-white border rounded-lg p-4 inline-block" style={{ borderColor: '#c67a3e' }}>
            <p style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
              ✓ No Council Approval Required ✓ Ready Before Summer ✓ 12-Week Delivery
            </p>
          </div>
        </div>
        
        {/* Model Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
            Choose Your Tiny Home Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modelData).map(([key, data]) => (
              <div
                key={key}
                onClick={() => handleModelChange(key)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all bg-white ${
                  model === key 
                    ? 'border-2' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={model === key ? { borderColor: '#c67a3e', backgroundColor: '#fdf8f3' } : {}}
              >
                {/* Model Image */}
                <div className="mb-3 h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src={data.image} 
                    alt={`${key} model`} 
                    className="object-contain h-full w-full"
                  />
                </div>
                <h3 className="font-semibold capitalize text-lg mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                  {key}
                </h3>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>{data.size}</p>
                <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{data.features}</p>
                <p className="font-bold" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
                  {formatCurrency(data.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                  Suggested nightly rate: {formatCurrency(data.suggestedRate)}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
              Your Investment Details
            </h3>
            
            {/* Selected Model Info */}
            <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: '#c67a3e' }}>
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg capitalize mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                    {model} Model
                  </h4>
                  <p className="text-gray-600 text-sm mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>{modelData[model].description}</p>
                  <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>Size: {modelData[model].size}</p>
                  <p className="font-bold text-lg" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
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
            
            {/* Nightly Rate */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Base Nightly Rate (Peak +20% automatically applied)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>$</span>
                <input
                  type="number"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  min="0"
                  step="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                Blue Mountains average: $220-$280 
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 underline"
                  style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                >
                  (Source: AirDNA)
                </a>
              </p>
            </div>
            
            {/* Average Stay Length */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Average Length of Stay (nights)
              </label>
              <input
                type="number"
                value={averageStayLength}
                onChange={(e) => setAverageStayLength(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                min="1"
                step="0.5"
              />
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                Blue Mountains average: 2-3 nights
              </p>
            </div>
            
            {/* Peak Season Occupancy */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Peak Season Occupancy: {peakOccupancy}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={peakOccupancy}
                onChange={(e) => setPeakOccupancy(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                style={{ backgroundColor: '#e5e5e5' }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                <span>0%</span>
                <span>Blue Mountains peak average: 76-85%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                  style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                >
                  Source: AirDNA Blue Mountains Market Data
                </a>
              </p>
            </div>
            
            {/* Off-Peak Occupancy */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Off-Peak Occupancy: {offPeakOccupancy}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={offPeakOccupancy}
                onChange={(e) => setOffPeakOccupancy(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                style={{ backgroundColor: '#e5e5e5' }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                <span>0%</span>
                <span>Blue Mountains off-peak average: 35-45%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                  style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                >
                  Source: AirDNA Seasonal Trends
                </a>
              </p>
            </div>
            
            {/* Peak Season Days */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Peak Season Days (Summer, holidays, events)
              </label>
              <input
                type="number"
                value={peakSeasonDays}
                onChange={(e) => setPeakSeasonDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                min="0"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>Blue Mountains peak: Dec-Feb, Easter, long weekends</p>
            </div>
            
            {/* Cleaning Fee */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Cleaning Fee per Stay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>$</span>
                <input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  min="0"
                  step="5"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Arial, sans-serif' }}>
                Charged per booking, not per night. Blue Mountains average: $60-85
              </p>
            </div>
            
            {/* Personal Use */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Your Personal Use (days per year)
              </label>
              <input
                type="number"
                value={personalUse}
                onChange={(e) => setPersonalUse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                min="0"
                max="365"
              />
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ borderLeft: '4px solid #c67a3e' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
              Your ROI Projection
            </h3>
            
            {/* Key Metrics */}
            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#c67a3e' }}>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>Annual Revenue</p>
                <p className="text-2xl font-bold" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
                  {formatCurrency(results.annualRevenue)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#c67a3e' }}>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>Net Annual Income</p>
                <p className="text-2xl font-bold" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                  {formatCurrency(results.netIncome)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#c67a3e' }}>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>Payback Period</p>
                <p className="text-2xl font-bold" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
                  {results.paybackYears.toFixed(1)} years
                </p>
              </div>
            </div>
            
            {/* Future Returns */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#c67a3e' }}>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>5-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
                  {formatCurrency(results.fiveYearProfit)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#c67a3e' }}>
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Arial, sans-serif' }}>10-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: '#c67a3e', fontFamily: 'Arial, sans-serif' }}>
                  {formatCurrency(results.tenYearProfit)}
                </p>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border" style={{ borderColor: '#c67a3e' }}>
              <h4 className="font-semibold mb-3" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Annual Breakdown</h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
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
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Revenue</span>
                  <span>{formatCurrency(results.annualRevenue)}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#c67a3e' }}>
                  <span>Annual Expenses</span>
                  <span>-{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold" style={{ color: '#c67a3e' }}>
                  <span>Net Income</span>
                  <span>{formatCurrency(results.netIncome)}</span>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowContact(true)}
                className="w-full font-bold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90"
                style={{ backgroundColor: '#797c67', color: '#ecebe4', fontFamily: 'Arial, sans-serif' }}
              >
                Get Your Free Site Assessment
              </button>
              
              <button
                onClick={() => setShowDownloadForm(true)}
                className="w-full font-bold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90 border"
                style={{ borderColor: '#797c67', color: '#797c67', fontFamily: 'Arial, sans-serif', backgroundColor: 'white' }}
              >
                Download Our Tech Specs
              </button>
              
              <a
                href="https://calendly.com/hello-talltiny/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full font-bold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90 text-center"
                style={{ backgroundColor: '#c67a3e', color: '#ecebe4', fontFamily: 'Arial, sans-serif' }}
              >
                Let's Chat!
              </a>
            </div>
            
            {/* Western Sydney Airport Note */}
            <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#fdf8f3', border: '1px solid #c67a3e' }}>
              <p className="text-sm" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                <strong>Future Opportunity:</strong> Western Sydney Airport opens in 2026. 
                Blue Mountains accommodation demand projected to increase 15-20%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Blue Mountains Context */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm" style={{ borderTop: '4px solid #c67a3e' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Why Blue Mountains?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div>
              <p className="font-semibold" style={{ color: '#c67a3e' }}>3.2M Annual Visitors</p>
              <p style={{ color: '#424732' }}>Generating $1.1B in tourism revenue</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#c67a3e' }}>UNESCO World Heritage</p>
              <p style={{ color: '#424732' }}>Premium eco-tourism destination</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#c67a3e' }}>Accommodation Shortage</p>
              <p style={{ color: '#424732' }}>Growing demand, limited supply</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-300 text-center">
          <div className="mb-4">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-12"
              />
            </a>
          </div>
          <div className="mb-4 text-sm" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
            <p>39 Park St, Lawson, NSW 2783</p>
            <p>
              <a href="mailto:hello@talltiny.com.au" className="underline hover:text-c67a3e">hello@talltiny.com.au</a>
            </p>
          </div>
          <div className="text-xs text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
            <p>&copy; {new Date().getFullYear()} Tall Tiny. All rights reserved.</p>
            <p>
              <a href="https://talltiny.com.au/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-c67a3e">Privacy Policy</a>
              {' | '}
              <a href="https://talltiny.com.au/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-c67a3e">Terms of Service</a>
            </p>
          </div>
        </footer>
        
        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Get Your Free Site Assessment
              </h3>
              <form onSubmit={handleContactSubmit} data-netlify="true" name="site-assessment">
                <input type="hidden" name="form-name" value="site-assessment" />
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Selected Model: <strong className="capitalize">{model}</strong> 
                    {' '}({formatCurrency(modelData[model].price)})
                  </p>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Arial, sans-serif' }}>
                    Projected Annual Income: <strong>{formatCurrency(results.netIncome)}</strong>
                  </p>
                </div>
                <input type="hidden" name="model" value={model} />
                <input type="hidden" name="price" value={modelData[model].price} />
                <input type="hidden" name="projection" value={results.netIncome} />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-md hover:opacity-90"
                    style={{ backgroundColor: '#797c67', color: '#ecebe4', fontFamily: 'Arial, sans-serif' }}
                  >
                    Get Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Download Tech Specs Modal */}
        {showDownloadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>
                Download Technical Specifications
              </h3>
              <form onSubmit={handleDownloadSubmit} data-netlify="true" name="tech-specs-download">
                <input type="hidden" name="form-name" value="tech-specs-download" />
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732', fontFamily: 'Arial, sans-serif' }}>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#c67a3e', fontFamily: 'Arial, sans-serif' }}
                  />
                </div>
                <input type="hidden" name="requestType" value="Tech Specs Download" />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDownloadForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-md hover:opacity-90"
                    style={{ backgroundColor: '#797c67', color: '#ecebe4', fontFamily: 'Arial, sans-serif' }}
                  >
                    Download Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>
            * ROI calculations are estimates based on current Blue Mountains market conditions. 
            Actual results may vary based on location, property setup, marketing effectiveness, and market changes.
            Past performance does not guarantee future results.
          </p>
        </div>
        
        {/* Inline CSS for slider styling */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #c67a3e;
            cursor: pointer;
          }
          
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #c67a3e;
            cursor: pointer;
            border: none;
          }
          
          input:focus {
            ring-color: #c67a3e;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TallTinyROICalculator;