// Newport County Dinner Club - app data.
// Restaurant names, links and notes are copied from newportcountydinnerclub.com (2026-10-08).
// Redemption codes come only from restaurants via /partner/ (none in this file; the 2026-27 season uses the printed book).
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
  // CONFIRMED by Katelyn, 2026-10-09 meeting: "they can only use it once" - one redemption per restaurant per member per season.
  // Once redeemed, the restaurant shows as used and the server hold-to-redeem is disabled. 0 would mean unlimited (do not use).
  usesPerRestaurant: 1,
  // Dine-in only (Katelyn, 2026-10-09): the discount never applies to takeout or online orders.
  dineInOnly: true,
  // App logo: the official logo from newportcountydinnerclub.com (Michael, 2026-10-09: "the one from the website
  // looked great, just use that"). Same file the headers and icons already use.
  appLogo: 'logo-vert.png', appLogoPending: false,
  email: 'dinnerclub@newportlifemagazine.com',
  buyUrl: 'https://square.link/u/MWVwkI9s',
  renewUrl: 'https://square.link/u/XqJux7Uh',
  // 2026-2027 season: physical books only (Michael, 2026-10-20: "we have to stick with the physical books").
  // The app is a dining guide: restaurants, menus, maps, links. No sign-in, digital card or in-app redemption.
  // Set true to bring the card back; the sign-in, redeem and Supabase code are all still in index.html.
  digitalCard: false,
  partnerFormUrl: 'https://aqddirfs.paperform.co/',
  // Prices from the club site, 2026-10-08. The $17 online price is an end-of-year special; update when it ends.
  price: { online: 17, regular: 27, retail: 25 },
};

// The 2026-27 list: exactly the restaurants on Katelyn's "NCDC Restaurant Sign Up" export (email 2026-11-04).
// offer: the days (0 = Monday ... 6 = Sunday) the two-for-one is valid for breakfast/brunch, lunch and dinner, as each
//        restaurant entered them on the sign-up form. An empty list means that meal is not offered.
// blackout: dates the offer cannot be used (restaurant's words). rules: other restrictions (restaurant's words).
// status 'seasonal' = the restaurant listed blackout dates. Never guess any of these; update from the form only.
const RESTAURANTS = [
  { id: '22-bowens', name: "22 Bowen's", url: 'http://www.22bowens.com', status: 'seasonal', offer: {breakfast: [], lunch: [4, 5], dinner: [4, 5]}, blackout: "June-September", rules: "Lobster dishes, dry aged and wagyu steaks, specials and additions excluded." },
  { id: 'annies', name: "Annie's", offer: {breakfast: [1, 2, 3, 4], lunch: [1, 2, 3, 4], dinner: []}, rules: "18 % gratuity will be added to the total bill prior to the deduction" },
  { id: 'anthonys', name: "Anthony's Seafood", url: "https://anthonysseafood.net/", offer: {breakfast: [], lunch: [0, 1, 3, 4, 5, 6], dinner: [0, 1, 3, 4, 5, 6]} },
  { id: 'bagel-boys', name: 'Bagel Boys', status: 'seasonal', offer: {breakfast: [0, 1, 2, 3, 6], lunch: [0, 1, 2, 3, 6], dinner: []}, blackout: "Not valid June 15th - September 15th" },
  { id: 'bar-12', name: 'Bar 12', url: 'https://www.bar12newport.com', offer: {breakfast: [], lunch: [], dinner: [2, 3, 4, 5, 6]} },
  { id: 'ben-jerrys', name: "Ben and Jerry's", url: 'https://www.benjerry.com/thamesstreet', offer: {breakfast: [0, 1, 2, 3, 4, 5, 6], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'benjamins', name: "Benjamin's Raw Bar", url: 'https://www.benjaminsrawbar.com/', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 3, 4]}, blackout: "During winter closed on Wednesdays. Not valid June, July, August", rules: "Valid for dine-in only. A 20% gratuity will be added to the total bill prior to the deduction." },
  { id: 'brick-alley', name: 'Brick Alley Pub', url: 'https://www.brickalley.com', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'caleb-broad', name: 'Caleb & Broad', url: 'http://www.calebandbroad.com/', offer: {breakfast: [5, 6], lunch: [5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'claw-hammer', name: 'Claw & Hammer', url: 'https://www.clawnhammer.com/', offer: {breakfast: [], lunch: [2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'cluck-house', name: 'Cluck House', url: 'https://cluckhousenewport.com', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'the-deck', name: '@ The Deck', url: 'http://www.waiteswharf.com/', status: 'seasonal', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4], dinner: [0, 1, 2, 3, 4, 5, 6]}, blackout: "Valid: Inside Sun thru Sat 4:30pm-8:30pm Outside Mon thru Fri 12:00pm-4:00pm (April thru Oct.) NOTE: OCT THRU DEC. Inside Closed Mon thru Wed CLOSED JAN THRU MARCH Visit website to verify hours NOT VALID ON TAKE-OUT", rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'diegos-newport', name: "Diego's Newport", url: "https://diegosnewport.com/", status: 'seasonal', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4], dinner: []}, blackout: "All of July and August" },
  { id: 'east-ferry', name: 'East Ferry Deli', url: 'https://eastferrydeli.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: []} },
  { id: 'flos', name: "Flo's Clam Shack", url: 'https://flosclamshacks.com/', note: 'Heritage Restaurant Group', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'food-shack', name: 'The Food Shack', url: 'https://www.401foodshack.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5], dinner: [0, 1, 2, 3, 4, 5]} },
  { id: 'foodworks', name: 'Foodworks', url: 'https://www.foodworksfamilyrestaurant.com/', offer: {breakfast: [0, 1, 2, 3, 4], lunch: [0, 1, 2, 3, 4], dinner: []}, rules: "A 20% gratuity will be added to the total bill prior to the deduction." },
  { id: 'hooked', name: 'Hooked', url: 'https://hooked-newport.com', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 6]}, blackout: "Blackout Months of June July August September", rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'jos', name: "Jo's American Bistro", url: 'https://josamericanbistro.com', offer: {breakfast: [], lunch: [5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'jt-commons', name: 'JT Commons', url: 'https://www.jtcommonsrestaurant.com', status: 'seasonal', offer: {breakfast: [], lunch: [0, 1, 2, 3, 6], dinner: [0, 1, 2, 3, 6]}, blackout: "Not valid June 15th - September 15th", rules: "Dine-in only. Not valid on take-out orders. Not valid all holidays. Not valid with any other promotion or discount. Gratuity not included. Please tip your server on total value of check prior to deduction." },
  { id: 'la-forge', name: 'La Forge Casino Restaurant', url: 'https://laforgenewport.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'lucia', name: 'Lucia Restaurant & Pizzeria', url: 'http://www.luciarestaurant.com/', status: 'seasonal', offer: {breakfast: [], lunch: [5, 6], dinner: [0, 1, 3, 4, 5, 6]}, blackout: "July and August valid Sun. thru Thu. until 6:30 pm, not valid on Fridays and Saturdays dinners, and not valid from 12/24/26 to 1/2/2027", rules: "valid dinner Sun. thru Thurs. 5:00-9:00/valid dinner Fri. and Sat. 5:00-7:00. SPECIALS AND VEAL DISHES ARE EXCLUDED. A gratuity of 20% might be added to the total bill prior to the deduction." },
  { id: 'mainsail', name: 'MainSail Restaurant', url: 'https://www.marriott.com/en-us/hotels/pvdlw-newport-marriott/dining/mainsail-restaurant/', offer: {breakfast: [], lunch: [], dinner: [3, 4, 5]}, rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'marcos-cafe', name: "Marco's Cafe", url: "https://www.marcoscafenewport.com/", offer: {breakfast: [0, 1, 2, 3, 4, 5, 6], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: []}, rules: "Valid on any small or medium sandwich." },
  { id: 'marcos', name: "Marco's Subs", url: 'https://www.marcosri.com', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: []}, rules: "Valid on any small or medium sandwich." },
  { id: 'martinos', name: "Martino's Pizzeria", url: 'http://martinospizzeria.com/', offer: {breakfast: [], lunch: [1, 2, 3], dinner: [1, 2, 3]} },
  { id: 'mooring', name: 'The Mooring Seafood Kitchen', url: 'http://www.mooringrestaurant.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 6], dinner: [0, 1, 2, 3, 6]} },
  { id: 'north-end', name: 'The North End Pizzeria', url: 'http://www.northendpizzeria.com/', offer: {breakfast: [], lunch: [4, 5], dinner: [4, 5]}, rules: "Not valid on take-out and delivery items." },
  { id: 'obriens', name: "O'Brien's Pub", url: 'http://www.theobrienspub.com/', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 3, 6]}, blackout: "Not valid June, July, August", rules: "Valid on entrees only. Dine-in only, not valid on take-out. No split meals. Not valid on holiday weekends. An 18% gratuity will be added to the total bill prior to the deduction." },
  { id: 'pasta-vino', name: "Pasta Vino Trattoria", url: "https://Pastavinori.com", status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 6]}, blackout: "Blackout Months of June July August September", rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'perro-salado', name: 'Perro Salado', url: 'http://www.perrosalado.com', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 3]}, blackout: "July 1st through October 1st", rules: "Gratuity not included. Please tip your server on total value of check prior to deduction." },
  { id: 'pickles', name: 'Pickles A Deli', url: 'https://www.picklesdeliri.com', offer: {breakfast: [0, 1, 2, 3, 4], lunch: [0, 1, 2, 3, 4], dinner: []} },
  { id: 'portsmouth-publick', name: 'Portsmouth Publick House', url: 'http://www.portsmouthpublickhouse.com/', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 3, 6]}, blackout: "Not valid June 15th - September 15th", rules: "One card per table. Not valid with other coupons. Not valid on take-out. A 20% gratuity will be added to the total bill prior to the deduction." },
  { id: 'pour-judgement', name: 'Pour Judgement', url: 'https://www.pourjudgementnewport.com', offer: {breakfast: [], lunch: [0, 1, 2, 3], dinner: [0, 1, 2, 3]}, rules: "Does not include Lobster dishes or any specials!" },
  { id: 'prudence', name: "Prudence", url: "https://prudencebristol.com", status: 'seasonal', offer: {breakfast: [], lunch: [2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]}, blackout: "July 1st - July 6th", rules: "No discount on lobster rolls. 20% Gratuity must be added before discount is applied." },
  { id: 'quencher', name: 'Quencher', url: 'https://www.thequenchernewport.com', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'red-parrot', name: 'The Red Parrot', url: 'http://www.redparrotrestaurant.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'reef', name: 'The Reef', url: 'https://thereefnewport.com/', offer: {breakfast: [0, 1, 2, 3, 4, 5, 6], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'skiff-bar', name: 'Skiff Bar', url: 'http://mainsail-restaurant.com/skiff-bar/', note: 'At the Newport Marriott', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]}, rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'tavern-broadway', name: 'Tavern on Broadway', url: 'http://www.tavernonbroadway.com/', offer: {breakfast: [], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'vieste', name: 'Viesté', url: 'https://viestesimplyitalian.com', status: 'seasonal', offer: {breakfast: [], lunch: [], dinner: [0, 1, 2, 6]}, blackout: "Blackout Months of June July August September", rules: "A 20% gratuity will be added to the total bill prior to the deduction" },
  { id: 'wallys', name: "Wally's Wieners", url: 'https://www.wallyswieners.com/', offer: {breakfast: [0, 1, 2, 3, 4, 5, 6], lunch: [0, 1, 2, 3, 4, 5, 6], dinner: [0, 1, 2, 3, 4, 5, 6]} },
  { id: 'wharf-southern', name: "Wharf Coastal Seafood & Tavern", url: "https://wharfcoastalseafood.com/", status: 'seasonal', offer: {breakfast: [], lunch: [0, 1, 2, 3, 6], dinner: [0, 1, 2, 3, 6]}, blackout: "Not available July and August.", rules: "Only the Tavern side is participating, seafood side is closed" },
];

// No sample members. A digital card would check the Square customer list.
const DEMO_MEMBERS = [];

// Heritage Restaurant Group venues on the Dinner Club list. They get member-level detail (names, emails) for
// marketing, from members who opted in. Reef, Claw & Hammer, Cluck House, Jo's, La Forge and Quencher added 2026-10-09 from our Toast/DoorDash/ad lists;
// Quencher confirmed by Michael 2026-10-09; Heritage should still confirm the rest before launch.
const HRG_VENUES = ['brick-alley', 'caleb-broad', 'claw-hammer', 'cluck-house', 'jos', 'la-forge', 'quencher', 'red-parrot', 'reef', 'wallys', 'flos', 'flos-drive-in', 'mews'];
