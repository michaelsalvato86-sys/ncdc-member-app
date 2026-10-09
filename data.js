// Newport County Dinner Club - app data.
// Restaurant names, links and notes are copied from newportcountydinnerclub.com (2026-10-08).
// Every redemption "code" below is SAMPLE until the restaurant submits its own through /partner/.
//
// code.type:
//   'image'   - the restaurant uploaded its own graphic (QR, barcode or coupon); shown as-is
//   'qr'      - the app draws a QR from code.value
//   'barcode' - the app draws a Code 128 barcode from code.value
//   'code'    - a promo code the server types into the POS
//   'none'    - nothing submitted yet; the member shows the verified screen and the server keys the discount

const CLUB = {
  name: 'Newport County Dinner Club',
  season: '2026–2027',
  validFrom: '2026-12-01',
  validTo: '2027-11-30',
  offer: 'Two-for-one entrées',
  offerDetail: 'Order two entrées and the lower-priced one comes off the bill. Appetizers and desserts are not entrées.',
  // ASSUMPTION to confirm with the club: how many times a member may use each restaurant per season.
  // The paper booklet's limit decides this. 0 = unlimited (every use is still logged).
  usesPerRestaurant: 1,
  email: 'newportcountydinnerclub@gmail.com',
  buyUrl: 'https://square.link/u/MWVwkI9s',
  renewUrl: 'https://square.link/u/XqJux7Uh',
  partnerFormUrl: 'https://aqddirfs.paperform.co/',
  // Prices from the club site, 2026-10-08. The $17 online price is an end-of-year special; update when it ends.
  price: { online: 17, regular: 27, retail: 25 },
};

