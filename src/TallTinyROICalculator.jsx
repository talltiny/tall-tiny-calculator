import React, { useState, useEffect } from 'react';
import './styles.css'; // Import styles

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
  
  return (
    <div className="min-h-screen bg-neutral-lighter font-body">
      <div className="max-w-lg mx-auto py-large px-medium">
        {/* Header with Logo */}
        <header className="text-center mb-medium">
          <div className="mb-xsmall">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-16 md:h-20"
              />
            </a>
          </div>
          
          {/* Added Investment Calculator Title */}
          <h1 className="text-h2 font-light text-neutral-darkest mb-medium">
            Investment Calculator
          </h1>
          
          {/* Hero Image */}
          <div className="rounded-standard overflow-hidden mb-medium shadow-medium">
            <img 
              src="/assets/talltiny-residence-ribbongum.png" 
              alt="Tall Tiny Residence in Ribbon Gum" 
              className="w-full"
            />
          </div>
          
          <h2 className="text-h3 font-light text-neutral-darkest mb-xxsmall">
            Your Backyard, Your Guest House
          </h2>
          <p className="text-large mb-small text-neutral-darkest">
            Sustainable accommodation that pays for itself
          </p>
          
          {/* New intro text */}
          <div className="max-w-md mx-auto mb-medium text-regular text-neutral-darkest">
            <p className="mb-xxsmall">
              This Return on Investment calculator helps Blue Mountains homeowners estimate the potential income from a Tall Tiny guest house on their property.
            </p>
            <p className="mb-xxsmall">
              Our luxury tiny homes require no council approval and can be delivered in just 12 weeks, allowing you to transform your backyard into a revenue-generating guest accommodation that pays for itself while providing a unique experience for visitors.
            </p>
            <p>
              Simply adjust the parameters below to see what your potential return could be with a Tall Tiny home placed on your property.
            </p>
          </div>
          
          <div className="bg-white border rounded-standard p-xxsmall inline-block border-tt-timber">
            <p className="text-tt-timber">
              ✓ No Council Approval Required ✓ Ready Before Summer ✓ 12-Week Delivery
            </p>
          </div>
        </header>
        
        {/* Model Selection */}
        <section className="mb-large">
          <h2 className="text-h4 font-light text-neutral-darkest mb-small text-center">
            Choose Your Tiny Home Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modelData).map(([key, data]) => (
              <div
                key={key}
                onClick={() => handleModelChange(key)}
                className={`border-2 rounded-standard p-xxsmall cursor-pointer transition-all bg-white ${
                  model === key 
                    ? 'border-tt-timber bg-neutral-lightest' 
                    : 'border-neutral-light hover:border-neutral'
                }`}
              >
                {/* Model Image */}
                <div className="mb-xxsmall h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src={data.image} 
                    alt={`${key} model`} 
                    className="object-contain h-full w-full"
                  />
                </div>
                <h3 className="font-semibold capitalize text-large mb-tiny text-neutral-darkest">
                  {key}
                </h3>
                <p className="text-small text-neutral mb-tiny">{data.size}</p>
                <p className="text-small text-neutral mb-tiny">{data.features}</p>
                <p className="font-bold text-tt-timber">
                  {formatCurrency(data.price)}
                </p>
                <p className="text-tiny text-neutral-light mt-tiny">
                  Suggested nightly rate: {formatCurrency(data.suggestedRate)}
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-standard p-medium shadow-small">
            <h3 className="text-h5 font-light text-neutral-darkest mb-small">
              Your Investment Details
            </h3>
            
            {/* Selected Model Info */}
            <div className="bg-light-card-bg rounded-standard p-xxsmall mb-medium border border-light-card-border">
              <div className="flex items-center">
                <div className="flex-1">
                  <h4 className="font-semibold text-large capitalize mb-tiny text-neutral-darkest">
                    {model} Model
                  </h4>
                  <p className="text-neutral text-small mb-tiny">{modelData[model].description}</p>
                  <p className="text-neutral text-small mb-tiny">Size: {modelData[model].size}</p>
                  <p className="font-bold text-large text-tt-timber">
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
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Base Nightly Rate (Peak +20% automatically applied)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral">$</span>
                <input
                  type="number"
                  value={nightlyRate}
                  onChange={(e) => setNightlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  min="0"
                  step="10"
                />
              </div>
              <p className="text-tiny text-neutral-light mt-tiny">
                Blue Mountains average: $220-$280 
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 underline text-tt-timber"
                >
                  (Source: AirDNA)
                </a>
              </p>
            </div>
            
            {/* Average Stay Length */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Average Length of Stay (nights)
              </label>
              <input
                type="number"
                value={averageStayLength}
                onChange={(e) => setAverageStayLength(Number(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                min="1"
                step="0.5"
              />
              <p className="text-tiny text-neutral-light mt-tiny">
                Blue Mountains average: 2-3 nights
              </p>
            </div>
            
            {/* Peak Season Occupancy */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Peak Season Occupancy: {peakOccupancy}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={peakOccupancy}
                onChange={(e) => setPeakOccupancy(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-tiny text-neutral-light mt-tiny">
                <span>0%</span>
                <span>Blue Mountains peak average: 76-85%</span>
                <span>100%</span>
              </div>
              <p className="text-tiny text-neutral-light mt-tiny">
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-tt-timber"
                >
                  Source: AirDNA Blue Mountains Market Data
                </a>
              </p>
            </div>
            
            {/* Off-Peak Occupancy */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Off-Peak Occupancy: {offPeakOccupancy}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={offPeakOccupancy}
                onChange={(e) => setOffPeakOccupancy(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-tiny text-neutral-light mt-tiny">
                <span>0%</span>
                <span>Blue Mountains off-peak average: 35-45%</span>
                <span>100%</span>
              </div>
              <p className="text-tiny text-neutral-light mt-tiny">
                <a 
                  href="https://www.airdna.co/vacation-rental-data/app/au/new-south-wales/blue-mountains/overview" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline text-tt-timber"
                >
                  Source: AirDNA Seasonal Trends
                </a>
              </p>
            </div>
            
            {/* Peak Season Days */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Peak Season Days (Summer, holidays, events)
              </label>
              <input
                type="number"
                value={peakSeasonDays}
                onChange={(e) => setPeakSeasonDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                min="0"
                max="365"
              />
              <p className="text-tiny text-neutral-light mt-tiny">Blue Mountains peak: Dec-Feb, Easter, long weekends</p>
            </div>
            
            {/* Cleaning Fee */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Cleaning Fee per Stay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral">$</span>
                <input
                  type="number"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  min="0"
                  step="5"
                />
              </div>
              <p className="text-tiny text-neutral-light mt-tiny">
                Charged per booking, not per night. Blue Mountains average: $60-85
              </p>
            </div>
            
            {/* Personal Use */}
            <div className="mb-small">
              <label className="block text-small font-medium mb-tiny text-neutral-darkest">
                Your Personal Use (days per year)
              </label>
              <input
                type="number"
                value={personalUse}
                onChange={(e) => setPersonalUse(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                min="0"
                max="365"
              />
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="bg-white rounded-standard p-medium shadow-small border-l-4 border-tt-timber">
            <h3 className="text-h5 font-light text-neutral-darkest mb-small">
              Your ROI Projection
            </h3>
            
            {/* Key Metrics */}
            <div className="space-y-small mb-medium">
              <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border">
                <p className="text-small text-neutral mb-tiny">Annual Revenue</p>
                <p className="text-h4 font-light text-tt-timber">
                  {formatCurrency(results.annualRevenue)}
                </p>
              </div>
              
              <div 
                className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border cursor-pointer"
                onClick={toggleExpenses}
              >
                <div className="flex justify-between items-center">
                  <p className="text-small text-neutral mb-tiny">
                    Annual Expenses <span className="text-tiny text-neutral-light">(click to view details)</span>
                  </p>
                  <span>{showExpenses ? '▲' : '▼'}</span>
                </div>
                <p className="text-h4 font-light text-neutral-darkest">
                  {formatCurrency(results.annualExpenses)}
                </p>
                
                {/* Expense Breakdown */}
                {showExpenses && (
                  <div className="mt-xxsmall pt-xxsmall border-t border-light-card-border">
                    <div className="space-y-tiny">
                      {Object.entries(results.breakdownDetails.annualExpenses || {}).map(([key, value]) => {
                        if (key !== 'total' && key !== 'cleaning' && value > 0) {
                          return (
                            <div key={key} className="flex justify-between text-small">
                              <span className="capitalize">{key}</span>
                              <span>{formatCurrency(value)}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border">
                <p className="text-small text-neutral mb-tiny">Net Annual Income</p>
                <p className="text-h4 font-light text-tt-timber">
                  {formatCurrency(results.netIncome)}
                </p>
              </div>
              
              <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border">
                <p className="text-small text-neutral mb-tiny">Payback Period</p>
                <p className="text-h4 font-light text-tt-timber">
                  {results.paybackYears.toFixed(1)} years
                </p>
              </div>
            </div>
            
            {/* Future Returns */}
            <div className="grid grid-cols-2 gap-4 mb-medium">
              <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border">
                <p className="text-small text-neutral mb-tiny">5-Year Profit</p>
                <p className="text-large font-semibold text-tt-timber">
                  {formatCurrency(results.fiveYearProfit)}
                </p>
              </div>
              <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall border border-light-card-border">
                <p className="text-small text-neutral mb-tiny">10-Year Profit</p>
                <p className="text-large font-semibold text-tt-timber">
                  {formatCurrency(results.tenYearProfit)}
                </p>
              </div>
            </div>
            
            {/* Revenue Breakdown */}
            <div className="bg-light-card-bg rounded-standard p-xxsmall shadow-xxsmall mb-medium border border-light-card-border">
              <h4 className="text-medium font-semibold mb-xxsmall text-neutral-darkest">Annual Breakdown</h4>
              <div className="space-y-tiny text-small">
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
                <div className="border-t pt-tiny flex justify-between font-semibold">
                  <span>Total Revenue</span>
                  <span>{formatCurrency(results.annualRevenue)}</span>
                </div>
                <div className="flex justify-between text-tt-timber">
                  <span>Annual Expenses</span>
                  <span>-{formatCurrency(results.annualExpenses)}</span>
                </div>
                <div className="border-t pt-tiny flex justify-between font-bold text-tt-timber">
                  <span>Net Income</span>
                  <span>{formatCurrency(results.netIncome)}</span>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="space-y-xxsmall">
              <button
                onClick={() => setShowContact(true)}
                className="w-full font-bold py-xxsmall px-small rounded-button transition hover:opacity-90 bg-tt-green text-white"
              >
                Get Your Free Site Assessment
              </button>
              
              <button
                onClick={() => setShowDownloadForm(true)}
                className="w-full font-bold py-xxsmall px-small rounded-button transition hover:opacity-90 border border-tt-green text-tt-green bg-white"
              >
                Download Our Tech Specs
              </button>
              
              <a
                href="https://calendly.com/hello-talltiny/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full font-bold py-xxsmall px-small rounded-button transition hover:opacity-90 text-center bg-tt-timber text-white"
              >
                Let's Chat!
              </a>
            </div>
            
            {/* Western Sydney Airport Note */}
            <div className="mt-small rounded-standard p-xxsmall bg-neutral-lightest border border-tt-timber">
              <p className="text-small text-neutral-darkest">
                <strong>Future Opportunity:</strong> Western Sydney Airport opens in 2026. 
                Blue Mountains accommodation demand projected to increase 15-20%.
              </p>
            </div>
          </div>
        </div>
        
        {/* Updated Blue Mountains Context */}
        <div className="mt-large bg-white rounded-standard p-medium shadow-small border-t-4 border-tt-timber">
          <h3 className="text-h5 font-light text-neutral-darkest mb-xxsmall">
            Why Invest In A Tiny Home in The Blue Mountains
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-small">
            <div>
              <p className="font-semibold text-tt-timber">3.2M Annual Visitors</p>
              <p className="text-neutral-darkest">Generating $1.1B in tourism revenue</p>
            </div>
            <div>
              <p className="font-semibold text-tt-timber">UNESCO World Heritage</p>
              <p className="text-neutral-darkest">Premium eco-tourism destination</p>
            </div>
            <div>
              <p className="font-semibold text-tt-timber">Accommodation Shortage</p>
              <p className="text-neutral-darkest">Growing demand, limited supply</p>
            </div>
          </div>
        </div>
        
        {/* Added Website Link Section */}
        <div className="mt-large relative rounded-standard overflow-hidden shadow-large">
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
              className="px-medium py-xxsmall bg-white bg-opacity-90 rounded-standard text-h4 font-light transition-transform transform hover:scale-105 text-neutral-darkest"
            >
              Explore Our Website & Guides
            </a>
          </div>
        </div>
        
        {/* Contact Modal */}
        {showContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-standard p-medium max-w-md w-full mx-4">
              <h3 className="text-h5 font-light text-neutral-darkest mb-small">
                Get Your Free Site Assessment
              </h3>
              <form 
                name="site-assessment" 
                method="POST" 
                data-netlify="true"
                onSubmit={handleContactSubmit}
              >
                <input type="hidden" name="form-name" value="site-assessment" />
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <div className="mb-small">
                  <p className="text-small text-neutral">
                    Selected Model: <strong className="capitalize">{model}</strong> 
                    {' '}({formatCurrency(modelData[model].price)})
                  </p>
                  <p className="text-small text-neutral">
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
                    className="flex-1 px-small py-tiny border border-neutral-light rounded-button hover:bg-neutral-lighter"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-small py-tiny rounded-button hover:opacity-90 bg-tt-green text-white"
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
            <div className="bg-white rounded-standard p-medium max-w-md w-full mx-4">
              <h3 className="text-h5 font-light text-neutral-darkest mb-small">
                Download Technical Specifications
              </h3>
              <form 
                name="tech-specs-download" 
                method="POST" 
                data-netlify="true"
                onSubmit={handleDownloadSubmit}
              >
                <input type="hidden" name="form-name" value="tech-specs-download" />
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <div className="mb-small">
                  <label className="block text-small font-medium mb-tiny text-neutral-darkest">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-xxsmall py-tiny border border-neutral rounded-button focus:outline-none focus:border-tt-green"
                  />
                </div>
                <input type="hidden" name="requestType" value="Tech Specs Download" />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDownloadForm(false)}
                    className="flex-1 px-small py-tiny border border-neutral-light rounded-button hover:bg-neutral-lighter"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-small py-tiny rounded-button hover:opacity-90 bg-tt-green text-white"
                  >
                    Download Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Updated Footer with Phone Number */}
        <footer className="mt-xlarge pt-medium border-t border-neutral-light text-center">
          <div className="mb-small">
            <a href="https://talltiny.com.au" target="_blank" rel="noopener noreferrer">
              <img 
                src="/assets/talltiny-logo.png" 
                alt="Tall Tiny Logo" 
                className="mx-auto h-12"
              />
            </a>
          </div>
          <div className="mb-small text-small text-neutral-darkest">
            <p>39 Park St, Lawson, NSW 2783</p>
            <p>
              <a href="mailto:hello@talltiny.com.au" className="underline hover:text-tt-timber">hello@talltiny.com.au</a>
            </p>
            <p>
              <a href="tel:0400755135" className="underline hover:text-tt-timber">0400 755 135</a>
            </p>
          </div>
          <div className="text-tiny text-neutral-light">
            <p>&copy; {new Date().getFullYear()} Tall Tiny. All rights reserved.</p>
            <p>
              <a href="https://talltiny.com.au/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-tt-timber">Privacy Policy</a>
              {' | '}
              <a href="https://talltiny.com.au/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-tt-timber">Terms of Service</a>
            </p>
          </div>
        </footer>
        
        {/* Disclaimer */}
        <div className="mt-large text-center">
          <p className="text-tiny text-neutral-light">
            * ROI calculations are estimates based on current Blue Mountains market conditions. 
            Actual results may vary based on location, property setup, marketing effectiveness, and market changes.
            Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallTinyROICalculator;