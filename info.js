// Restaurant contact, menu and booking details, researched 2026-10-08 from each restaurant's own
// website (10 research agents; third-party sources only where noted as partial in the review file).
// Merged into RESTAURANTS by id at load. Re-check before launch; restaurants change these often.
const RESTAURANT_INFO = {
 "annies": {
  "address": "176 Bellevue Avenue, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 849-6731",
  "url": "https://anniesnewport.com/",
  "menu": "https://anniesnewport.com/menu-2/",
  "_confidence": "verified"
 },
 "aquidneck-pizzeria": {
  "address": "27 Aquidneck Ave, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 849-3356",
  "url": "https://aqpizza.com",
  "menu": "https://aqpizza.com/menus",
  "order": "https://aquidneck-newport.foodtecsolutions.com",
  "_confidence": "verified"
 },
 "bagel-boys": {
  "address": "747 Aquidneck Ave, Unit 4, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 841-5514",
  "_confidence": "partial"
 },
 "bar-12": {
  "address": "12 Broadway, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-7101",
  "url": "https://www.bar12newport.com",
  "menu": "https://www.bar12newport.com/menu",
  "_confidence": "verified"
 },
 "beckys-bbq": {
  "address": "82 East Main Road, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 841-9909",
  "url": "https://beckysbbq.com",
  "menu": "https://beckysbbq.com/our-menu/",
  "_confidence": "verified"
 },
 "ben-jerrys": {
  "address": "359 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "url": "https://www.benjerry.com/thamesstreet",
  "_confidence": "partial"
 },
 "benjamins": {
  "address": "254 Thames St, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 846-8768",
  "url": null,
  "_confidence": "partial"
 },
 "blue-plate": {
  "address": "665 W Main Road, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 848-9500",
  "url": "https://www.blueplatedinerri.com",
  "menu": "https://www.blueplatedinerri.com/lunch-dinner",
  "_confidence": "verified"
 },
 "boat-house": {
  "address": "227 Schooner Dr, Tiverton, RI 02878",
  "town": "Tiverton",
  "phone": "(401) 624-6300",
  "url": "https://www.boathousetiverton.com",
  "reserve": null,
  "reservePlatform": "OpenTable",
  "_confidence": "verified",
  "note": "Closed for renovations, reopening late spring 2027 (per its website)",
  "status": "later"
 },
 "brick-alley": {
  "address": "140 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 849-6334",
  "url": "https://www.brickalley.com",
  "menu": "https://www.brickalley.com/food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/brick-alley",
  "reservePlatform": "Resy",
  "order": "https://order.toasttab.com/online/brick-alley-pub-restaurant-140-thames-st",
  "_confidence": "verified"
 },
 "buskers": {
  "address": "178 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 846-5856",
  "url": null,
  "menu": null,
  "reserveByPhone": true,
  "_confidence": "verified",
  "order": null
 },
 "caleb-broad": {
  "address": "162 Broadway, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-5955",
  "url": "https://www.calebandbroad.com/",
  "menu": "https://www.calebandbroad.com/newport-caleb-and-broad-food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/caleb-and-broad",
  "reservePlatform": "Resy",
  "order": "https://order.toasttab.com/online/caleb-and-broad-hrg-162-broadway",
  "_confidence": "verified"
 },
 "claw-hammer": {
  "address": "527 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 846-3474",
  "url": "https://www.clawnhammer.com/",
  "menu": "https://www.clawnhammer.com/menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/claw-and-hammer",
  "reservePlatform": "Resy",
  "order": "https://www.doordash.com/store/claw-and-hammer-newport-51832495/119894025/",
  "_confidence": "verified"
 },
 "cluck-house": {
  "address": "515 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 399-7845",
  "url": "https://cluckhousenewport.com",
  "menu": "https://cluckhousenewport.com/newport-cluck-house-food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/cluck-house",
  "reservePlatform": "Resy",
  "_confidence": "verified"
 },
 "the-deck": {
  "address": "1 Waites Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": null,
  "_confidence": "partial",
  "url": null,
  "reserve": null
 },
 "diegos": {
  "address": "116 Aquidneck Ave., Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 619-1717",
  "url": "https://www.diegosmiddletown.com/",
  "menu": "https://www.diegosmiddletown.com/new-page-3",
  "reserve": "https://tables.toasttab.com/restaurants/449cd85b-17c7-442f-bc16-91299d11a439/findTime",
  "reservePlatform": "Toast Tables",
  "order": "https://order.toasttab.com/online/diegos-middletown-116-aquidneck-avenue",
  "_confidence": "verified"
 },
 "east-ferry": {
  "address": "47 Conanicus Avenue, Jamestown, RI 02835",
  "town": "Jamestown",
  "phone": "(401) 423-1592",
  "url": "https://eastferrydeli.com/",
  "menu": "https://eastferrydeli.com/",
  "_confidence": "verified"
 },
 "food-shack": {
  "address": "1130 Aquidneck Avenue, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 847-9283",
  "url": "https://www.401foodshack.com/",
  "menu": "https://www.401foodshack.com/menu/",
  "order": "https://order.401foodshack.com/order/thefoodshack",
  "_confidence": "verified"
 },
 "foodworks": {
  "address": "2461 East Main Road, Portsmouth, RI 02871",
  "town": "Portsmouth",
  "phone": "(401) 683-4664",
  "url": "https://www.foodworksfamilyrestaurant.com/",
  "menu": "https://www.foodworksfamilyrestaurant.com/menu",
  "order": "https://www.toasttab.com/foodworks-restaurant-2461-east-main-road",
  "_confidence": "verified"
 },
 "helmway": {
  "address": "425 E Main Rd, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 214-1413",
  "url": "https://www.thehelmway.com",
  "menu": "https://www.thehelmway.com/dinner",
  "_confidence": "verified"
 },
 "hooked": {
  "address": "580 Thames St., Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-5807",
  "url": "https://hookednewport.com/",
  "menu": "https://hookednewport.com/menu/",
  "reserve": "https://www.opentable.com/restref/client/?rid=1423297&restref=1423297&lang=en-US",
  "reservePlatform": "OpenTable",
  "_confidence": "verified"
 },
 "hungry-monkey": {
  "address": "124 Broadway, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-4433",
  "url": "https://hungrymonkeycafe.com/",
  "menu": "https://hungrymonkeycafe.com/menu/",
  "order": "https://hungrymonkeycafe.square.site/",
  "_confidence": "verified"
 },
 "pocket-cafe": {
  "address": "52 E Main Rd, Middletown, RI 02842",
  "town": "Middletown",
  "_confidence": "partial",
  "url": null
 },
 "jos": {
  "address": "24 Memorial Blvd W, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 847-5506",
  "url": "https://josamericanbistro.com",
  "menu": "https://josamericanbistro.com/current-menu/",
  "reserve": "https://resy.com/cities/newport-ri/venues/jos-american-bistro",
  "reservePlatform": "Resy",
  "_confidence": "verified"
 },
 "jt-commons": {
  "address": "1037 Aquidneck Avenue, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 239-2990",
  "url": "https://www.jtcommonsrestaurant.com/",
  "menu": "https://www.jtcommonsrestaurant.com/menus/",
  "reserve": "https://www.jtcommonsrestaurant.com/#reservations",
  "reservePlatform": "OpenTable",
  "order": "https://newportrestaurantgroup.olo.com/menu/jt-commons",
  "_confidence": "verified"
 },
 "kitchen-table": {
  "address": "866 W. Main Road, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 324-5839",
  "url": "https://www.thekitchentableri.com",
  "menu": "https://www.newportpickleball.com/menu",
  "_confidence": "verified"
 },
 "la-forge": {
  "address": "186 Bellevue Avenue, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 847-0418",
  "url": "https://laforgenewport.com/",
  "menu": "https://laforgenewport.com/newport-la-forge-casino-restaurant-food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/la-forge",
  "reservePlatform": "Resy",
  "order": "https://order.toasttab.com/online/la-forge-casino-restaurant-186-bellevue-ave",
  "_confidence": "verified"
 },
 "lucia": {
  "address": "186B Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 846-4477",
  "url": "https://www.luciarestaurant.com/",
  "menu": "https://www.luciarestaurant.com/Menus",
  "reserve": "https://resy.com/cities/nwp/lucia-restaurant",
  "reservePlatform": "Resy",
  "order": "https://store37267827.shopsettings.com/",
  "_confidence": "verified"
 },
 "mainsail": {
  "address": "75 Long Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 848-6999",
  "url": "https://www.mainsail-restaurant.com/",
  "menu": "https://www.mainsail-restaurant.com/our-menus",
  "reserve": "https://www.opentable.com/r/mainsail-newport",
  "reservePlatform": "OpenTable",
  "_confidence": "verified"
 },
 "mamma-luisas": {
  "address": "673 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 848-5257",
  "url": "https://mammaluisa.com/",
  "menu": "https://mammaluisa.com/food/",
  "reserve": "https://resy.com/cities/newport-ri/venues/mamma-luisa-restaurant",
  "reservePlatform": "Resy",
  "_confidence": "verified"
 },
 "marcos": {
  "address": "2340 West Main Road, Portsmouth, RI 02871",
  "town": "Portsmouth",
  "phone": "(401) 251-4213",
  "url": "https://www.marcosri.com",
  "menu": "https://www.marcosri.com",
  "order": "https://marcossubsri.square.site/",
  "_confidence": "verified"
 },
 "martinos": {
  "address": "3001 East Main Road, Portsmouth, RI 02871",
  "town": "Portsmouth",
  "phone": "(401) 683-0880",
  "url": "https://www.martinospizzeria.com/",
  "menu": "https://www.martinospizzeria.com/pizza-calzones-menu",
  "_confidence": "verified"
 },
 "mooring": {
  "address": "1 Sayers Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 846-2260",
  "url": "https://www.mooringrestaurant.com/",
  "menu": "https://www.mooringrestaurant.com/menu/",
  "reserve": "https://www.opentable.com/restaurant/profile/6431/reserve?rid=6431&restref=6431",
  "reservePlatform": "OpenTable",
  "order": "https://newportrestaurantgroup.olo.com/menu/mooring?handoff=counterpickup",
  "_confidence": "verified"
 },
 "north-end": {
  "address": "3030 East Main Road, Portsmouth, RI 02871",
  "town": "Portsmouth",
  "phone": "(401) 683-6633",
  "url": null,
  "order": "https://thenorthendpizzeria.hungerrush.com/",
  "_confidence": "partial"
 },
 "obriens": {
  "address": "501 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 849-6623",
  "_confidence": "partial",
  "url": null,
  "menu": null
 },
 "one-bellevue": {
  "address": "1 Bellevue Avenue, Newport, RI 02840",
  "town": "Newport",
  "_confidence": "partial"
 },
 "one-pelham": {
  "address": "270 Thames St, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 847-9460",
  "url": "https://thepelham.com",
  "menu": "https://thepelham.com/menu/",
  "_confidence": "verified"
 },
 "perro-salado": {
  "address": "19 Charles St, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-4777",
  "url": "https://www.perrosalado.com",
  "menu": "https://www.perrosalado.com/menu",
  "reserve": "https://resy.com/cities/nwp/perro-salado",
  "reservePlatform": "Resy",
  "order": "https://search.katalystos.com/restaurant/perro-salado_perro-salado?mode=pickup",
  "_confidence": "verified"
 },
 "pickles": {
  "address": "936 Aquidneck Ave, Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 849-3950",
  "url": "https://www.picklesdeliri.com",
  "menu": "https://www.picklesdeliri.com",
  "order": "https://pickles-deli.square.site",
  "_confidence": "verified"
 },
 "portsmouth-publick": {
  "address": "600 Clock Tower Square, Portsmouth, RI 02871",
  "town": "Portsmouth",
  "phone": "(401) 682-2600",
  "url": "https://portsmouthpublickhouse.com/",
  "menu": "https://portsmouthpublickhouse.com/menu/",
  "order": "https://ordernow.menudrive.com/portsmouthpublickhouse",
  "_confidence": "verified"
 },
 "pour-judgement": {
  "address": "32 Broadway, Newport, RI 02840",
  "town": "Newport",
  "_confidence": "partial",
  "url": null
 },
 "quencher": {
  "address": "95 Long Wharf Mall, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-7356",
  "url": "https://www.thequenchernewport.com",
  "menu": "https://www.thequenchernewport.com/new-menu",
  "reserve": "https://tables.toasttab.com/restaurants/5625a6b7-039d-4fce-aa47-55fb61738407/findTime",
  "reservePlatform": "Toast Tables",
  "order": "https://toast.app/r/the-quencher-heritage/order",
  "_confidence": "verified"
 },
 "red-parrot": {
  "address": "348 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 847-3800",
  "url": "https://www.redparrotrestaurant.com/",
  "_confidence": "verified",
  "menu": "https://www.redparrotrestaurant.com/main-menu",
  "reserve": "https://tables.toasttab.com/restaurants/8919eb8c-e925-457f-9341-402c4b70fc32/findTime",
  "reservePlatform": "Toast Tables"
 },
 "reef": {
  "address": "10 Howard Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-5852",
  "url": "https://thereefnewport.com/",
  "menu": "https://thereefnewport.com/newport-the-reef-newport-food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/the-reef",
  "reservePlatform": "Resy",
  "_confidence": "verified"
 },
 "saltwater": {
  "address": "49 America's Cup Avenue, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 847-9000",
  "url": "https://www.newporthotel.com/saltwater-restaurant/",
  "menu": "https://www.newporthotel.com/site/assets/files/1/summer_dinner_menu_2026_august_reprint_less.pdf",
  "_confidence": "verified"
 },
 "1639": {
  "address": "1 Goat Island, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 849-2600",
  "url": "https://www.newportharborisland.com/dine/1639/",
  "menu": "https://www.newportharborisland.com/dine/1639/",
  "reserve": "https://www.opentable.com/r/1639-reservations-newport?restref=1087846&lang=en-US&ot_source=Restaurant%20website",
  "reservePlatform": "OpenTable",
  "_confidence": "verified"
 },
 "skiff-bar": {
  "address": "25 America's Cup Avenue, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 848-6902",
  "url": "https://www.marriott.com/en-us/hotels/pvdlw-newport-marriott/dining/skiff-bar",
  "menu": "https://taptastego.com/pvdlw/content/outlet/7650550f-ee86-43e8-9ea4-9c3c8ccd793b",
  "_confidence": "verified"
 },
 "smoke-house": {
  "address": "31 Scotts Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 848-9800",
  "url": "https://www.smokehousenewport.com/",
  "_confidence": "verified",
  "note": "Closed for the season, back spring 2027 (per its website)"
 },
 "stoneacre-brasserie": {
  "address": "28 Washington Square, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-7810",
  "url": "https://www.stoneacrebrasserie.com/",
  "menu": "https://www.stoneacrebrasserie.com/newport-historic-hill-stoneacre-brasserie-food-menu",
  "reserve": "https://resy.com/cities/nwp/stoneacre-brasserie",
  "reservePlatform": "Resy",
  "order": "https://www.toasttab.com/stoneacre-brasserie-28-washington-sq/v3/?mode=fulfillment",
  "_confidence": "verified"
 },
 "stoneacre-garden": {
  "address": "151 Swinburne Row, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-8400",
  "url": "https://www.stoneacregarden.com/",
  "menu": "https://www.stoneacregarden.com/newport-brick-market-place-stoneacre-garden-food-menu",
  "reserve": "https://resy.com/cities/nwp/stoneacre-garden",
  "reservePlatform": "Resy",
  "order": "https://www.toasttab.com/stoneacre-garden-151-swinburne-row/v3/?mode=fulfillment",
  "_confidence": "verified"
 },
 "tavern-broadway": {
  "address": "16 Broadway, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-5675",
  "url": "https://www.tavernonbroadway.com/",
  "menu": "https://www.tavernonbroadway.com/menu",
  "reserveByPhone": true,
  "_confidence": "verified"
 },
 "titos": {
  "address": "651 West Main Rd., Middletown, RI 02842",
  "town": "Middletown",
  "phone": "(401) 849-4222",
  "url": "https://www.titos.com/",
  "menu": "https://www.titos.com/menu-1/",
  "_confidence": "verified"
 },
 "22-bowens": {
  "address": "22 Bowen's Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 841-8884",
  "url": "https://www.22bowens.com/",
  "menu": "https://www.22bowens.com/menu/",
  "reserve": "https://www.22bowens.com/#reservations",
  "reservePlatform": "OpenTable",
  "_confidence": "verified"
 },
 "vieste": {
  "address": "580 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-5905",
  "url": "https://viestesimplyitalian.com",
  "menu": "https://viestesimplyitalian.com/menu",
  "reserveByPhone": true,
  "_confidence": "verified"
 },
 "wallys": {
  "address": "464 Thames Street, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 236-1760",
  "url": "https://www.wallyswieners.com/",
  "menu": "https://www.wallyswieners.com/newport-wally-s-wieners-and-the-copper-club-food-menu",
  "reserve": "https://resy.com/cities/newport-ri/venues/wallys-newport",
  "reservePlatform": "Resy",
  "order": "https://order.online/store/wally%E2%80%99s-wieners-newport-22978851/?hideModal=true&pickup=true",
  "_confidence": "verified"
 },
 "wharf-fishhouse": {
  "address": "41 Bowen's Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-5377",
  "url": "https://wharffishhousenewport.com",
  "menu": "https://wharffishhousenewport.com/house-menus",
  "reserveByPhone": true,
  "order": "https://toast.app/r/fish-house-new-41-bowens-wharf-newport-ri-02840/order/r-0c3bd046-a12b-423b-a5c0-d4fbe30a0375",
  "_confidence": "verified"
 },
 "wharf-southern": {
  "address": "37 Bowen's Wharf, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 619-5672",
  "url": "https://wharfcoastalseafood.com/",
  "reserve": "https://toast.app/r/the-wharf-37-bowens-wharf",
  "reservePlatform": "Toast Tables",
  "_confidence": "verified",
  "note": "Its website now shows the name Wharf Fishhouse Coastal Seafood & Tavern"
 },
 "yagi": {
  "address": "20 Long Wharf Mall, Newport, RI 02840",
  "town": "Newport",
  "phone": "(401) 324-5098",
  "url": "https://www.yaginoodles.com",
  "menu": "https://www.yaginoodles.com/menu",
  "reserve": "https://eatapp.co/reserve/yagi-noodles-1d70ff",
  "reservePlatform": "Eat App",
  "order": "https://app.upserve.com/s/yagi-noodles-newport",
  "_confidence": "verified"
 }
};
RESTAURANTS.forEach(r => { const i = RESTAURANT_INFO[r.id]; if (i) Object.assign(r, i); });