// status: 'live' | 'seasonal' | 'later'   note: shown under the name
const RESTAURANTS = [
  { id: 'annies', name: "Annie's" },
  { id: 'aquidneck-pizzeria', name: 'Aquidneck Pizzeria & Bar', url: 'https://aqpizza.com' },
  { id: 'bagel-boys', name: 'Bagel Boys' },
  { id: 'bar-12', name: 'Bar 12', url: 'https://www.bar12newport.com' },
  { id: 'beckys-bbq', name: "Becky's BBQ", url: 'https://beckysbbq.com' },
  { id: 'ben-jerrys', name: "Ben and Jerry's", url: 'https://www.benjerry.com/thamesstreet', status: 'seasonal', note: 'Seasonal' },
  { id: 'benjamins', name: "Benjamin's Raw Bar", url: 'https://www.benjaminsrawbar.com/' },
  { id: 'blue-plate', name: 'Blue Plate Diner', url: 'https://www.blueplatedinerri.com' },
  { id: 'boat-house', name: 'The Boat House Restaurant', url: 'http://www.boathousetiverton.com' },
  { id: 'brick-alley', name: 'Brick Alley Pub', url: 'https://www.brickalley.com', code: { type: 'qr', value: 'NCDC-2FOR1-BRICKALLEY', pos: 'Toast', sample: true } },
  { id: 'buskers', name: 'Buskers', url: 'http://www.buskerspub.com/' },
  { id: 'caleb-broad', name: 'Caleb & Broad', url: 'http://www.calebandbroad.com/' },
  { id: 'claw-hammer', name: 'Claw & Hammer', url: 'https://www.clawnhammer.com/', code: { type: 'barcode', value: 'NCDC2027CLAW', pos: 'Square', sample: true } },
  { id: 'cluck-house', name: 'Cluck House', url: 'https://cluckhousenewport.com' },
  { id: 'the-deck', name: '@ The Deck', url: 'http://www.waiteswharf.com/' },
  { id: 'diegos', name: "Diego's Barrio Cantina", url: 'https://www.diegosmiddletown.com/' },
  { id: 'east-ferry', name: 'East Ferry Deli', url: 'https://eastferrydeli.com/' },
  { id: 'food-shack', name: 'The Food Shack', url: 'https://www.401foodshack.com/' },
  { id: 'foodworks', name: 'Foodworks', url: 'https://www.foodworksfamilyrestaurant.com/' },
  { id: 'helmway', name: 'The Helmway', url: 'https://www.thehelmway.com' },
  { id: 'hooked', name: 'Hooked', url: 'https://hooked-newport.com', code: { type: 'code', value: 'DINNERCLUB27', pos: 'Clover', sample: true } },
  { id: 'hungry-monkey', name: 'The Hungry Monkey', url: 'https://hungrymonkeycafe.com/' },
  { id: 'pocket-cafe', name: 'International Pocket Café', url: 'https://international-pocket-cafe.mxstorefront.com/' },
  { id: 'jos', name: "Jo's American Bistro", url: 'https://josamericanbistro.com', status: 'later', note: 'Not valid until the end of January' },
  { id: 'jt-commons', name: 'JT Commons', url: 'https://www.jtcommonsrestaurant.com' },
  { id: 'kitchen-table', name: 'The Kitchen Table', url: 'https://www.thekitchentableri.com' },
  { id: 'la-forge', name: 'La Forge Casino Restaurant', url: 'https://laforgenewport.com/' },
  { id: 'lucia', name: 'Lucia Restaurant & Pizzeria', url: 'http://www.luciarestaurant.com/' },
  { id: 'mainsail', name: 'MainSail Restaurant', url: 'https://www.marriott.com/en-us/hotels/pvdlw-newport-marriott/dining/mainsail-restaurant/' },
  { id: 'mamma-luisas', name: "Mamma Luisa's", url: 'http://www.mammaluisa.com/' },
  { id: 'marcos', name: "Marco's Subs", url: 'https://www.marcosri.com' },
  { id: 'martinos', name: "Martino's Pizzeria", url: 'http://martinospizzeria.com/' },
  { id: 'mooring', name: 'The Mooring Seafood Kitchen', url: 'http://www.mooringrestaurant.com/' },
  { id: 'north-end', name: 'The North End Pizzeria', url: 'http://www.northendpizzeria.com/' },
  { id: 'obriens', name: "O'Brien's Pub", url: 'http://www.theobrienspub.com/' },
  { id: 'one-bellevue', name: 'One Bellevue', url: 'https://www.hotelviking.com/dining/one-bellevue/', status: 'later', note: 'Reopening in the spring' },
  { id: 'one-pelham', name: 'One Pelham East', url: 'https://thepelham.com' },
  { id: 'perro-salado', name: 'Perro Salado', url: 'http://www.perrosalado.com' },
  { id: 'pickles', name: 'Pickles A Deli', url: 'https://www.picklesdeliri.com' },
  { id: 'portsmouth-publick', name: 'Portsmouth Publick House', url: 'http://www.portsmouthpublickhouse.com/' },
  { id: 'pour-judgement', name: 'Pour Judgement', url: 'https://www.pourjudgementnewport.com' },
  { id: 'quencher', name: 'Quencher', url: 'https://www.thequenchernewport.com' },
  { id: 'red-parrot', name: 'The Red Parrot', url: 'http://www.redparrotrestaurant.com/' },
  { id: 'reef', name: 'The Reef', url: 'https://thereefnewport.com/' },
  { id: 'saltwater', name: 'Saltwater', url: 'https://www.newporthotel.com/saltwater-restaurant.htm' },
  { id: '1639', name: '1639 Restaurant', url: 'https://www.newportharborisland.com/dine/1639/', note: 'Newport Harbor Island Resort' },
  { id: 'skiff-bar', name: 'Skiff Bar', url: 'http://mainsail-restaurant.com/skiff-bar/', note: 'At the Newport Marriott' },
  { id: 'smoke-house', name: 'Smoke House', url: 'https://www.smokehousenewport.com/', status: 'seasonal', note: 'Seasonal' },
  { id: 'stoneacre-brasserie', name: 'Stoneacre Brasserie', url: 'http://www.stoneacrebrasserie.com/' },
  { id: 'stoneacre-garden', name: 'Stoneacre Garden', url: 'http://www.stoneacrebrasserie.com/stoneacre-garden/' },
  { id: 'tavern-broadway', name: 'Tavern on Broadway', url: 'http://www.tavernonbroadway.com/' },
  { id: 'titos', name: "Tito's Cantina", url: 'http://www.titos.com' },
  { id: '22-bowens', name: "22 Bowen's", url: 'http://www.22bowens.com' },
  { id: 'vieste', name: 'Viesté', url: 'https://viestesimplyitalian.com' },
  { id: 'wallys', name: "Wally's Wieners", url: 'https://www.wallyswieners.com/' },
  { id: 'wharf-fishhouse', name: 'Wharf Fishhouse & Tiki Bar', url: 'https://wharffishhousenewport.com' },
  { id: 'wharf-southern', name: 'Wharf Southern Kitchen & Whiskey Bar', url: 'https://www.wharfsouthernkitchen.com/' },
  { id: 'yagi', name: 'Yagi Noodles', url: 'https://www.yaginoodles.com' },
];

// DEMO members. The real build checks the Square customer list (purchases and renewals already run through Square).
const DEMO_MEMBERS = [
  { number: '27-00001', email: 'demo@newportcountydinnerclub.com', name: 'Demo Member' },
];

// Heritage Restaurant Group venues on the Dinner Club list. They get member-level detail (names, emails) for
// marketing, from members who opted in. Reef, Claw & Hammer, Cluck House, Jo's, La Forge and Quencher added 2026-10-09 from our Toast/DoorDash/ad lists;
// Quencher confirmed by Michael 2026-10-09; Heritage should still confirm the rest before launch.
const HRG_VENUES = ['brick-alley', 'caleb-broad', 'claw-hammer', 'cluck-house', 'jos', 'la-forge', 'quencher', 'red-parrot', 'reef', 'wallys'];
