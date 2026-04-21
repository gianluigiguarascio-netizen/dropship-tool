const T = 'prezzotop08-21';
const u = a => `https://www.amazon.it/dp/${a}?tag=${T}`;

const CATALOG = [
  // ELETTRONICA
  {asin:'B0CLVR4WFW',title:'Amazon Fire TV Stick 4K Max con Alexa Voice Remote',cat:'elettronica',price:69.99,orig:79.99,img:'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SX466_.jpg'},
  {asin:'B09ZCTG3TZ',title:'Amazon Echo Dot 5ª gen. Altoparlante intelligente con Alexa',cat:'elettronica',price:54.99,orig:69.99,img:'https://m.media-amazon.com/images/I/71h6dRi0n5L._AC_SX466_.jpg'},
  {asin:'B0C4DFMTBF',title:'Amazon Echo Pop Altoparlante Bluetooth con Alexa',cat:'elettronica',price:34.99,orig:54.99,img:'https://m.media-amazon.com/images/I/61G54MFMR0L._AC_SX466_.jpg'},
  {asin:'B0D3J9SN2D',title:'Kindle Paperwhite 16 GB e-reader schermo antiriflesso',cat:'elettronica',price:159.99,orig:199.99,img:'https://m.media-amazon.com/images/I/61PsK3H1gYL._AC_SX466_.jpg'},
  {asin:'B09JQL2MGX',title:'Bose QuietComfort 45 Cuffie Bluetooth con ANC',cat:'elettronica',price:249.00,orig:329.00,img:'https://m.media-amazon.com/images/I/51yBg9djKNL._AC_SX466_.jpg'},
  {asin:'B07QR73T66',title:'Logitech MX Master 3 Mouse Wireless per Mac e PC',cat:'elettronica',price:79.99,orig:119.99,img:'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SX466_.jpg'},
  {asin:'B09G9HD8PD',title:'Anker PowerCore 26800 Batteria Esterna USB-C 65W',cat:'elettronica',price:39.99,orig:59.99,img:'https://m.media-amazon.com/images/I/61S8H6j4rZL._AC_SX466_.jpg'},
  {asin:'B08C4KQ6TD',title:'Razer DeathAdder V2 Mouse Gaming 20000 DPI RGB',cat:'elettronica',price:39.99,orig:69.99,img:'https://m.media-amazon.com/images/I/71yTJcYYinL._AC_SX466_.jpg'},
  {asin:'B09MNHSP4D',title:'WD 1TB My Passport SSD Esterno Portatile USB-C',cat:'elettronica',price:79.99,orig:109.99,img:'https://m.media-amazon.com/images/I/61lXfPvzCNL._AC_SX466_.jpg'},
  {asin:'B08BHWZL6J',title:'TP-Link Deco XE75 WiFi 6E Mesh 3 pezzi Tri-Band',cat:'elettronica',price:119.99,orig:179.99,img:'https://m.media-amazon.com/images/I/61EexJP-ZDL._AC_SX466_.jpg'},
  {asin:'B0CX1VFZNY',title:'Samsung Galaxy Buds3 Pro Auricolari Wireless ANC',cat:'elettronica',price:149.00,orig:219.00,img:'https://m.media-amazon.com/images/I/61S9YGZSYsL._AC_SX466_.jpg'},
  {asin:'B09V3KXJPB',title:'Xiaomi Redmi Watch 3 Smartwatch AMOLED GPS NFC',cat:'elettronica',price:59.99,orig:89.99,img:'https://m.media-amazon.com/images/I/61VYTfN0SQL._AC_SX466_.jpg'},
  {asin:'B0C6ZMKDCP',title:'Xiaomi Redmi Buds 5 Pro ANC 52dB Hi-Res Audio',cat:'elettronica',price:49.99,orig:79.99,img:'https://m.media-amazon.com/images/I/61UhBEu+X2L._AC_SX466_.jpg'},
  // CASA
  {asin:'B07PW9VBK5',title:'iRobot Roomba 692 Robot Aspirapolvere WiFi Alexa',cat:'casa',price:199.00,orig:299.00,img:'https://m.media-amazon.com/images/I/71km5lFCUXL._AC_SX466_.jpg'},
  {asin:'B0BW7CJHRD',title:'Tefal Easy Fry Precision Friggitrice ad Aria 4.2L',cat:'casa',price:79.99,orig:129.99,img:'https://m.media-amazon.com/images/I/71U0f7p7LBL._AC_SX466_.jpg'},
  {asin:'B08N5KWB9H',title:'Philips Hue White Starter Kit E27 con Bridge',cat:'casa',price:69.99,orig:99.99,img:'https://m.media-amazon.com/images/I/71xoR4A6iYL._AC_SX466_.jpg'},
  {asin:'B0BX5KCHKY',title:'Govee Striscia LED 10m RGBIC Smart WiFi Alexa',cat:'casa',price:24.99,orig:44.99,img:'https://m.media-amazon.com/images/I/71-YdKmyUUL._AC_SX466_.jpg'},
  {asin:'B07GJBBGHG',title:'Nespresso Vertuo Next Macchina Caffè con Aeroccino',cat:'casa',price:99.99,orig:159.99,img:'https://m.media-amazon.com/images/I/61NqrX7SHEL._AC_SX466_.jpg'},
  {asin:'B08HLXD7KX',title:'Instant Pot Duo 7-in-1 Pentola Pressione Elettrica 5.7L',cat:'casa',price:79.99,orig:129.99,img:'https://m.media-amazon.com/images/I/71TvPm9XTOL._AC_SX466_.jpg'},
  {asin:'B0C68KWKQB',title:'Bosch Serie 4 Aspirapolvere Senza Sacchetto 700W',cat:'casa',price:89.99,orig:139.99,img:'https://m.media-amazon.com/images/I/61z4oB8AXYL._AC_SX466_.jpg'},
  {asin:'B07RR5GQ4H',title:'Shark IZ300EUT Aspirapolvere Senza Filo Anti-Groviglio',cat:'casa',price:149.00,orig:229.00,img:'https://m.media-amazon.com/images/I/71cjrNe3nnL._AC_SX466_.jpg'},
  // MODA & BELLEZZA
  {asin:'B07YD3STBS',title:'Oral-B iO Series 4 Spazzolino Elettrico Ricaricabile',cat:'moda',price:49.99,orig:89.99,img:'https://m.media-amazon.com/images/I/51VC2--SOEL._AC_SX466_.jpg'},
  {asin:'B08NLJQBCM',title:'Philips OneBlade QP2724 Rifinitore e Rasoio',cat:'moda',price:29.99,orig:49.99,img:'https://m.media-amazon.com/images/I/61GfYzD4GFL._AC_SX466_.jpg'},
  {asin:'B07VJY58G4',title:'Remington Ferro per Capelli Slim 230°C Ceramica',cat:'moda',price:24.99,orig:39.99,img:'https://m.media-amazon.com/images/I/61q2wKXQ6dL._AC_SX466_.jpg'},
  {asin:'B0C1B8FHYR',title:'Dyson Airwrap Complete Long Styler Capelli',cat:'moda',price:479.99,orig:549.99,img:'https://m.media-amazon.com/images/I/51V2JOkQ7LL._AC_SX466_.jpg'},
  // GADGET
  {asin:'B09RX4XV7J',title:'LEGO Technic McLaren Formula 1 Race Car 42141',cat:'gadget',price:89.99,orig:129.99,img:'https://m.media-amazon.com/images/I/81j5oBRFRaL._AC_SX466_.jpg'},
  {asin:'B09G3HRMKQ',title:'LEGO Icons Botanica Bouquet di Fiori 10280',cat:'gadget',price:44.99,orig:59.99,img:'https://m.media-amazon.com/images/I/81F-GkEUjbL._AC_SX466_.jpg'},
  {asin:'B0BNJ796KJ',title:'Polaroid Now Gen 2 Fotocamera Istantanea i-Type',cat:'gadget',price:99.99,orig:139.99,img:'https://m.media-amazon.com/images/I/61uqQi1HQZL._AC_SX466_.jpg'},
  {asin:'B08L5TNJHG',title:'Tile Mate 2022 Localizzatore Bluetooth 4 pezzi',cat:'gadget',price:34.99,orig:49.99,img:'https://m.media-amazon.com/images/I/71LgmwJSqXL._AC_SX466_.jpg'},
  // SPORT
  {asin:'B0B4MWCFBX',title:'Garmin Forerunner 55 GPS Smartwatch Running',cat:'sport',price:149.99,orig:199.99,img:'https://m.media-amazon.com/images/I/61jD4rsPd5L._AC_SX466_.jpg'},
  {asin:'B09BCLG8ZG',title:'Wahoo KICKR SNAP Rullo Bici Smart Trainer WiFi',cat:'sport',price:299.00,orig:399.00,img:'https://m.media-amazon.com/images/I/71FkHqCVPUL._AC_SX466_.jpg'},
  {asin:'B08GKJCBTQ',title:'Amazfit GTR 3 Pro Smartwatch GPS AMOLED',cat:'sport',price:99.99,orig:149.99,img:'https://m.media-amazon.com/images/I/61iyHLh0FkL._AC_SX466_.jpg'},
].map(p => ({...p, url: u(p.asin)}));
