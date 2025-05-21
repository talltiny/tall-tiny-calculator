import React, { useState, useEffect } from 'react';

const TallTinyROICalculator = () => {
  // Model pricing and details
  const modelData = {
    studio: {
      price: 90000,
      size: '4.8m × 2.5m × 4.0m',
      features: 'Perfect studio/office space',
      description: 'Ideal for creative professionals or as a compact guest retreat',
      suggestedRate: 200
    },
    backyard: {
      price: 105000,
      size: '6.0m × 2.5m × 4.0m',
      features: 'Queen bed + workspace',
      description: 'The perfect balance of space and functionality for guests',
      suggestedRate: 225
    },
    weekender: {
      price: 130000,
      size: '7.2m × 2.5m × 4.0m',
      features: 'Premium guest experience',
      description: 'Luxury tiny home designed for weekend escapes',
      suggestedRate: 250
    },
    residence: {
      price: 155000,
      size: '8.4m × 2.5m × 4.0m',
      features: 'Full-sized living experience',
      description: 'Complete tiny home with all amenities for extended stays',
      suggestedRate: 275
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
    // Here you would typically send the data to your backend
    alert(`Thank you ${name}! We'll contact you within 24 hours about your ${model} tiny home investment.`);
    setShowContact(false);
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
    <div className="min-h-screen" style={{ backgroundColor: '#ecebe4' }}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src="/assets/talltiny-logo.png" 
              alt="Tall Tiny Logo" 
              className="mx-auto h-16 md:h-20"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#424732' }}>
            Your Backyard, Your Guest House
          </h1>
          <p className="text-xl mb-6" style={{ color: '#424732' }}>
            Sustainable accommodation that pays for itself
          </p>
          <div className="bg-white border rounded-lg p-4 inline-block" style={{ borderColor: '#797c67' }}>
            <p className="font-semibold" style={{ color: '#797c67' }}>
              ✓ No Council Approval Required ✓ Ready Before Summer ✓ 12-Week Delivery
            </p>
          </div>
        </div>
        
        {/* Model Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: '#424732' }}>
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
                style={model === key ? { borderColor: '#797c67', backgroundColor: '#f7f7f4' } : {}}
              >
                <h3 className="font-semibold capitalize text-lg mb-2" style={{ color: '#424732' }}>
                  {key}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{data.size}</p>
                <p className="text-sm text-gray-600 mb-2">{data.features}</p>
                <p className="font-bold" style={{ color: '#797c67' }}>
                  {formatCurrency(data.price)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732' }}>
              Your Investment Details
            </h3>
            
            {/* Selected Model Info */}
            <div className="bg-white rounded-lg p-4 mb-6 border" style={{ borderColor: '#797c67' }}>
              <h4 className="font-semibold text-lg capitalize mb-2" style={{ color: '#424732' }}>
                {model} Model
              </h4>
              <p className="text-gray-600 text-sm mb-1">{modelData[model].description}</p>
              <p className="text-gray-600 text-sm mb-2">Size: {modelData[model].size}</p>
              <p className="font-bold text-lg" style={{ color: '#797c67' }}>
                {formatCurrency(modelData[model].price)}
              </p>
            </div>
            
            {/* Nightly Rate */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
                Base Nightly Rate (Peak +20% automatically applied)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#797c67' }}
                  min="0"
                  step="10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Blue Mountains average: $220-$280 
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 underline"
                  style={{ color: '#797c67' }}
                >
                  (Source: AirDNA)
                </a>
              </p>
            </div>
            
            {/* Average Stay Length */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
                Average Length of Stay (nights)
              </label>
              <input
                type="number"
                value={averageStayLength}
                onChange={(e) => setAverageStayLength(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#797c67' }}
                min="1"
                step="0.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Blue Mountains average: 2-3 nights
              </p>
            </div>
            
            {/* Peak Season Occupancy */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
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
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Blue Mountains peak average: 76-85%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                  style={{ color: '#797c67' }}
                >
                  Source: AirDNA Blue Mountains Market Data
                </a>
              </p>
            </div>
            
            {/* Off-Peak Occupancy */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
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
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>Blue Mountains off-peak average: 35-45%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline"
                  style={{ color: '#797c67' }}
                >
                  Source: AirDNA Seasonal Trends
                </a>
              </p>
            </div>
            
            {/* Peak Season Days */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
                Peak Season Days (Summer, holidays, events)
              </label>
              <input
                type="number"
                value={peakSeasonDays}
                onChange={(e) => setPeakSeasonDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#797c67' }}
                min="0"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">Blue Mountains peak: Dec-Feb, Easter, long weekends</p>
            </div>
            
            {/* Cleaning Fee */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
                Cleaning Fee per Stay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': '#797c67' }}
                  min="0"
                  step="5"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Charged per booking, not per night. Blue Mountains average: $60-85
              </p>
            </div>
            
            {/* Personal Use */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>
                Your Personal Use (days per year)
              </label>
              <input
                type="number"
                value={personalUse}
                onChange={(e) => setPersonalUse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#797c67' }}
                min="0"
                max="365"
              />
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white rounded-lg p-6 shadow-sm" style={{ borderLeft: '4px solid #797c67' }}>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732' }}>
              Your ROI Projection
            </h3>
            
            {/* Key Metrics */}
            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#797c67' }}>
                <p className="text-sm text-gray-600 mb-1">Annual Revenue</p>
                <p className="text-2xl font-bold" style={{ color: '#797c67' }}>
                  {formatCurrency(results.annualRevenue)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#797c67' }}>
                <p className="text-sm text-gray-600 mb-1">Net Annual Income</p>
                <p className="text-2xl font-bold" style={{ color: '#424732' }}>
                  {formatCurrency(results.netIncome)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border" style={{ borderColor: '#797c67' }}>
                <p className="text-sm text-gray-600 mb-1">Payback Period</p>
                <p className="text-2xl font-bold" style={{ color: '#797c67' }}>
                  {results.paybackYears.toFixed(1)} years
                </p>
              </div>
            </div>
            
            {/* Future Returns */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#797c67' }}>
                <p className="text-sm text-gray-600 mb-1">5-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: '#797c67' }}>
                  {formatCurrency(results.fiveYearProfit)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm border" style={{ borderColor: '#797c67' }}>
                <p className="text-sm text-gray-600 mb-1">10-Year Profit</p>
                <p className="text-lg font-bold" style={{ color: '#797c67' }}>
                  {formatCurrency(results.tenYearProfit)}
                </p>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6 border" style={{ borderColor: '#797c67' }}>
              <h4 className="font-semibold mb-3" style={{ color: '#424732' }}>Annual Breakdown</h4>
              <div className="space-y-2 text-sm">
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
                <div className="flex justify-between text-red-600">
                  <span>Annual Expenses</span>
                  <span>-{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold" style={{ color: '#797c67' }}>
                  <span>Net Income</span>
                  <span>{formatCurrency(results.netIncome)}</span>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <button
              onClick={() => setShowContact(true)}
              className="w-full font-bold py-3 px-4 rounded-lg transition duration-200 hover:opacity-90"
              style={{ backgroundColor: '#797c67', color: '#ecebe4' }}
            >
              Get Your Free Site Assessment
            </button>
            
            {/* Western Sydney Airport Note */}
            <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: '#f7f7f4', border: '1px solid #797c67' }}>
              <p className="text-sm" style={{ color: '#424732' }}>
                <strong>Future Opportunity:</strong> Western Sydney Airport opens in 2026. 
                Blue Mountains accommodation demand projected to increase 15-20%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Blue Mountains Context */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm" style={{ borderTop: '4px solid #797c67' }}>
          <h3 className="text-xl font-semibold mb-3" style={{ color: '#424732' }}>Why Blue Mountains?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold" style={{ color: '#797c67' }}>3.2M Annual Visitors</p>
              <p style={{ color: '#424732' }}>Generating $1.1B in tourism revenue</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#797c67' }}>UNESCO World Heritage</p>
              <p style={{ color: '#424732' }}>Premium eco-tourism destination</p>
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#797c67' }}>Accommodation Shortage</p>
              <p style={{ color: '#424732' }}>Growing demand, limited supply</p>
            </div>
          </div>
        </div>
        
        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#424732' }}>
                Get Your Free Site Assessment
              </h3>
              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#797c67' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#797c67' }}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#424732' }}>Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                    style={{ '--tw-ring-color': '#797c67' }}
                  />
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Selected Model: <strong className="capitalize">{model}</strong> 
                    {' '}({formatCurrency(modelData[model].price)})
                  </p>
                  <p className="text-sm text-gray-600">
                    Projected Annual Income: <strong>{formatCurrency(results.netIncome)}</strong>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-md hover:opacity-90"
                    style={{ backgroundColor: '#797c67', color: '#ecebe4' }}
                  >
                    Get Assessment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
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
            background: #797c67;
            cursor: pointer;
          }
          
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #797c67;
            cursor: pointer;
            border: none;
          }
          
          input:focus {
            ring-color: #797c67;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TallTinyROICalculator;