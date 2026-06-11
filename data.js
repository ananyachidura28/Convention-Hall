/**
 * Mock Database for Function Hall Booking Application
 * Contains sample halls, regions, reviews, and coupon codes.
 */

const REGIONS_DATA = [
  { id: 'hyderabad', name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1608958223696-22441a182743?auto=format&fit=crop&w=600&q=80', description: 'The City of Pearls & Royal Banquets' },
  { id: 'bengaluru', name: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', description: 'Tech Capital with Elegant Gardens & Luxury Convention Halls' },
  { id: 'chennai', name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', description: 'Gateway to South Indian Traditional & Modern Halls' },
  { id: 'visakhapatnam', name: 'Visakhapatnam', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80', description: 'Scenic Coastal City for Beach-view Events' },
  { id: 'vijayawada', name: 'Vijayawada', image: 'https://images.unsplash.com/photo-1622323861596-f61b7fcf76eb?auto=format&fit=crop&w=600&q=80', description: 'Bustling Event Hub on the Banks of Krishna River' },
  { id: 'tirupati', name: 'Tirupati', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80', description: 'Spiritual City Perfect for Traditional Marriages' },
  { id: 'guntur', name: 'Guntur', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', description: 'Rapidly Growing City with Premium Convention Center Tiers' }
];

const EVENT_CATEGORIES = {
  'Marriage': { label: 'Marriage', baseFactor: 1.0, icon: '💍' },
  'Reception': { label: 'Reception', baseFactor: 0.85, icon: '✨' },
  'Engagement': { label: 'Engagement', baseFactor: 0.6, icon: '🤝' },
  'Birthday Party': { label: 'Birthday Party', baseFactor: 0.35, icon: '🎂' },
  'Baby Shower': { label: 'Baby Shower', baseFactor: 0.3, icon: '👶' },
  'Naming Ceremony': { label: 'Naming Ceremony', baseFactor: 0.3, icon: '🏷️' },
  'Corporate Event': { label: 'Corporate Event', baseFactor: 0.75, icon: '💼' },
  'Conference': { label: 'Conference', baseFactor: 0.65, icon: '🎤' },
  'Anniversary': { label: 'Anniversary', baseFactor: 0.45, icon: '🥂' },
  'Cultural Event': { label: 'Cultural Event', baseFactor: 0.55, icon: '🎭' }
};

const ADDITIONAL_SERVICES = {
  'catering': { label: 'Premium Catering (per guest)', price: 450, unit: 'guest' },
  'decoration': { label: 'Luxury Floral & Theme Decoration', price: 25000, unit: 'flat' },
  'photography': { label: 'Professional Photography & Album', price: 15000, unit: 'flat' },
  'videography': { label: 'Cinematic Videography & Drone', price: 20000, unit: 'flat' },
  'dj': { label: 'Premium DJ & Sound System', price: 12000, unit: 'flat' },
  'flower': { label: 'Traditional Flower Decoration', price: 8000, unit: 'flat' }
};

const COUPONS = {
  'WELCOME10': { type: 'percentage', value: 10, minBooking: 10000 },
  'FESTIVE20': { type: 'percentage', value: 20, minBooking: 50000 },
  'SUPERSAVER': { type: 'flat', value: 15000, minBooking: 100000 }
};

const HALLS_DATA = [
  {
    id: 1,
    name: 'The Grand Palace Convention Center',
    region: 'hyderabad',
    city: 'Hyderabad',
    address: 'Road No. 2, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91 98765 43210',
    email: 'info@grandpalace.com',
    rating: 4.8,
    reviewsCount: 128,
    capacity: 1200,
    price: 120000, // baseline Marriage price
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy video link
    ac: true,
    parking: 250,
    rooms: 12,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'The Grand Palace Convention Center is Hyderabad\'s premier luxury banquet venue, designed for high-profile weddings, grand receptions, and large-scale corporate summits. Featuring stunning double-height ceilings, glass chandeliers, premium acoustic paneling, and an expansive pre-function area, we provide a majestic backdrop for your unforgettable moments.',
    bookedDates: ['2026-06-12', '2026-06-15', '2026-06-20', '2026-07-04', '2026-07-05'],
    reviews: [
      { author: 'Rahul Sharma', rating: 5, date: '2026-05-15', text: 'Hosting my sister\'s wedding here was a dream! The decor was majestic and the parking management handled 200+ cars flawlessly.' },
      { author: 'Sneha Reddy', rating: 4, date: '2026-05-02', text: 'Excellent venue with high-class facilities. Staff is extremely professional, though pricing is on the premium side.' }
    ]
  },
  {
    id: 2,
    name: 'Glow Gardens Banquets',
    region: 'bengaluru',
    city: 'Bengaluru',
    address: 'Outer Ring Rd, Marathahalli, Bengaluru, Karnataka 560037',
    phone: '+91 87654 32109',
    email: 'events@glowgardens.com',
    rating: 4.6,
    reviewsCount: 94,
    capacity: 700,
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507504038482-7621c3564c93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 120,
    rooms: 6,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'Immerse your guests in a lush garden atmosphere blended with contemporary indoor comfort. Glow Gardens features a climate-controlled banquet hall combined with an outdoor lawn area, ideal for evening receptions, pre-wedding cocktail parties, and vibrant cultural gatherings.',
    bookedDates: ['2026-06-14', '2026-06-18', '2026-06-25', '2026-07-10'],
    reviews: [
      { author: 'Abhishek Roy', rating: 5, date: '2026-04-20', text: 'Beautiful blend of lawn and AC hall. The lighting setup at night is breathtaking.' },
      { author: 'Meera Krishnan', rating: 4, date: '2026-04-18', text: 'Spacious rooms, neat lawn, and prompt catering. Very cooperative management.' }
    ]
  },
  {
    id: 3,
    name: 'Sagar Tarang Beach Hall',
    region: 'visakhapatnam',
    city: 'Visakhapatnam',
    address: 'Beach Road, Lawson\'s Bay Colony, Visakhapatnam, Andhra Pradesh 530017',
    phone: '+91 76543 21098',
    email: 'contact@sagartarang.com',
    rating: 4.5,
    reviewsCount: 82,
    capacity: 400,
    price: 60000,
    images: [
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 80,
    rooms: 8,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'Sagar Tarang Beach Hall offers panoramic vistas of the Bay of Bengal. Watch the sunset while celebrating engagements, birthdays, or corporate events. The hall is soundproofed and features a high-end seaside terrace for dining.',
    bookedDates: ['2026-06-10', '2026-06-12', '2026-06-27', '2026-07-12'],
    reviews: [
      { author: 'Kalyan C.', rating: 4, date: '2026-05-10', text: 'Fabulous ocean views from the terrace! Our anniversary party was a super hit. Perfect size for mid-sized events.' }
    ]
  },
  {
    id: 4,
    name: 'Royal Heritage Convention Hall',
    region: 'vijayawada',
    city: 'Vijayawada',
    address: 'MG Road, Labbipet, Vijayawada, Andhra Pradesh 520010',
    phone: '+91 65432 10987',
    email: 'bookings@royalheritage.com',
    rating: 4.7,
    reviewsCount: 112,
    capacity: 1000,
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 200,
    rooms: 15,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'Experience palatial luxury on MG Road. Royal Heritage is themed with traditional Indian architectural pillars and modern ambient lighting systems. It features multiple changing suites and an expansive dining hall that seats up to 400 people concurrently.',
    bookedDates: ['2026-06-11', '2026-06-20', '2026-06-21', '2026-07-18'],
    reviews: [
      { author: 'Venkatesh Rao', rating: 5, date: '2026-05-22', text: 'Outstanding service. The food catered by their team was authentic and delicious.' }
    ]
  },
  {
    id: 5,
    name: 'Sri Venkateswara Prasada Hall',
    region: 'tirupati',
    city: 'Tirupati',
    address: 'Alipiri Bypass Road, Tirupati, Andhra Pradesh 517501',
    phone: '+91 54321 09876',
    email: 'manager@svphall.com',
    rating: 4.4,
    reviewsCount: 145,
    capacity: 600,
    price: 50000,
    images: [
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: false, // Non-AC option
    parking: 150,
    rooms: 10,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: false, // quiet traditional hall
    description: 'A serene and traditional function hall located right at the foot of Tirumala Hills, perfect for holy marriages, upanayanams, and traditional family events. We follow eco-friendly principles and provide dedicated lodging facilities for visiting pilgrims.',
    bookedDates: ['2026-06-09', '2026-06-10', '2026-06-15', '2026-06-22', '2026-06-30'],
    reviews: [
      { author: 'Madhavan G.', rating: 5, date: '2026-05-18', text: 'Cleanest traditional hall in Tirupati. Traditional decor packages are highly authentic.' }
    ]
  },
  {
    id: 6,
    name: 'Chola Grand Ballroom',
    region: 'chennai',
    city: 'Chennai',
    address: 'OMR, Karapakkam, Chennai, Tamil Nadu 600097',
    phone: '+91 99988 77665',
    email: 'cholagrand@eventvenues.in',
    rating: 4.7,
    reviewsCount: 88,
    capacity: 800,
    price: 90000,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 180,
    rooms: 8,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'Bringing classical aesthetics and IT corridor convenience together. Chola Grand Ballroom boasts high ceilings, sound insulation, massive LED media walls, and an internal gourmet catering setup. Ideal for luxury corporate events and opulent south Indian weddings.',
    bookedDates: ['2026-06-19', '2026-06-20', '2026-07-12', '2026-07-13'],
    reviews: [
      { author: 'Karthik Raja', rating: 5, date: '2026-05-10', text: 'Very impressive acoustics. Sound system was amazing. Ideal for corporate events!' }
    ]
  },
  {
    id: 7,
    name: 'Amaravati Pride Convention',
    region: 'guntur',
    city: 'Guntur',
    address: 'Narakodur Road, Guntur, Andhra Pradesh 522002',
    phone: '+91 99443 32211',
    email: 'amaravati@pridehalls.com',
    rating: 4.3,
    reviewsCount: 54,
    capacity: 1500,
    price: 110000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507504038482-7621c3564c93?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 300,
    rooms: 10,
    catering: true,
    decoration: false, // customizable
    generator: true,
    stage: true,
    dj: true,
    description: 'Amaravati Pride is the largest convention facility in the Guntur region, offering a seating capacity of up to 1500 guests. With its sprawling lawn area, modern dining pavilion, and customizable staging options, it has hosted numerous grand political gatherings and high-capacity weddings.',
    bookedDates: ['2026-06-15', '2026-06-25', '2026-07-22'],
    reviews: [
      { author: 'Chandra Mouli', rating: 4, date: '2026-04-12', text: 'Huge hall. Dining hall can easily serve 500 people at once. Highly recommended for mega weddings.' }
    ]
  },
  {
    id: 8,
    name: 'Orchid Banquet & Conference Hall',
    region: 'bengaluru',
    city: 'Bengaluru',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560008',
    phone: '+91 88877 66554',
    email: 'orchid@indiranagarbanquets.com',
    rating: 4.8,
    reviewsCount: 76,
    capacity: 250,
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 40,
    rooms: 4,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'An elite boutique banquet hall located in the heart of Indiranagar. Orchid is tailored for premium close-knit birthday bashes, corporate workshops, elegant engagement ceremonies, and naming ceremonies. The venue boasts chic interior design, smart projectors, and premium sound stages.',
    bookedDates: ['2026-06-11', '2026-06-14', '2026-06-15', '2026-06-28'],
    reviews: [
      { author: 'Ananya Hegde', rating: 5, date: '2026-05-30', text: 'Exquisite modern interiors. Perfect spot for my daughter\'s naming ceremony.' }
    ]
  },
  {
    id: 9,
    name: 'Sanskriti Heritage Bhavan',
    region: 'hyderabad',
    city: 'Hyderabad',
    address: 'Near Shilparamam, Hitech City, Hyderabad, Telangana 500081',
    phone: '+91 99000 88776',
    email: 'sanskriti@heritagebanquets.com',
    rating: 4.6,
    reviewsCount: 105,
    capacity: 900,
    price: 80000,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507504038482-7621c3564c93?auto=format&fit=crop&w=800&q=80'
    ],
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ac: true,
    parking: 150,
    rooms: 8,
    catering: true,
    decoration: true,
    generator: true,
    stage: true,
    dj: true,
    description: 'Beautifully blending rustic heritage design elements with modern technological facilities. Sanskriti Heritage Bhavan features beautiful stone pillars, clay-tiled roofs in dining areas, and a massive AC hall that is ideal for traditional family events right in the Hitech City hub.',
    bookedDates: ['2026-06-12', '2026-06-13', '2026-06-18', '2026-07-01'],
    reviews: [
      { author: 'Prasad Reddy', rating: 5, date: '2026-05-28', text: 'Classic look, but fully air-conditioned and highly functional. The courtyard is lovely.' }
    ]
  }
];

// Helper functions for localized storage access
function getStoredBookings() {
  const bkgs = localStorage.getItem('function_hall_bookings');
  return bkgs ? JSON.parse(bkgs) : [];
}

function saveBooking(booking) {
  const bkgs = getStoredBookings();
  bkgs.push(booking);
  localStorage.setItem('function_hall_bookings', JSON.stringify(bkgs));
}

function getStoredFavorites() {
  const favs = localStorage.getItem('function_hall_favorites');
  return favs ? JSON.parse(favs) : [];
}

function toggleFavorite(id) {
  let favs = getStoredFavorites();
  const index = favs.indexOf(id);
  if (index === -1) {
    favs.push(id);
  } else {
    favs.splice(index, 1);
  }
  localStorage.setItem('function_hall_favorites', JSON.stringify(favs));
  return favs.includes(id);
}

function getStoredVisits() {
  const visits = localStorage.getItem('function_hall_visits');
  return visits ? JSON.parse(visits) : [];
}

function saveVisitRequest(visit) {
  const visits = getStoredVisits();
  visits.push(visit);
  localStorage.setItem('function_hall_visits', JSON.stringify(visits));
}

function getStoredUser() {
  const user = localStorage.getItem('function_hall_user');
  return user ? JSON.parse(user) : null;
}

function setUserSession(user) {
  localStorage.setItem('function_hall_user', JSON.stringify(user));
}

function clearUserSession() {
  localStorage.removeItem('function_hall_user');
}
