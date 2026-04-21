// Catalogo prodotti Amazon.it — si carica automaticamente
const TAG = 'prezzotop08-21';
function amz(asin) { return `https://www.amazon.it/dp/${asin}?tag=${TAG}`; }

const CATALOG = [
  // ELETTRONICA
  { asin:'B0CLVR4WFW', title:'Fire TV Stick 4K Max con Alexa Voice Remote', cat:'elettronica', price:69.99, orig:79.99, img:'https://m.media-amazon.com/images/I/51TjJOTfslL._AC_SX466_.jpg' },
  { asin:'B09ZCTG3TZ', title:'Echo Dot (5ª gen.) con Alexa — Antracite', cat:'elettronica', price:54.99, orig:69.99, img:'https://m.media-amazon.com/images/I/71h6dRi0n5L._AC_SX466_.jpg' },
  { asin:'B0C4DFMTBF', title:'Echo Pop con Alexa — Bianco ghiaccio', cat:'elettronica', price:39.99, orig:54.99, img:'https://m.media-amazon.com/images/I/61G54MFMR0L._AC_SX466_.jpg' },
  { asin:'B0D3J9SN2D', title:'Kindle Paperwhite 16 GB — Nero', cat:'elettronica', price:159.99, orig:199.99, img:'https://m.media-amazon.com/images/I/61PsK3H1gYL._AC_SX466_.jpg' },
  { asin:'B08BHWZL6J', title:'TP-Link Deco XE75 WiFi 6E Mesh 3 pezzi', cat:'elettronica', price:119.99, orig:179.99, img:'https://m.media-amazon.com/images/I/61EexJP-ZDL._AC_SX466_.jpg' },
  { asin:'B09G9HD8PD', title:'Anker PowerCore 26800 Batteria Esterna USB-C', cat:'elettronica', price:39.99, orig:59.99, img:'https://m.media-amazon.com/images/I/61S8H6j4rZL._AC_SX466_.jpg' },
  { asin:'B07YD3STBS', title:'Oral-B iO Series 4 Spazzolino Elettrico', cat:'moda', price:49.99, orig:89.99, img:'https://m.media-amazon.com/images/I/51VC2--SOEL._AC_SX466_.jpg' },
  { asin:'B09JQL2MGX', title:'Bose QuietComfort 45 Cuffie Bluetooth ANC', cat:'elettronica', price:249.00, orig:329.00, img:'https://m.media-amazon.com/images/I/51yBg9djKNL._AC_SX466_.jpg' },
  { asin:'B07PW9VBK5', title:'iRobot Roomba 692 Robot Aspirapolvere WiFi', cat:'casa', price:199.00, orig:299.00, img:'https://m.media-amazon.com/images/I/71km5lFCUXL._AC_SX466_.jpg' },
  { asin:'B0BW7CJHRD', title:'Tefal Easy Fry Precision Friggitrice ad Aria 4.2L', cat:'casa', price:79.99, orig:129.99, img:'https://m.media-amazon.com/images/I/71U0f7p7LBL._AC_SX466_.jpg' },
  { asin:'B0CX1VFZNY', title:'Samsung Galaxy Buds3 Pro Auricolari Wireless ANC', cat:'elettronica', price:149.00, orig:219.00, img:'https://m.media-amazon.com/images/I/61S9YGZSYsL._AC_SX466_.jpg' },
  { asin:'B0BX5KCHKY', title:'Govee Striscia LED 10m RGBIC Smart WiFi Alexa', cat:'casa', price:24.99, orig:44.99, img:'https://m.media-amazon.com/images/I/71-YdKmyUUL._AC_SX466_.jpg' },
  { asin:'B0C68KWKQB', title:'Bosch Aspirapolvere Senza Sacchetto Serie 4', cat:'casa', price:89.99, orig:139.99, img:'https://m.media-amazon.com/images/I/61z4oB8AXYL._AC_SX466_.jpg' },
  { asin:'B09RX4XV7J', title:'LEGO Technic McLaren Formula 1 Race Car 42141', cat:'gadget', price:89.99, orig:129.99, img:'https://m.media-amazon.com/images/I/81j5oBRFRaL._AC_SX466_.jpg' },
  { asin:'B08N5KWB9H', title:'Philips Hue White Starter Kit E27 con Bridge', cat:'casa', price:69.99, orig:99.99, img:'https://m.media-amazon.com/images/I/71xoR4A6iYL._AC_SX466_.jpg' },
  { asin:'B09V3KXJPB', title:'Xiaomi Redmi Watch 3 Smartwatch AMOLED GPS', cat:'elettronica', price:59.99, orig:89.99, img:'https://m.media-amazon.com/images/I/61VYTfN0SQL._AC_SX466_.jpg' },
  { asin:'B0C6ZMKDCP', title:'Xiaomi Redmi Buds 5 Pro ANC 52dB Hi-Res', cat:'elettronica', price:49.99, orig:79.99, img:'https://m.media-amazon.com/images/I/61UhBEu+X2L._AC_SX466_.jpg' },
  { asin:'B0CGQ8PDRH', title:'Anker SOLIX C300 Generatore Solare Portatile 288Wh', cat:'elettronica', price:299.00, orig:399.00, img:'https://m.media-amazon.com/images/I/71X7z9KXPJL._AC_SX466_.jpg' },
  { asin:'B08C4KQ6TD', title:'Razer DeathAdder V2 Mouse Gaming 20000 DPI', cat:'elettronica', price:39.99, orig:69.99, img:'https://m.media-amazon.com/images/I/71yTJcYYinL._AC_SX466_.jpg' },
  { asin:'B07QR73T66', title:'Logitech MX Master 3 Mouse Wireless Avanzato', cat:'elettronica', price:79.99, orig:119.99, img:'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SX466_.jpg' },
  // CASA
  { asin:'B08HLXD7KX', title:'Instant Pot Duo 7-in-1 Pentola a Pressione 5.7L', cat:'casa', price:79.99, orig:129.99, img:'https://m.media-amazon.com/images/I/71TvPm9XTOL._AC_SX466_.jpg' },
  { asin:'B07GJBBGHG', title:'Nespresso Vertuo Next Macchina Caffè Capsule', cat:'casa', price:99.99, orig:159.99, img:'https://m.media-amazon.com/images/I/61NqrX7SHEL._AC_SX466_.jpg' },
  { asin:'B09MNHSP4D', title:'WD 1TB My Passport SSD Esterno USB-C', cat:'elettronica', price:79.99, orig:109.99, img:'https://m.media-amazon.com/images/I/61lXfPvzCNL._AC_SX466_.jpg' },
  { asin:'B07RR5GQ4H', title:'Shark IZ300EUT Aspirapolvere Senza Filo Anti-Groviglio', cat:'casa', price:149.00, orig:229.00, img:'https://m.media-amazon.com/images/I/71cjrNe3nnL._AC_SX466_.jpg' },
  { asin:'B085WTYQ4X', title:'iRobot Braava Jet m6 Robot Lavapavimenti WiFi', cat:'casa', price:349.00, orig:449.00, img:'https://m.media-amazon.com/images/I/71Sz2KqjkFL._AC_SX466_.jpg' },
  // MODA & BELLEZZA
  { asin:'B08NLJQBCM', title:'Philips OneBlade QP2724 Rifinitore e Rasoio', cat:'moda', price:29.99, orig:49.99, img:'https://m.media-amazon.com/images/I/61GfYzD4GFL._AC_SX466_.jpg' },
  { asin:'B07VJY58G4', title:'Remington Ferro per Capelli Slim 230°C Ceramica', cat:'moda', price:24.99, orig:39.99, img:'https://m.media-amazon.com/images/I/61q2wKXQ6dL._AC_SX466_.jpg' },
  { asin:'B0C1B8FHYR', title:'Dyson Airwrap Complete Long — Rame/Nichel', cat:'moda', price:479.99, orig:549.99, img:'https://m.media-amazon.com/images/I/51V2JOkQ7LL._AC_SX466_.jpg' },
  // SPORT
  { asin:'B0B4MWCFBX', title:'Garmin Forerunner 55 GPS Running Smartwatch', cat:'sport', price:149.99, orig:199.99, img:'https://m.media-amazon.com/images/I/61jD4rsPd5L._AC_SX466_.jpg' },
  { asin:'B09BCLG8ZG', title:'Wahoo KICKR SNAP Rullo Bici Smart Trainer', cat:'sport', price:299.00, orig:399.00, img:'https://m.media-amazon.com/images/I/71FkHqCVPUL._AC_SX466_.jpg' },
  // GADGET
  { asin:'B09G3HRMKQ', title:'LEGO Icons Botanica Bouquet Fiori 10280', cat:'gadget', price:44.99, orig:59.99, img:'https://m.media-amazon.com/images/I/81F-GkEUjbL._AC_SX466_.jpg' },
  { asin:'B0BNJ796KJ', title:'Polaroid Now Gen 2 Fotocamera Istantanea', cat:'gadget', price:99.99, orig:139.99, img:'https://m.media-amazon.com/images/I/61uqQi1HQZL._AC_SX466_.jpg' },
  { asin:'B08L5TNJHG', title:'Tile Mate (2022) Localizzatore Bluetooth 4 pezzi', cat:'gadget', price:34.99, orig:49.99, img:'https://m.media-amazon.com/images/I/71LgmwJSqXL._AC_SX466_.jpg' },
];

// Aggiunge URL affiliato a ogni prodotto
CATALOG.forEach(p => { p.url = amz(p.asin); p.id = 'cat-' + p.asin; });
