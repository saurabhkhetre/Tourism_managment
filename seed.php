<?php
/**
 * TravelVista — Database Seeder (PHP/MySQL)
 * Populates the MySQL database with initial mock data.
 * Run: Open http://localhost/travelvista/seed.php in browser, or `php seed.php` from CLI.
 */

require_once __DIR__ . '/config/database.php';

$db = getDB();

// Check if already seeded
$count = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
if ($count > 0) {
    echo "<h2>✅ Database already seeded. Skipping.</h2>";
    echo "<p><a href='index.html'>Go to TravelVista →</a></p>";
    exit;
}

echo "<h2>🌱 Seeding TravelVista Database...</h2>";

// ── USERS ────────────────────────────────────────────────────
$users = [
    ['Saurabh Khetre', 'khetresaurabh.work@gmail.com', password_hash('Saurabh@2971', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543210', 'admin',
     'https://ui-avatars.com/api/?name=Saurabh+Khetre&background=0891b2&color=fff&size=100',
     '2025-12-01', 1],
    ['Rahul Sharma', 'rahul@example.com', password_hash('user123', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543211', 'user',
     'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
     '2026-01-10', 1],
    ['Priya Patel', 'priya@example.com', password_hash('user123', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543212', 'user',
     'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
     '2026-01-15', 1],
    ['Amit Kumar', 'amit@example.com', password_hash('user123', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543213', 'user',
     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
     '2026-01-20', 1],
    ['Sneha Desai', 'sneha@example.com', password_hash('user123', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543214', 'user',
     'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
     '2026-02-01', 1],
    ['Vikram Singh', 'vikram@example.com', password_hash('user123', PASSWORD_BCRYPT, ['cost' => 4]),
     '+91 9876543215', 'user',
     'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
     '2026-02-10', 0],
];

$stmt = $db->prepare("INSERT INTO users (name, email, password, phone, role, avatar, joined_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($users as $u) { $stmt->execute($u); }
echo "<p>✅ Users seeded (6 users)</p>";

// ── IMAGES ───────────────────────────────────────────────────
$IMAGES = [
    'goa'       => 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    'kashmir'   => 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    'kerala'    => 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    'rajasthan' => 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    'manali'    => 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    'andaman'   => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'ladakh'    => 'https://images.unsplash.com/photo-1626015365107-3983b5765995?w=800&q=80',
    'shimla'    => 'https://images.unsplash.com/photo-1597074866923-dc0589150458?w=800&q=80',
    'varanasi'  => 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    'rishikesh' => 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    'udaipur'   => 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'ooty'      => 'https://images.unsplash.com/photo-1574233488155-6fe6e2e6c74f?w=800&q=80',
];

// ── PACKAGES ─────────────────────────────────────────────────
$packages = [
    ['Magical Goa Beach Getaway', 'Goa, India', '4 Days / 3 Nights', 12999, 18999, 20, 4.7, 234,
     $IMAGES['goa'], json_encode([$IMAGES['goa'], $IMAGES['andaman'], $IMAGES['kerala']]),
     'Beach', 'Experience the vibrant beaches of Goa with our exclusive package. From the serene shores of Palolem to the bustling nightlife of Baga, this trip covers it all.',
     json_encode(['Baga & Calangute Beach Visit', 'Water Sports Adventure', 'Old Goa Heritage Walk', 'Dudhsagar Falls Excursion', 'Sunset River Cruise']),
     json_encode([
         ['day'=>1,'title'=>'Arrival & North Goa','description'=>'Airport pickup, check-in, visit Aguada Fort and Baga Beach'],
         ['day'=>2,'title'=>'Water Sports & Beach','description'=>'Full day of water sports at Calangute, evening market visit'],
         ['day'=>3,'title'=>'South Goa Exploration','description'=>'Dudhsagar Falls, spice plantation, Palolem Beach'],
         ['day'=>4,'title'=>'Heritage & Departure','description'=>'Old Goa churches visit, shopping, airport drop']
     ]),
     json_encode(['3-Star Hotel','Breakfast & Dinner','AC Transport','Sightseeing','Guide']),
     json_encode(['Flights','Personal Expenses','Water Sports Fees']),
     1, 1, '2026-01-15'],

    ['Kashmir Paradise Valley', 'Kashmir, India', '6 Days / 5 Nights', 24999, 34999, 15, 4.9, 189,
     $IMAGES['kashmir'], json_encode([$IMAGES['kashmir'], $IMAGES['ladakh'], $IMAGES['shimla']]),
     'Mountain', 'Discover the heaven on earth with our Kashmir tour package. Float on the serene Dal Lake in a traditional Shikara.',
     json_encode(['Dal Lake Shikara Ride','Gulmarg Gondola','Pahalgam Valley Trek','Mughal Gardens Visit','Houseboat Stay']),
     json_encode([
         ['day'=>1,'title'=>'Srinagar Arrival','description'=>'Airport pickup, houseboat check-in, Shikara ride on Dal Lake'],
         ['day'=>2,'title'=>'Gulmarg Excursion','description'=>'Full day Gulmarg, Gondola ride, snow activities'],
         ['day'=>3,'title'=>'Pahalgam Adventure','description'=>'Drive to Pahalgam, Betaab Valley, Aru Valley'],
         ['day'=>4,'title'=>'Sonmarg Day Trip','description'=>'Visit Thajiwas Glacier, Zoji La viewpoint'],
         ['day'=>5,'title'=>'Srinagar Sightseeing','description'=>'Mughal Gardens, Shankaracharya Temple, local market'],
         ['day'=>6,'title'=>'Departure','description'=>'Morning free time, airport drop']
     ]),
     json_encode(['Deluxe Houseboat','All Meals','Private Car','Sightseeing','Pony Ride']),
     json_encode(['Flights','Gondola Tickets','Personal Expenses']),
     1, 1, '2026-01-20'],

    ['Kerala Backwater Bliss', 'Kerala, India', '5 Days / 4 Nights', 19999, 27999, 18, 4.8, 312,
     $IMAGES['kerala'], json_encode([$IMAGES['kerala'], $IMAGES['ooty']]),
     'Nature', "Explore God's Own Country with our Kerala package. Cruise through the enchanting backwaters of Alleppey.",
     json_encode(['Alleppey Houseboat Cruise','Munnar Tea Gardens','Periyar Wildlife Sanctuary','Kathakali Dance Show','Ayurvedic Spa']),
     json_encode([
         ['day'=>1,'title'=>'Kochi Arrival','description'=>'Airport pickup, Fort Kochi walk, Chinese fishing nets'],
         ['day'=>2,'title'=>'Munnar Hills','description'=>'Drive to Munnar, tea museum, Eravikulam park'],
         ['day'=>3,'title'=>'Thekkady Wildlife','description'=>'Periyar Lake boating, spice garden visit'],
         ['day'=>4,'title'=>'Alleppey Backwaters','description'=>'Full day houseboat cruise, village experience'],
         ['day'=>5,'title'=>'Kochi & Departure','description'=>'Morning shopping, Kathakali show, airport drop']
     ]),
     json_encode(['4-Star Hotels','Houseboat Stay','All Meals','AC Vehicle','Guide']),
     json_encode(['Flights','Boat Tickets','Personal Expenses']),
     1, 1, '2026-01-25'],

    ['Royal Rajasthan Heritage', 'Rajasthan, India', '7 Days / 6 Nights', 29999, 42999, 20, 4.6, 276,
     $IMAGES['rajasthan'], json_encode([$IMAGES['rajasthan'], $IMAGES['udaipur'], $IMAGES['varanasi']]),
     'Heritage', 'Journey through the land of kings and experience the royal heritage of Rajasthan.',
     json_encode(['Jaipur City Palace','Jodhpur Mehrangarh Fort','Udaipur Lake City','Jaisalmer Desert Safari','Traditional Rajasthani Dinner']),
     json_encode([
         ['day'=>1,'title'=>'Jaipur Arrival','description'=>'Airport pickup, evening Hawa Mahal visit'],
         ['day'=>2,'title'=>'Pink City Tour','description'=>'Amber Fort, City Palace, Jantar Mantar'],
         ['day'=>3,'title'=>'Jodhpur Blue City','description'=>'Drive to Jodhpur, Mehrangarh Fort, clock tower'],
         ['day'=>4,'title'=>'Jaisalmer Golden City','description'=>'Drive to Jaisalmer, fort visit, Patwon ki Haveli'],
         ['day'=>5,'title'=>'Desert Experience','description'=>'Camel safari, sand dunes, cultural night'],
         ['day'=>6,'title'=>'Udaipur Lake City','description'=>'Drive to Udaipur, City Palace, Lake Pichola boat'],
         ['day'=>7,'title'=>'Departure','description'=>'Morning free, airport transfer']
     ]),
     json_encode(['Heritage Hotels','Breakfast & Dinner','AC Vehicle','Guide','Desert Safari']),
     json_encode(['Flights','Lunch','Entry Fees']),
     1, 0, '2026-02-01'],

    ['Manali Snow Adventure', 'Manali, Himachal Pradesh', '5 Days / 4 Nights', 15999, 22999, 25, 4.5, 198,
     $IMAGES['manali'], json_encode([$IMAGES['manali'], $IMAGES['shimla']]),
     'Adventure', 'An adrenaline-packed adventure in the snow-capped mountains of Manali.',
     json_encode(['Solang Valley Snow Sports','Rohtang Pass Excursion','River Rafting','Old Manali Walk','Hot Springs at Vashisht']),
     json_encode([
         ['day'=>1,'title'=>'Delhi to Manali','description'=>'Overnight Volvo bus, scenic mountain drive'],
         ['day'=>2,'title'=>'Manali Local','description'=>'Hadimba Temple, Vashisht hot springs, Mall Road'],
         ['day'=>3,'title'=>'Solang Valley','description'=>'Snow activities, paragliding, zorbing'],
         ['day'=>4,'title'=>'Rohtang / Atal Tunnel','description'=>'High altitude excursion, snow point'],
         ['day'=>5,'title'=>'Departure','description'=>'Morning shopping, departure']
     ]),
     json_encode(['3-Star Hotel','Breakfast','Volvo Transport','Sightseeing']),
     json_encode(['Adventure Activity Fees','Lunch & Dinner','Personal Expenses']),
     1, 0, '2026-02-05'],

    ['Andaman Tropical Island', 'Andaman & Nicobar Islands', '6 Days / 5 Nights', 32999, 45999, 12, 4.8, 156,
     $IMAGES['andaman'], json_encode([$IMAGES['andaman'], $IMAGES['goa']]),
     'Beach', 'Escape to the pristine beaches of Andaman. Crystal clear waters, vibrant coral reefs, and untouched natural beauty.',
     json_encode(['Radhanagar Beach','Scuba Diving','Cellular Jail Light Show','Havelock Island','Glass Bottom Boat Ride']),
     json_encode([
         ['day'=>1,'title'=>'Port Blair Arrival','description'=>'Airport pickup, Cellular Jail visit, Sound & Light show'],
         ['day'=>2,'title'=>'Havelock Island','description'=>'Ferry to Havelock, Radhanagar Beach sunset'],
         ['day'=>3,'title'=>'Scuba & Snorkeling','description'=>'Elephant Beach, water activities, coral viewing'],
         ['day'=>4,'title'=>'Neil Island','description'=>'Ferry to Neil, Natural Bridge, Laxmanpur Beach'],
         ['day'=>5,'title'=>'North Bay & Ross Island','description'=>'Glass boat ride, Ross Island ruins'],
         ['day'=>6,'title'=>'Departure','description'=>'Free morning, airport drop']
     ]),
     json_encode(['Beach Resort','All Meals','Ferry Tickets','Sightseeing','Snorkeling']),
     json_encode(['Flights','Scuba Diving Fee','Personal Expenses']),
     1, 1, '2026-02-10'],

    ['Ladakh Bike Expedition', 'Leh-Ladakh, India', '8 Days / 7 Nights', 35999, 49999, 10, 4.9, 142,
     $IMAGES['ladakh'], json_encode([$IMAGES['ladakh'], $IMAGES['kashmir']]),
     'Adventure', 'The ultimate motorcycle expedition through the highest motorable roads in the world.',
     json_encode(['Khardung La Pass','Pangong Lake Camping','Nubra Valley','Magnetic Hill','Monastery Trail']),
     json_encode([
         ['day'=>1,'title'=>'Leh Arrival','description'=>'Acclimatization day, Leh market, Shanti Stupa'],
         ['day'=>2,'title'=>'Leh Sightseeing','description'=>'Leh Palace, Hall of Fame, Magnetic Hill, Sangam'],
         ['day'=>3,'title'=>'Khardung La to Nubra','description'=>'Ride over worlds highest pass, Diskit monastery'],
         ['day'=>4,'title'=>'Nubra Valley','description'=>'Hunder sand dunes, double-humped camel ride'],
         ['day'=>5,'title'=>'Nubra to Pangong','description'=>'Scenic ride to Pangong Lake, lakeside camping'],
         ['day'=>6,'title'=>'Pangong Lake','description'=>'Sunrise at Pangong, photography, return to Leh'],
         ['day'=>7,'title'=>'Monastery Tour','description'=>'Hemis, Thiksey, Spituk monasteries'],
         ['day'=>8,'title'=>'Departure','description'=>'Airport transfer, departure']
     ]),
     json_encode(['Guesthouse & Camps','All Meals','Bike Rental','Fuel','Permits','Mechanic']),
     json_encode(['Flights','Personal Gear','Medical Insurance']),
     1, 0, '2026-02-12'],

    ['Shimla-Kullu Valley Tour', 'Shimla & Kullu, HP', '5 Days / 4 Nights', 14999, 21999, 20, 4.4, 167,
     $IMAGES['shimla'], json_encode([$IMAGES['shimla'], $IMAGES['manali']]),
     'Mountain', 'A perfect family getaway to the Queen of Hills and the beautiful Kullu Valley.',
     json_encode(['Shimla Mall Road','Toy Train Ride','Kullu Valley','Manikaran Hot Springs','Apple Orchards']),
     json_encode([
         ['day'=>1,'title'=>'Delhi to Shimla','description'=>'Drive to Shimla, evening Mall Road walk'],
         ['day'=>2,'title'=>'Shimla Sightseeing','description'=>'Kufri, Jakhoo Temple, Christ Church, Ridge'],
         ['day'=>3,'title'=>'Shimla to Kullu','description'=>'Scenic drive, Kullu shawl factory, river rafting'],
         ['day'=>4,'title'=>'Manikaran & Kasol','description'=>'Hot springs, Gurudwara, Kasol village walk'],
         ['day'=>5,'title'=>'Departure','description'=>'Return journey via Chandigarh']
     ]),
     json_encode(['3-Star Hotel','Breakfast & Dinner','AC Vehicle','Sightseeing']),
     json_encode(['Flights/Train','Adventure Activities','Personal Expenses']),
     1, 0, '2026-02-15'],

    ['Varanasi Spiritual Journey', 'Varanasi, Uttar Pradesh', '3 Days / 2 Nights', 8999, 13999, 30, 4.6, 203,
     $IMAGES['varanasi'], json_encode([$IMAGES['varanasi']]),
     'Cultural', 'Immerse yourself in the spiritual capital of India. Witness the mesmerizing Ganga Aarti.',
     json_encode(['Ganga Aarti Ceremony','Sunrise Boat Ride','Kashi Vishwanath Temple','Sarnath Buddhist Site','Silk Weaving']),
     json_encode([
         ['day'=>1,'title'=>'Varanasi Arrival','description'=>'Airport pickup, evening Ganga Aarti at Dashashwamedh Ghat'],
         ['day'=>2,'title'=>'Full Day Exploration','description'=>'Sunrise boat ride, temple visits, Sarnath excursion'],
         ['day'=>3,'title'=>'Silk & Departure','description'=>'Silk weaving workshop, local market, departure']
     ]),
     json_encode(['Heritage Hotel','Breakfast','Boat Ride','Guide','Transport']),
     json_encode(['Flights','Lunch & Dinner','Temple Donations']),
     1, 0, '2026-02-18'],

    ['Rishikesh Yoga & Rafting', 'Rishikesh, Uttarakhand', '4 Days / 3 Nights', 11999, 17999, 15, 4.7, 178,
     $IMAGES['rishikesh'], json_encode([$IMAGES['rishikesh'], $IMAGES['manali']]),
     'Adventure', 'Find your inner peace and adrenaline in the yoga capital of the world.',
     json_encode(['White Water Rafting','Yoga & Meditation','Bungee Jumping','Beatles Ashram','Camping by Ganges']),
     json_encode([
         ['day'=>1,'title'=>'Arrival & Yoga','description'=>'Check-in, evening yoga session, Triveni Ghat Aarti'],
         ['day'=>2,'title'=>'Rafting Adventure','description'=>'16km white water rafting, cliff jumping, beach camp'],
         ['day'=>3,'title'=>'Explore Rishikesh','description'=>'Beatles Ashram, Laxman Jhula, Ram Jhula, waterfall trek'],
         ['day'=>4,'title'=>'Sunrise Yoga & Departure','description'=>'Early morning yoga by Ganges, departure']
     ]),
     json_encode(['Riverside Camp','All Meals','Rafting','Yoga Sessions','Transport']),
     json_encode(['Bungee Jumping Fee','Personal Expenses']),
     1, 0, '2026-02-20'],

    ['Udaipur Romance Retreat', 'Udaipur, Rajasthan', '4 Days / 3 Nights', 22999, 31999, 8, 4.8, 134,
     $IMAGES['udaipur'], json_encode([$IMAGES['udaipur'], $IMAGES['rajasthan']]),
     'Heritage', 'The city of lakes offers a romantic escape like no other.',
     json_encode(['Lake Pichola Boat Ride','City Palace Tour','Vintage Car Museum','Sajjangarh Monsoon Palace','Heritage Dining']),
     json_encode([
         ['day'=>1,'title'=>'Udaipur Arrival','description'=>'Airport pickup, Fateh Sagar Lake evening, cultural show'],
         ['day'=>2,'title'=>'Royal Udaipur','description'=>'City Palace, Jagdish Temple, Saheliyon ki Bari'],
         ['day'=>3,'title'=>'Lake & Palace','description'=>'Lake Pichola boat ride, Jag Mandir, Sajjangarh sunset'],
         ['day'=>4,'title'=>'Departure','description'=>'Morning market, airport drop']
     ]),
     json_encode(['Heritage Hotel','Breakfast & Dinner','AC Car','Boat Ride','Guide']),
     json_encode(['Flights','Lunch','Entry Fees']),
     1, 0, '2026-02-22'],

    ['Ooty Hill Station Escape', 'Ooty, Tamil Nadu', '4 Days / 3 Nights', 13999, 19999, 20, 4.5, 145,
     $IMAGES['ooty'], json_encode([$IMAGES['ooty'], $IMAGES['kerala']]),
     'Nature', 'Escape to the Nilgiri Hills and enjoy the colonial charm of Ooty.',
     json_encode(['Nilgiri Mountain Railway','Botanical Gardens','Ooty Lake','Tea Factory Visit','Doddabetta Peak']),
     json_encode([
         ['day'=>1,'title'=>'Coimbatore to Ooty','description'=>'Pickup, drive through 36 hairpin bends, evening lake visit'],
         ['day'=>2,'title'=>'Ooty Sightseeing','description'=>'Botanical Garden, Doddabetta Peak, Tea Museum'],
         ['day'=>3,'title'=>'Coonoor & Toy Train','description'=>'Nilgiri Railway ride, Sims Park, Dolphins Nose'],
         ['day'=>4,'title'=>'Departure','description'=>'Pykara Falls, departure to Coimbatore']
     ]),
     json_encode(['Resort Stay','Breakfast & Dinner','Vehicle','Sightseeing','Toy Train']),
     json_encode(['Flights/Train','Lunch','Personal Expenses']),
     1, 0, '2026-02-25'],
];

$stmt = $db->prepare(
    "INSERT INTO packages (title, location, duration, price, original_price, max_persons, rating, review_count,
     image, gallery, category, description, highlights, itinerary, inclusions, exclusions, active, featured, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
foreach ($packages as $p) { $stmt->execute($p); }
echo "<p>✅ Packages seeded (12 packages)</p>";

// ── BOOKINGS ─────────────────────────────────────────────────
// User IDs: admin=1, Rahul=2, Priya=3, Amit=4, Sneha=5
// Package IDs: pkg1=1, pkg2=2, pkg3=3, pkg7=7, pkg5=5
$bookings = [
    [2, 1, 'Magical Goa Beach Getaway', '2026-03-15', 2, 25998, 'confirmed', 'paid', 'upi', '2026-02-20'],
    [3, 2, 'Kashmir Paradise Valley', '2026-04-10', 4, 99996, 'pending', 'pending', '', '2026-02-22'],
    [4, 3, 'Kerala Backwater Bliss', '2026-03-25', 3, 59997, 'confirmed', 'paid', 'card', '2026-02-15'],
    [2, 7, 'Ladakh Bike Expedition', '2026-05-01', 1, 35999, 'confirmed', 'paid', 'card', '2026-02-18'],
    [5, 5, 'Manali Snow Adventure', '2026-03-20', 2, 31998, 'cancelled', 'refunded', 'upi', '2026-02-12'],
];

$stmt = $db->prepare(
    "INSERT INTO bookings (user_id, package_id, package_title, travel_date, persons, total_amount, status, payment_status, payment_method, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
foreach ($bookings as $b) { $stmt->execute($b); }
echo "<p>✅ Bookings seeded (5 bookings)</p>";

// ── REVIEWS ──────────────────────────────────────────────────
$reviews = [
    [2, 'Rahul Sharma', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
     1, 'Magical Goa Beach Getaway', 5, 'Absolutely amazing trip! The beaches were pristine and the hotel was fantastic.', '2026-02-25'],
    [3, 'Priya Patel', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
     3, 'Kerala Backwater Bliss', 5, "Kerala is truly God's Own Country. The houseboat experience was magical.", '2026-02-23'],
    [4, 'Amit Kumar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
     2, 'Kashmir Paradise Valley', 4, 'Breathtaking views everywhere you look. The Gulmarg Gondola ride was the highlight.', '2026-02-21'],
    [5, 'Sneha Desai', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
     6, 'Andaman Tropical Island', 5, 'Paradise on Earth! The scuba diving experience was once in a lifetime.', '2026-02-19'],
    [2, 'Rahul Sharma', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
     4, 'Royal Rajasthan Heritage', 4, 'The forts and palaces are magnificent. Desert safari under the stars was unforgettable.', '2026-02-17'],
];

$stmt = $db->prepare(
    "INSERT INTO reviews (user_id, user_name, user_avatar, package_id, package_title, rating, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);
foreach ($reviews as $r) { $stmt->execute($r); }
echo "<p>✅ Reviews seeded (5 reviews)</p>";

// ── ENQUIRIES ────────────────────────────────────────────────
$enquiries = [
    ['Deepak Verma', 'deepak@example.com', 'Group Booking for Kashmir',
     'We are a group of 12 people planning to visit Kashmir in April. Do you offer group discounts?',
     'open', '', '2026-02-26'],
    ['Anita Singh', 'anita@example.com', 'Honeymoon Package Inquiry',
     'Looking for a romantic honeymoon package for 2 people in March.',
     'replied', 'Thank you for your inquiry! We have special honeymoon packages for both Kerala and Andaman.', '2026-02-24'],
    ['Rajesh Gupta', 'rajesh@example.com', 'Senior Citizen Discount',
     'Do you offer any special discounts for senior citizens above 60 years?',
     'open', '', '2026-02-27'],
];

$stmt = $db->prepare(
    "INSERT INTO enquiries (name, email, subject, message, status, reply, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
);
foreach ($enquiries as $e) { $stmt->execute($e); }
echo "<p>✅ Enquiries seeded (3 enquiries)</p>";

// ── HOTELS ───────────────────────────────────────────────────
$hotels = [
    ['Ocean View Resort', 'Goa', 4.5, 3500, 100, 'Resort', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'],
    ['Kashmir Grand Palace', 'Srinagar', 4.8, 5500, 60, 'Luxury', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80'],
    ['Munnar Hills Hotel', 'Kerala', 4.3, 2800, 80, 'Hotel', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'],
    ['Heritage Haveli', 'Jaipur', 4.6, 4200, 40, 'Heritage', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80'],
    ['Mountain Lodge', 'Manali', 4.2, 2200, 50, 'Lodge', 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80'],
];

$stmt = $db->prepare("INSERT INTO hotels (name, location, rating, price_per_night, capacity, type, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
foreach ($hotels as $h) { $stmt->execute($h); }
echo "<p>✅ Hotels seeded (5 hotels)</p>";

// ── TRANSPORT ────────────────────────────────────────────────
$transport = [
    ['Luxury Coach', 'Bus', 40, 8000, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80'],
    ['Toyota Innova', 'Car', 7, 3500, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&q=80'],
    ['Tempo Traveller', 'Mini Bus', 15, 5000, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80'],
    ['Royal Enfield 350', 'Bike', 1, 1200, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'],
];

$stmt = $db->prepare("INSERT INTO transport (name, type, capacity, price_per_day, image) VALUES (?, ?, ?, ?, ?)");
foreach ($transport as $t) { $stmt->execute($t); }
echo "<p>✅ Transport seeded (4 vehicles)</p>";

// ── SETTINGS ─────────────────────────────────────────────────
$settings = [
    'siteName'     => 'TravelVista',
    'tagline'      => 'Explore the World, One Journey at a Time',
    'aboutUs'      => 'TravelVista is a premium tours and travel management platform dedicated to creating unforgettable travel experiences.',
    'email'        => 'info@travelvista.com',
    'phone'        => '+91 9876543210',
    'address'      => '42, MG Road, Pune, Maharashtra, India - 411001',
    'socialLinks'  => json_encode([
        'facebook'  => 'https://facebook.com/travelvista',
        'instagram' => 'https://instagram.com/travelvista',
        'twitter'   => 'https://twitter.com/travelvista',
        'youtube'   => 'https://youtube.com/travelvista',
    ]),
    'bannerImages' => json_encode([
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
        'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80',
    ]),
];

$stmt = $db->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?)");
foreach ($settings as $key => $value) { $stmt->execute([$key, $value]); }
echo "<p>✅ Settings seeded</p>";

echo "<h2>🎉 Database seeded successfully!</h2>";
echo "<p><a href='index.html'>Go to TravelVista →</a></p>";
?>
