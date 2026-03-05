"""
TravelVista — Database Seeder
Populates the SQLite database with initial mock data.
"""
import json
import bcrypt
from models import get_db, init_db

TOUR_IMAGES = {
    'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    'kashmir': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    'rajasthan': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    'andaman': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    'ladakh': 'https://images.unsplash.com/photo-1626015365107-3983b5765995?w=800&q=80',
    'shimla': 'https://images.unsplash.com/photo-1597074866923-dc0589150458?w=800&q=80',
    'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    'rishikesh': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    'udaipur': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'ooty': 'https://images.unsplash.com/photo-1574233488155-6fe6e2e6c74f?w=800&q=80',
}


def hash_pw(plain: str) -> str:
    return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed():
    init_db()
    conn = get_db()
    cur = conn.cursor()

    # Check if already seeded
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] > 0:
        print("Database already seeded. Skipping.")
        conn.close()
        return

    # ── Users ────────────────────────────────────────────────────────
    users = [
        ('user-admin', 'Saurabh Khetre', 'khetresaurabh.work@gmail.com', hash_pw('Saurabh@2971'),
         '+91 9876543210', 'admin',
         'https://ui-avatars.com/api/?name=Saurabh+Khetre&background=0891b2&color=fff&size=100',
         '2025-12-01', 1),
        ('user-001', 'Rahul Sharma', 'rahul@example.com', hash_pw('user123'),
         '+91 9876543211', 'user',
         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
         '2026-01-10', 1),
        ('user-002', 'Priya Patel', 'priya@example.com', hash_pw('user123'),
         '+91 9876543212', 'user',
         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
         '2026-01-15', 1),
        ('user-003', 'Amit Kumar', 'amit@example.com', hash_pw('user123'),
         '+91 9876543213', 'user',
         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
         '2026-01-20', 1),
        ('user-004', 'Sneha Desai', 'sneha@example.com', hash_pw('user123'),
         '+91 9876543214', 'user',
         'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
         '2026-02-01', 1),
        ('user-005', 'Vikram Singh', 'vikram@example.com', hash_pw('user123'),
         '+91 9876543215', 'user',
         'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
         '2026-02-10', 0),
    ]
    cur.executemany(
        "INSERT INTO users (id,name,email,password,phone,role,avatar,joined_at,active) VALUES (?,?,?,?,?,?,?,?,?)",
        users
    )

    # ── Packages ─────────────────────────────────────────────────────
    packages = [
        ('pkg-001', 'Magical Goa Beach Getaway', 'Goa, India', '4 Days / 3 Nights',
         12999, 18999, 20, 4.7, 234, TOUR_IMAGES['goa'],
         json.dumps([TOUR_IMAGES['goa'], TOUR_IMAGES['andaman'], TOUR_IMAGES['kerala']]),
         'Beach',
         'Experience the vibrant beaches of Goa with our exclusive package. From the serene shores of Palolem to the bustling nightlife of Baga, this trip covers it all. Enjoy water sports, visit ancient Portuguese churches, and savor the local seafood cuisine.',
         json.dumps(['Baga & Calangute Beach Visit', 'Water Sports Adventure', 'Old Goa Heritage Walk', 'Dudhsagar Falls Excursion', 'Sunset River Cruise']),
         json.dumps([
             {'day': 1, 'title': 'Arrival & North Goa', 'description': 'Airport pickup, check-in, visit Aguada Fort and Baga Beach'},
             {'day': 2, 'title': 'Water Sports & Beach', 'description': 'Full day of water sports at Calangute, evening market visit'},
             {'day': 3, 'title': 'South Goa Exploration', 'description': 'Dudhsagar Falls, spice plantation, Palolem Beach'},
             {'day': 4, 'title': 'Heritage & Departure', 'description': 'Old Goa churches visit, shopping, airport drop'},
         ]),
         json.dumps(['3-Star Hotel', 'Breakfast & Dinner', 'AC Transport', 'Sightseeing', 'Guide']),
         json.dumps(['Flights', 'Personal Expenses', 'Water Sports Fees']),
         1, 1, '2026-01-15'),

        ('pkg-002', 'Kashmir Paradise Valley', 'Kashmir, India', '6 Days / 5 Nights',
         24999, 34999, 15, 4.9, 189, TOUR_IMAGES['kashmir'],
         json.dumps([TOUR_IMAGES['kashmir'], TOUR_IMAGES['ladakh'], TOUR_IMAGES['shimla']]),
         'Mountain',
         'Discover the heaven on earth with our Kashmir tour package. Float on the serene Dal Lake in a traditional Shikara, explore the meadows of Gulmarg, and witness the stunning beauty of Pahalgam valley.',
         json.dumps(['Dal Lake Shikara Ride', 'Gulmarg Gondola', 'Pahalgam Valley Trek', 'Mughal Gardens Visit', 'Houseboat Stay']),
         json.dumps([
             {'day': 1, 'title': 'Srinagar Arrival', 'description': 'Airport pickup, houseboat check-in, Shikara ride on Dal Lake'},
             {'day': 2, 'title': 'Gulmarg Excursion', 'description': 'Full day Gulmarg, Gondola ride, snow activities'},
             {'day': 3, 'title': 'Pahalgam Adventure', 'description': 'Drive to Pahalgam, Betaab Valley, Aru Valley'},
             {'day': 4, 'title': 'Sonmarg Day Trip', 'description': 'Visit Thajiwas Glacier, Zoji La viewpoint'},
             {'day': 5, 'title': 'Srinagar Sightseeing', 'description': 'Mughal Gardens, Shankaracharya Temple, local market'},
             {'day': 6, 'title': 'Departure', 'description': 'Morning free time, airport drop'},
         ]),
         json.dumps(['Deluxe Houseboat', 'All Meals', 'Private Car', 'Sightseeing', 'Pony Ride']),
         json.dumps(['Flights', 'Gondola Tickets', 'Personal Expenses']),
         1, 1, '2026-01-20'),

        ('pkg-003', 'Kerala Backwater Bliss', 'Kerala, India', '5 Days / 4 Nights',
         19999, 27999, 18, 4.8, 312, TOUR_IMAGES['kerala'],
         json.dumps([TOUR_IMAGES['kerala'], TOUR_IMAGES['ooty']]),
         'Nature',
         "Explore God's Own Country with our Kerala package. Cruise through the enchanting backwaters of Alleppey, visit the tea gardens of Munnar, and relax on the beaches of Kovalam.",
         json.dumps(['Alleppey Houseboat Cruise', 'Munnar Tea Gardens', 'Periyar Wildlife Sanctuary', 'Kathakali Dance Show', 'Ayurvedic Spa']),
         json.dumps([
             {'day': 1, 'title': 'Kochi Arrival', 'description': 'Airport pickup, Fort Kochi walk, Chinese fishing nets'},
             {'day': 2, 'title': 'Munnar Hills', 'description': 'Drive to Munnar, tea museum, Eravikulam park'},
             {'day': 3, 'title': 'Thekkady Wildlife', 'description': 'Periyar Lake boating, spice garden visit'},
             {'day': 4, 'title': 'Alleppey Backwaters', 'description': 'Full day houseboat cruise, village experience'},
             {'day': 5, 'title': 'Kochi & Departure', 'description': 'Morning shopping, Kathakali show, airport drop'},
         ]),
         json.dumps(['4-Star Hotels', 'Houseboat Stay', 'All Meals', 'AC Vehicle', 'Guide']),
         json.dumps(['Flights', 'Boat Tickets', 'Personal Expenses']),
         1, 1, '2026-01-25'),

        ('pkg-004', 'Royal Rajasthan Heritage', 'Rajasthan, India', '7 Days / 6 Nights',
         29999, 42999, 20, 4.6, 276, TOUR_IMAGES['rajasthan'],
         json.dumps([TOUR_IMAGES['rajasthan'], TOUR_IMAGES['udaipur'], TOUR_IMAGES['varanasi']]),
         'Heritage',
         'Journey through the land of kings and experience the royal heritage of Rajasthan. Visit majestic forts, colorful bazaars, and the golden sands of the Thar Desert.',
         json.dumps(['Jaipur City Palace', 'Jodhpur Mehrangarh Fort', 'Udaipur Lake City', 'Jaisalmer Desert Safari', 'Traditional Rajasthani Dinner']),
         json.dumps([
             {'day': 1, 'title': 'Jaipur Arrival', 'description': 'Airport pickup, evening Hawa Mahal visit'},
             {'day': 2, 'title': 'Pink City Tour', 'description': 'Amber Fort, City Palace, Jantar Mantar'},
             {'day': 3, 'title': 'Jodhpur Blue City', 'description': 'Drive to Jodhpur, Mehrangarh Fort, clock tower'},
             {'day': 4, 'title': 'Jaisalmer Golden City', 'description': 'Drive to Jaisalmer, fort visit, Patwon ki Haveli'},
             {'day': 5, 'title': 'Desert Experience', 'description': 'Camel safari, sand dunes, cultural night'},
             {'day': 6, 'title': 'Udaipur Lake City', 'description': 'Drive to Udaipur, City Palace, Lake Pichola boat'},
             {'day': 7, 'title': 'Departure', 'description': 'Morning free, airport transfer'},
         ]),
         json.dumps(['Heritage Hotels', 'Breakfast & Dinner', 'AC Vehicle', 'Guide', 'Desert Safari']),
         json.dumps(['Flights', 'Lunch', 'Entry Fees']),
         1, 0, '2026-02-01'),

        ('pkg-005', 'Manali Snow Adventure', 'Manali, Himachal Pradesh', '5 Days / 4 Nights',
         15999, 22999, 25, 4.5, 198, TOUR_IMAGES['manali'],
         json.dumps([TOUR_IMAGES['manali'], TOUR_IMAGES['shimla']]),
         'Adventure',
         'An adrenaline-packed adventure in the snow-capped mountains of Manali. Experience snow sports, visit the Solang Valley, and enjoy the scenic beauty of Old Manali.',
         json.dumps(['Solang Valley Snow Sports', 'Rohtang Pass Excursion', 'River Rafting', 'Old Manali Walk', 'Hot Springs at Vashisht']),
         json.dumps([
             {'day': 1, 'title': 'Delhi to Manali', 'description': 'Overnight Volvo bus, scenic mountain drive'},
             {'day': 2, 'title': 'Manali Local', 'description': 'Hadimba Temple, Vashisht hot springs, Mall Road'},
             {'day': 3, 'title': 'Solang Valley', 'description': 'Snow activities, paragliding, zorbing'},
             {'day': 4, 'title': 'Rohtang / Atal Tunnel', 'description': 'High altitude excursion, snow point'},
             {'day': 5, 'title': 'Departure', 'description': 'Morning shopping, departure'},
         ]),
         json.dumps(['3-Star Hotel', 'Breakfast', 'Volvo Transport', 'Sightseeing']),
         json.dumps(['Adventure Activity Fees', 'Lunch & Dinner', 'Personal Expenses']),
         1, 0, '2026-02-05'),

        ('pkg-006', 'Andaman Tropical Island', 'Andaman & Nicobar Islands', '6 Days / 5 Nights',
         32999, 45999, 12, 4.8, 156, TOUR_IMAGES['andaman'],
         json.dumps([TOUR_IMAGES['andaman'], TOUR_IMAGES['goa']]),
         'Beach',
         'Escape to the pristine beaches of Andaman. Crystal clear waters, vibrant coral reefs, and untouched natural beauty await you in this tropical paradise.',
         json.dumps(['Radhanagar Beach', 'Scuba Diving', 'Cellular Jail Light Show', 'Havelock Island', 'Glass Bottom Boat Ride']),
         json.dumps([
             {'day': 1, 'title': 'Port Blair Arrival', 'description': 'Airport pickup, Cellular Jail visit, Sound & Light show'},
             {'day': 2, 'title': 'Havelock Island', 'description': 'Ferry to Havelock, Radhanagar Beach sunset'},
             {'day': 3, 'title': 'Scuba & Snorkeling', 'description': 'Elephant Beach, water activities, coral viewing'},
             {'day': 4, 'title': 'Neil Island', 'description': 'Ferry to Neil, Natural Bridge, Laxmanpur Beach'},
             {'day': 5, 'title': 'North Bay & Ross Island', 'description': 'Glass boat ride, Ross Island ruins'},
             {'day': 6, 'title': 'Departure', 'description': 'Free morning, airport drop'},
         ]),
         json.dumps(['Beach Resort', 'All Meals', 'Ferry Tickets', 'Sightseeing', 'Snorkeling']),
         json.dumps(['Flights', 'Scuba Diving Fee', 'Personal Expenses']),
         1, 1, '2026-02-10'),

        ('pkg-007', 'Ladakh Bike Expedition', 'Leh-Ladakh, India', '8 Days / 7 Nights',
         35999, 49999, 10, 4.9, 142, TOUR_IMAGES['ladakh'],
         json.dumps([TOUR_IMAGES['ladakh'], TOUR_IMAGES['kashmir']]),
         'Adventure',
         "The ultimate motorcycle expedition through the highest motorable roads in the world. Ride through Khardung La, camp at Pangong Lake, and experience the raw beauty of Ladakh.",
         json.dumps(['Khardung La Pass', 'Pangong Lake Camping', 'Nubra Valley', 'Magnetic Hill', 'Monastery Trail']),
         json.dumps([
             {'day': 1, 'title': 'Leh Arrival', 'description': 'Acclimatization day, Leh market, Shanti Stupa'},
             {'day': 2, 'title': 'Leh Sightseeing', 'description': 'Leh Palace, Hall of Fame, Magnetic Hill, Sangam'},
             {'day': 3, 'title': 'Khardung La to Nubra', 'description': "Ride over world's highest pass, Diskit monastery"},
             {'day': 4, 'title': 'Nubra Valley', 'description': 'Hunder sand dunes, double-humped camel ride'},
             {'day': 5, 'title': 'Nubra to Pangong', 'description': 'Scenic ride to Pangong Lake, lakeside camping'},
             {'day': 6, 'title': 'Pangong Lake', 'description': 'Sunrise at Pangong, photography, return to Leh'},
             {'day': 7, 'title': 'Monastery Tour', 'description': 'Hemis, Thiksey, Spituk monasteries'},
             {'day': 8, 'title': 'Departure', 'description': 'Airport transfer, departure'},
         ]),
         json.dumps(['Guesthouse & Camps', 'All Meals', 'Bike Rental', 'Fuel', 'Permits', 'Mechanic']),
         json.dumps(['Flights', 'Personal Gear', 'Medical Insurance']),
         1, 0, '2026-02-12'),

        ('pkg-008', 'Shimla-Kullu Valley Tour', 'Shimla & Kullu, HP', '5 Days / 4 Nights',
         14999, 21999, 20, 4.4, 167, TOUR_IMAGES['shimla'],
         json.dumps([TOUR_IMAGES['shimla'], TOUR_IMAGES['manali']]),
         'Mountain',
         'A perfect family getaway to the Queen of Hills and the beautiful Kullu Valley. Enjoy toy train rides, apple orchards, and breathtaking mountain views.',
         json.dumps(['Shimla Mall Road', 'Toy Train Ride', 'Kullu Valley', 'Manikaran Hot Springs', 'Apple Orchards']),
         json.dumps([
             {'day': 1, 'title': 'Delhi to Shimla', 'description': 'Drive to Shimla, evening Mall Road walk'},
             {'day': 2, 'title': 'Shimla Sightseeing', 'description': 'Kufri, Jakhoo Temple, Christ Church, Ridge'},
             {'day': 3, 'title': 'Shimla to Kullu', 'description': 'Scenic drive, Kullu shawl factory, river rafting'},
             {'day': 4, 'title': 'Manikaran & Kasol', 'description': 'Hot springs, Gurudwara, Kasol village walk'},
             {'day': 5, 'title': 'Departure', 'description': 'Return journey via Chandigarh'},
         ]),
         json.dumps(['3-Star Hotel', 'Breakfast & Dinner', 'AC Vehicle', 'Sightseeing']),
         json.dumps(['Flights/Train', 'Adventure Activities', 'Personal Expenses']),
         1, 0, '2026-02-15'),

        ('pkg-009', 'Varanasi Spiritual Journey', 'Varanasi, Uttar Pradesh', '3 Days / 2 Nights',
         8999, 13999, 30, 4.6, 203, TOUR_IMAGES['varanasi'],
         json.dumps([TOUR_IMAGES['varanasi']]),
         'Cultural',
         'Immerse yourself in the spiritual capital of India. Witness the mesmerizing Ganga Aarti, explore ancient temples, and take a boat ride on the holy Ganges at sunrise.',
         json.dumps(['Ganga Aarti Ceremony', 'Sunrise Boat Ride', 'Kashi Vishwanath Temple', 'Sarnath Buddhist Site', 'Silk Weaving']),
         json.dumps([
             {'day': 1, 'title': 'Varanasi Arrival', 'description': 'Airport pickup, evening Ganga Aarti at Dashashwamedh Ghat'},
             {'day': 2, 'title': 'Full Day Exploration', 'description': 'Sunrise boat ride, temple visits, Sarnath excursion'},
             {'day': 3, 'title': 'Silk & Departure', 'description': 'Silk weaving workshop, local market, departure'},
         ]),
         json.dumps(['Heritage Hotel', 'Breakfast', 'Boat Ride', 'Guide', 'Transport']),
         json.dumps(['Flights', 'Lunch & Dinner', 'Temple Donations']),
         1, 0, '2026-02-18'),

        ('pkg-010', 'Rishikesh Yoga & Rafting', 'Rishikesh, Uttarakhand', '4 Days / 3 Nights',
         11999, 17999, 15, 4.7, 178, TOUR_IMAGES['rishikesh'],
         json.dumps([TOUR_IMAGES['rishikesh'], TOUR_IMAGES['manali']]),
         'Adventure',
         'Find your inner peace and adrenaline in the yoga capital of the world. Combine thrilling white water rafting with tranquil yoga sessions by the Ganges.',
         json.dumps(['White Water Rafting', 'Yoga & Meditation', 'Bungee Jumping', 'Beatles Ashram', 'Camping by Ganges']),
         json.dumps([
             {'day': 1, 'title': 'Arrival & Yoga', 'description': 'Check-in, evening yoga session, Triveni Ghat Aarti'},
             {'day': 2, 'title': 'Rafting Adventure', 'description': '16km white water rafting, cliff jumping, beach camp'},
             {'day': 3, 'title': 'Explore Rishikesh', 'description': 'Beatles Ashram, Laxman Jhula, Ram Jhula, waterfall trek'},
             {'day': 4, 'title': 'Sunrise Yoga & Departure', 'description': 'Early morning yoga by Ganges, departure'},
         ]),
         json.dumps(['Riverside Camp', 'All Meals', 'Rafting', 'Yoga Sessions', 'Transport']),
         json.dumps(['Bungee Jumping Fee', 'Personal Expenses']),
         1, 0, '2026-02-20'),

        ('pkg-011', 'Udaipur Romance Retreat', 'Udaipur, Rajasthan', '4 Days / 3 Nights',
         22999, 31999, 8, 4.8, 134, TOUR_IMAGES['udaipur'],
         json.dumps([TOUR_IMAGES['udaipur'], TOUR_IMAGES['rajasthan']]),
         'Heritage',
         'The city of lakes offers a romantic escape like no other. Stay in heritage hotels, enjoy boat rides on Lake Pichola, and witness stunning sunsets over the Aravalli hills.',
         json.dumps(['Lake Pichola Boat Ride', 'City Palace Tour', 'Vintage Car Museum', 'Sajjangarh Monsoon Palace', 'Heritage Dining']),
         json.dumps([
             {'day': 1, 'title': 'Udaipur Arrival', 'description': 'Airport pickup, Fateh Sagar Lake evening, cultural show'},
             {'day': 2, 'title': 'Royal Udaipur', 'description': 'City Palace, Jagdish Temple, Saheliyon ki Bari'},
             {'day': 3, 'title': 'Lake & Palace', 'description': 'Lake Pichola boat ride, Jag Mandir, Sajjangarh sunset'},
             {'day': 4, 'title': 'Departure', 'description': 'Morning market, airport drop'},
         ]),
         json.dumps(['Heritage Hotel', 'Breakfast & Dinner', 'AC Car', 'Boat Ride', 'Guide']),
         json.dumps(['Flights', 'Lunch', 'Entry Fees']),
         1, 0, '2026-02-22'),

        ('pkg-012', 'Ooty Hill Station Escape', 'Ooty, Tamil Nadu', '4 Days / 3 Nights',
         13999, 19999, 20, 4.5, 145, TOUR_IMAGES['ooty'],
         json.dumps([TOUR_IMAGES['ooty'], TOUR_IMAGES['kerala']]),
         'Nature',
         "Escape to the Nilgiri Hills and enjoy the colonial charm of Ooty. Ride the famous toy train, visit botanical gardens, and explore the lush tea estates.",
         json.dumps(['Nilgiri Mountain Railway', 'Botanical Gardens', 'Ooty Lake', 'Tea Factory Visit', 'Doddabetta Peak']),
         json.dumps([
             {'day': 1, 'title': 'Coimbatore to Ooty', 'description': 'Pickup, drive through 36 hairpin bends, evening lake visit'},
             {'day': 2, 'title': 'Ooty Sightseeing', 'description': 'Botanical Garden, Doddabetta Peak, Tea Museum'},
             {'day': 3, 'title': 'Coonoor & Toy Train', 'description': "Nilgiri Railway ride, Sim's Park, Dolphin's Nose"},
             {'day': 4, 'title': 'Departure', 'description': 'Pykara Falls, departure to Coimbatore'},
         ]),
         json.dumps(['Resort Stay', 'Breakfast & Dinner', 'Vehicle', 'Sightseeing', 'Toy Train']),
         json.dumps(['Flights/Train', 'Lunch', 'Personal Expenses']),
         1, 0, '2026-02-25'),
    ]
    cur.executemany(
        """INSERT INTO packages
           (id,title,location,duration,price,original_price,max_persons,rating,review_count,
            image,gallery,category,description,highlights,itinerary,inclusions,exclusions,
            active,featured,created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        packages
    )

    # ── Bookings ─────────────────────────────────────────────────────
    bookings = [
        ('bk-001', 'user-001', 'pkg-001', 'Magical Goa Beach Getaway', '2026-03-15', 2, 25998, 'confirmed', 'paid', 'upi', '2026-02-20'),
        ('bk-002', 'user-002', 'pkg-002', 'Kashmir Paradise Valley', '2026-04-10', 4, 99996, 'pending', 'pending', '', '2026-02-22'),
        ('bk-003', 'user-003', 'pkg-003', 'Kerala Backwater Bliss', '2026-03-25', 3, 59997, 'confirmed', 'paid', 'card', '2026-02-15'),
        ('bk-004', 'user-001', 'pkg-007', 'Ladakh Bike Expedition', '2026-05-01', 1, 35999, 'confirmed', 'paid', 'card', '2026-02-18'),
        ('bk-005', 'user-004', 'pkg-005', 'Manali Snow Adventure', '2026-03-20', 2, 31998, 'cancelled', 'refunded', 'upi', '2026-02-12'),
    ]
    cur.executemany(
        """INSERT INTO bookings
           (id,user_id,package_id,package_title,travel_date,persons,total_amount,
            status,payment_status,payment_method,created_at)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        bookings
    )

    # ── Reviews ──────────────────────────────────────────────────────
    reviews = [
        ('rev-001', 'user-001', 'Rahul Sharma',
         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
         'pkg-001', 'Magical Goa Beach Getaway', 5,
         'Absolutely amazing trip! The beaches were pristine and the hotel was fantastic. Our guide was very knowledgeable. Highly recommend to anyone wanting a beach vacation.',
         '2026-02-25'),
        ('rev-002', 'user-002', 'Priya Patel',
         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
         'pkg-003', 'Kerala Backwater Bliss', 5,
         "Kerala is truly God's Own Country. The houseboat experience was magical. The food was delicious and authentic. Will definitely visit again!",
         '2026-02-23'),
        ('rev-003', 'user-003', 'Amit Kumar',
         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
         'pkg-002', 'Kashmir Paradise Valley', 4,
         'Breathtaking views everywhere you look. The Gulmarg Gondola ride was the highlight. Only giving 4 stars because the weather was a bit unpredictable.',
         '2026-02-21'),
        ('rev-004', 'user-004', 'Sneha Desai',
         'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
         'pkg-006', 'Andaman Tropical Island', 5,
         'Paradise on Earth! The scuba diving experience was once in a lifetime. The beaches are so clean and untouched. Best vacation ever!',
         '2026-02-19'),
        ('rev-005', 'user-001', 'Rahul Sharma',
         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
         'pkg-004', 'Royal Rajasthan Heritage', 4,
         'The forts and palaces are magnificent. Desert safari under the stars was unforgettable. The heritage hotels added so much charm to the trip.',
         '2026-02-17'),
    ]
    cur.executemany(
        """INSERT INTO reviews
           (id,user_id,user_name,user_avatar,package_id,package_title,rating,comment,created_at)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        reviews
    )

    # ── Enquiries ────────────────────────────────────────────────────
    enquiries = [
        ('enq-001', 'Deepak Verma', 'deepak@example.com', 'Group Booking for Kashmir',
         'We are a group of 12 people planning to visit Kashmir in April. Do you offer group discounts? Also, can you customize the itinerary?',
         'open', '', '2026-02-26'),
        ('enq-002', 'Anita Singh', 'anita@example.com', 'Honeymoon Package Inquiry',
         'Looking for a romantic honeymoon package for 2 people in March. Interested in Kerala or Andaman. Please share options and pricing.',
         'replied',
         'Thank you for your inquiry! We have special honeymoon packages for both Kerala and Andaman. Please check our packages page or call us at +91 9876543210 for customized options.',
         '2026-02-24'),
        ('enq-003', 'Rajesh Gupta', 'rajesh@example.com', 'Senior Citizen Discount',
         'Do you offer any special discounts for senior citizens above 60 years? We are a family of 5 with 2 seniors.',
         'open', '', '2026-02-27'),
    ]
    cur.executemany(
        """INSERT INTO enquiries
           (id,name,email,subject,message,status,reply,created_at)
           VALUES (?,?,?,?,?,?,?,?)""",
        enquiries
    )

    # ── Hotels ───────────────────────────────────────────────────────
    hotels = [
        ('htl-001', 'Ocean View Resort', 'Goa', 4.5, 3500, 100, 'Resort', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80'),
        ('htl-002', 'Kashmir Grand Palace', 'Srinagar', 4.8, 5500, 60, 'Luxury', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80'),
        ('htl-003', 'Munnar Hills Hotel', 'Kerala', 4.3, 2800, 80, 'Hotel', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80'),
        ('htl-004', 'Heritage Haveli', 'Jaipur', 4.6, 4200, 40, 'Heritage', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80'),
        ('htl-005', 'Mountain Lodge', 'Manali', 4.2, 2200, 50, 'Lodge', 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80'),
    ]
    cur.executemany(
        "INSERT INTO hotels (id,name,location,rating,price_per_night,capacity,type,image) VALUES (?,?,?,?,?,?,?,?)",
        hotels
    )

    # ── Transport ────────────────────────────────────────────────────
    transport = [
        ('trn-001', 'Luxury Coach', 'Bus', 40, 8000, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80'),
        ('trn-002', 'Toyota Innova', 'Car', 7, 3500, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=400&q=80'),
        ('trn-003', 'Tempo Traveller', 'Mini Bus', 15, 5000, 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&q=80'),
        ('trn-004', 'Royal Enfield 350', 'Bike', 1, 1200, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80'),
    ]
    cur.executemany(
        "INSERT INTO transport (id,name,type,capacity,price_per_day,image) VALUES (?,?,?,?,?,?)",
        transport
    )

    # ── Settings ─────────────────────────────────────────────────────
    settings = {
        'siteName': 'TravelVista',
        'tagline': 'Explore the World, One Journey at a Time',
        'aboutUs': 'TravelVista is a premium tours and travel management platform dedicated to creating unforgettable travel experiences. With years of expertise, we curate the finest tour packages across India, ensuring every journey is smooth, memorable, and affordable.',
        'email': 'info@travelvista.com',
        'phone': '+91 9876543210',
        'address': '42, MG Road, Pune, Maharashtra, India - 411001',
        'socialLinks': json.dumps({
            'facebook': 'https://facebook.com/travelvista',
            'instagram': 'https://instagram.com/travelvista',
            'twitter': 'https://twitter.com/travelvista',
            'youtube': 'https://youtube.com/travelvista',
        }),
        'bannerImages': json.dumps([
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
            'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80',
        ]),
    }
    for key, value in settings.items():
        cur.execute("INSERT INTO settings (key, value) VALUES (?, ?)", (key, value))

    conn.commit()
    conn.close()
    print("[OK] Database seeded successfully!")


if __name__ == '__main__':
    seed()
