/**
 * DropShop — Gestione Prodotti
 * Prodotti demo precaricati + integrazione CJDropshipping
 */

// Database prodotti locale (demo)
// In produzione questi verranno caricati da Firebase/CJDropshipping
const PRODUCTS_DB = [
    // === ELETTRONICA ===
    {
        id: 'el-001',
        name: 'Auricolari Bluetooth TWS Pro',
        category: 'elettronica',
        supplierPrice: 8.50,
        price: 18.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
        images: [],
        description: 'Auricolari wireless con cancellazione del rumore, Bluetooth 5.3, autonomia 30 ore con custodia di ricarica. Perfetti per musica, chiamate e sport.',
        rating: 4.5,
        reviews: 234,
        badge: 'Bestseller',
        stock: 150,
        sku: 'CJ-TWS-001'
    },
    {
        id: 'el-002',
        name: 'Smartwatch Fitness Tracker',
        category: 'elettronica',
        supplierPrice: 12.00,
        price: 34.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop',
        images: [],
        description: 'Smartwatch con monitoraggio frequenza cardiaca, SpO2, sonno. Display AMOLED 1.7". Resistente all\'acqua IP68. Batteria fino a 7 giorni.',
        rating: 4.3,
        reviews: 189,
        badge: '-30%',
        stock: 80,
        sku: 'CJ-SW-002'
    },
    {
        id: 'el-004',
        name: 'Mini Proiettore Portatile HD',
        category: 'elettronica',
        supplierPrice: 35.00,
        price: 79.99,
        originalPrice: 99.99,
        image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=400&fit=crop',
        images: [],
        description: 'Proiettore portatile Full HD 1080p, luminosità 5000 lumen, schermo fino a 120". WiFi integrato, compatibile con Netflix e YouTube.',
        rating: 4.1,
        reviews: 87,
        badge: 'Novità',
        stock: 40,
        sku: 'CJ-PRJ-004'
    },
    // === MODA ===
    {
        id: 'mo-001',
        name: 'Occhiali da Sole Polarizzati UV400',
        category: 'moda',
        supplierPrice: 3.50,
        price: 12.99,
        originalPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
        images: [],
        description: 'Occhiali da sole unisex con lenti polarizzate UV400. Montatura leggera in TR90, design moderno vintage. Custodia inclusa.',
        rating: 4.4,
        reviews: 456,
        badge: '-48%',
        stock: 300,
        sku: 'CJ-SUN-001'
    },
    {
        id: 'mo-002',
        name: 'Zaino Antifurto USB Impermeabile',
        category: 'moda',
        supplierPrice: 11.00,
        price: 29.99,
        originalPrice: 44.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        images: [],
        description: 'Zaino da viaggio con porta USB esterna, tasca antifurto nascosta, tessuto impermeabile. Scomparto laptop 15.6". Capienza 25L.',
        rating: 4.7,
        reviews: 178,
        badge: 'Top',
        stock: 120,
        sku: 'CJ-BAG-002'
    },
    {
        id: 'mo-003',
        name: 'Orologio Minimalista Uomo/Donna',
        category: 'moda',
        supplierPrice: 6.00,
        price: 19.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
        images: [],
        description: 'Orologio elegante con quadrante minimalista, cinturino in maglia acciaio. Movimento al quarzo giapponese, impermeabile 3ATM.',
        rating: 4.2,
        reviews: 95,
        badge: '',
        stock: 90,
        sku: 'CJ-WTC-003'
    },
    // === CASA ===
    {
        id: 'ca-001',
        name: 'Lampada LED Smart RGB WiFi',
        category: 'casa',
        supplierPrice: 4.50,
        price: 14.99,
        originalPrice: 22.99,
        image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
        images: [],
        description: 'Lampadina smart WiFi E27, 16 milioni di colori RGB, compatibile con Alexa e Google Home. Programmabile, risparmio energetico.',
        rating: 4.5,
        reviews: 567,
        badge: 'Bestseller',
        stock: 400,
        sku: 'CJ-LED-001'
    },
    {
        id: 'ca-002',
        name: 'Diffusore Aromi Ultrasuoni 300ml',
        category: 'casa',
        supplierPrice: 7.00,
        price: 22.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop',
        images: [],
        description: 'Diffusore di oli essenziali a ultrasuoni, serbatoio 300ml, LED 7 colori, timer programmabile. Silenzioso, ideale per camera da letto.',
        rating: 4.6,
        reviews: 234,
        badge: '',
        stock: 150,
        sku: 'CJ-DIF-002'
    },
    {
        id: 'ca-003',
        name: 'Organizer da Scrivania Bambù',
        category: 'casa',
        supplierPrice: 8.00,
        price: 24.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=400&fit=crop',
        images: [],
        description: 'Organizer da scrivania in bambù naturale con supporto telefono, porta penne, vano tablet. Design elegante e sostenibile.',
        rating: 4.3,
        reviews: 67,
        badge: 'Eco',
        stock: 70,
        sku: 'CJ-ORG-003'
    },
    // === GADGET ===
    {
        id: 'ga-001',
        name: 'Mini Drone con Fotocamera 4K',
        category: 'gadget',
        supplierPrice: 22.00,
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
        images: [],
        description: 'Mini drone pieghevole con fotocamera 4K, stabilizzazione ottica, volo 20 minuti. Modalità follow-me, ritorno automatico. Perfetto per principianti.',
        rating: 4.0,
        reviews: 145,
        badge: 'Novità',
        stock: 55,
        sku: 'CJ-DRN-001'
    },
    {
        id: 'ga-002',
        name: 'Tastiera Meccanica RGB Wireless',
        category: 'gadget',
        supplierPrice: 15.00,
        price: 39.99,
        originalPrice: 54.99,
        image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop',
        images: [],
        description: 'Tastiera meccanica 65% con switch hot-swap, retroilluminazione RGB, connessione Bluetooth/2.4G/cavo USB-C. Layout compatto.',
        rating: 4.4,
        reviews: 203,
        badge: '',
        stock: 85,
        sku: 'CJ-KEY-002'
    },
    {
        id: 'ga-003',
        name: 'Power Bank Solare 20000mAh',
        category: 'gadget',
        supplierPrice: 9.00,
        price: 24.99,
        originalPrice: 39.99,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop',
        images: [],
        description: 'Caricatore portatile solare 20000mAh, 2 uscite USB + USB-C, ricarica rapida 22.5W. Resistente a urti e acqua. Ideale per outdoor.',
        rating: 4.2,
        reviews: 178,
        badge: '-37%',
        stock: 130,
        sku: 'CJ-PWR-003'
    },
    {
        id: 'ga-004',
        name: 'Supporto PC Portatile Ergonomico',
        category: 'gadget',
        supplierPrice: 7.50,
        price: 19.99,
        originalPrice: 27.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        images: [],
        description: 'Supporto laptop regolabile in alluminio, 6 livelli di altezza, ventilazione ottimale, pieghevole e portatile. Per laptop 10-17".',
        rating: 4.5,
        reviews: 321,
        badge: '',
        stock: 200,
        sku: 'CJ-STD-004'
    },
    {
        id: 'ga-005',
        name: 'Anello LED Selfie 26cm con Treppiede',
        category: 'gadget',
        supplierPrice: 9.00,
        price: 24.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop',
        images: [],
        description: 'Ring light 26cm con 3 colori di luce e 10 livelli di luminosità. Treppiede regolabile fino a 1.9m, supporto smartphone incluso. Perfetto per video, streaming e foto.',
        rating: 4.6,
        reviews: 445,
        badge: 'Bestseller',
        stock: 120,
        sku: 'CJ-GA-005'
    },
    {
        id: 'ga-006',
        name: 'Cavo USB-C Ricarica Rapida 100W 2m',
        category: 'gadget',
        supplierPrice: 2.50,
        price: 8.99,
        originalPrice: 12.99,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        images: [],
        description: 'Cavo USB-C a USB-C 100W per ricarica rapida e trasferimento dati 480Mbps. Nylon intrecciato ultra-resistente, compatibile con MacBook, iPad, Android. Lunghezza 2 metri.',
        rating: 4.7,
        reviews: 678,
        badge: '',
        stock: 500,
        sku: 'CJ-GA-006'
    },
    {
        id: 'ga-007',
        name: 'Chiavetta USB 3.0 128GB',
        category: 'gadget',
        supplierPrice: 6.00,
        price: 15.99,
        originalPrice: 22.99,
        image: 'https://images.unsplash.com/photo-1618410320928-25228d811631?w=400&h=400&fit=crop',
        images: [],
        description: 'Pendrive USB 3.0 da 128GB, velocità lettura 120MB/s, scrittura 30MB/s. Design compatto in metallo, cappuccio protettivo. Compatibile Windows, Mac, Linux e TV.',
        rating: 4.5,
        reviews: 289,
        badge: '-30%',
        stock: 200,
        sku: 'CJ-GA-007'
    },
    {
        id: 'ga-009',
        name: 'Mouse Wireless Silenzioso Ricaricabile',
        category: 'gadget',
        supplierPrice: 5.50,
        price: 16.99,
        originalPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        images: [],
        description: 'Mouse wireless 2.4GHz silenzioso, DPI regolabile 800-1600, batteria ricaricabile USB-C fino a 60 giorni. Design ergonomico per destri e mancini.',
        rating: 4.5,
        reviews: 334,
        badge: '',
        stock: 150,
        sku: 'CJ-GA-009'
    },
    // === FERRAMENTA ===
    {
        id: 'fe-001',
        name: 'Trapano Avvitatore Senza Fili 18V',
        category: 'ferramenta',
        supplierPrice: 22.00,
        price: 49.99,
        originalPrice: 69.99,
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
        images: [],
        description: 'Trapano avvitatore a batteria 18V, 2 velocità, coppia 35 Nm, mandrina 10mm. Include 2 batterie Li-Ion, caricabatterie e valigetta. Ideale per forare legno, metallo e muratura.',
        rating: 4.4,
        reviews: 178,
        badge: '-28%',
        stock: 60,
        sku: 'CJ-FE-001'
    },
    {
        id: 'fe-002',
        name: 'Set Chiavi a Brugola 9 Pezzi',
        category: 'ferramenta',
        supplierPrice: 3.50,
        price: 9.99,
        originalPrice: 14.99,
        image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop',
        images: [],
        description: 'Set 9 chiavi esagonali a brugola in acciaio S2, misure 1.5-10mm. Finitura cromata antiruggine, custodia pratica inclusa. Indispensabili per bici, mobili e macchinari.',
        rating: 4.6,
        reviews: 412,
        badge: 'Bestseller',
        stock: 300,
        sku: 'CJ-FE-002'
    },
    {
        id: 'fe-003',
        name: 'Livella Laser Autolivellante 3 Linee',
        category: 'ferramenta',
        supplierPrice: 18.00,
        price: 39.99,
        originalPrice: 55.99,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop',
        images: [],
        description: 'Livella laser 3D con 3 linee (orizzontale, verticale, trasversale), autolivellante ±4°, portata 15m. Staffa magnetica inclusa. Perfetta per posa piastrelle, quadri e scaffali.',
        rating: 4.3,
        reviews: 95,
        badge: 'Novità',
        stock: 45,
        sku: 'CJ-FE-003'
    },
    {
        id: 'fe-006',
        name: 'Cutter Professionale 18mm con 10 Lame',
        category: 'ferramenta',
        supplierPrice: 2.50,
        price: 7.99,
        originalPrice: 11.99,
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop',
        images: [],
        description: 'Cutter con lama 18mm in acciaio SK5, impugnatura antiscivolo in gomma, blocco lama sicuro. Include 10 lame di ricambio. Per cartone, moquette, carta e plastica.',
        rating: 4.4,
        reviews: 198,
        badge: '',
        stock: 250,
        sku: 'CJ-FE-006'
    },
    // === DONNA ===
    {
        id: 'do-001',
        name: 'Vestito Floreale Donna Estivo',
        category: 'donna',
        supplierPrice: 9.00,
        price: 24.99,
        originalPrice: 39.99,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        images: [],
        description: 'Vestito estivo con stampa floreale, scollo a V, vita elasticizzata. Tessuto leggero e traspirante, ideale per estate e serate. Disponibile taglie S-XL.',
        rating: 4.6,
        reviews: 312,
        badge: '-37%',
        stock: 80,
        sku: 'CJ-DO-001'
    },
    {
        id: 'do-002',
        name: 'Borsa Donna in Pelle PU Grande',
        category: 'donna',
        supplierPrice: 11.00,
        price: 29.99,
        originalPrice: 44.99,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        images: [],
        description: 'Borsa a spalla capiente in ecopelle morbida, doppio scomparto con zip, tasca interna porta cellulare. Tracolla regolabile removibile. Colori: nero, marrone, beige.',
        rating: 4.5,
        reviews: 278,
        badge: 'Bestseller',
        stock: 120,
        sku: 'CJ-DO-002'
    },
    {
        id: 'do-003',
        name: 'Scarpe col Tacco Donna 7cm',
        category: 'donna',
        supplierPrice: 13.00,
        price: 34.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        images: [],
        description: 'Décolleté con tacco a stiletto 7cm, punta arrotondata, tomaia in vernice. Eleganti e comode per ufficio e serate. Numerazioni 35-41.',
        rating: 4.3,
        reviews: 189,
        badge: '',
        stock: 60,
        sku: 'CJ-DO-003'
    },
    {
        id: 'do-004',
        name: 'Maglione Donna Oversize Morbido',
        category: 'donna',
        supplierPrice: 10.00,
        price: 27.99,
        originalPrice: 39.99,
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
        images: [],
        description: 'Maglione oversize in misto lana, colletto a coste, maniche lunghe. Morbidissimo e caldo, perfetto per autunno-inverno. Colori: crema, grigio, rosa, nero.',
        rating: 4.7,
        reviews: 445,
        badge: 'Novità',
        stock: 100,
        sku: 'CJ-DO-004'
    },
    {
        id: 'do-005',
        name: 'Leggings Push-Up Donna Sportivi',
        category: 'donna',
        supplierPrice: 7.00,
        price: 19.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop',
        images: [],
        description: 'Leggings sportivi ad alta compressione con effetto push-up, tessuto tecnico traspirante e anti-cellulite. Ideali per yoga, palestra e running. Taglie XS-XL.',
        rating: 4.5,
        reviews: 534,
        badge: '-33%',
        stock: 200,
        sku: 'CJ-DO-005'
    },
    {
        id: 'do-006',
        name: 'Giacca Donna Invernale Slim Fit',
        category: 'donna',
        supplierPrice: 18.00,
        price: 49.99,
        originalPrice: 74.99,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        images: [],
        description: 'Cappotto invernale slim fit con collo alto, imbottitura in piumino sintetico, chiusura doppio petto. Caldo e alla moda per la stagione fredda. Taglie S-XXL.',
        rating: 4.4,
        reviews: 223,
        badge: '-33%',
        stock: 70,
        sku: 'CJ-DO-006'
    },
    {
        id: 'do-007',
        name: 'Set Bigiotteria Donna 5 Pezzi',
        category: 'donna',
        supplierPrice: 5.00,
        price: 14.99,
        originalPrice: 22.99,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        images: [],
        description: 'Set 5 pezzi: collana, 2 orecchini, bracciale e anello in acciaio inossidabile dorato. Stile minimalista elegante, ipoallergenico. In confezione regalo.',
        rating: 4.6,
        reviews: 389,
        badge: 'Bestseller',
        stock: 150,
        sku: 'CJ-DO-007'
    },
    {
        id: 'do-008',
        name: 'Gonna Midi Donna a Pieghe',
        category: 'donna',
        supplierPrice: 8.00,
        price: 22.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=400&h=400&fit=crop',
        images: [],
        description: 'Gonna midi plissettata a vita alta, lunghezza sotto al ginocchio. Tessuto satinato fluido, elastico in vita. Perfetta per ufficio e uscite. Colori: nero, cipria, verde.',
        rating: 4.5,
        reviews: 267,
        badge: '',
        stock: 90,
        sku: 'CJ-DO-008'
    },
    {
        id: 'do-010',
        name: 'Jeans Donna Skinny Push-Up',
        category: 'donna',
        supplierPrice: 12.00,
        price: 32.99,
        originalPrice: 49.99,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
        images: [],
        description: 'Jeans skinny a vita alta con effetto push-up, denim elasticizzato comfort. Modellano la silhouette e restano comodi tutto il giorno. Taglie 36-46.',
        rating: 4.6,
        reviews: 538,
        badge: 'Bestseller',
        stock: 120,
        sku: 'CJ-DO-010'
    },
    {
        id: 'do-011',
        name: 'Sneakers Donna Bianche Platform',
        category: 'donna',
        supplierPrice: 14.00,
        price: 38.99,
        originalPrice: 54.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        images: [],
        description: 'Sneakers con suola platform rialzata 4cm, tomaia in ecopelle bianca, soletta memory foam. Comode e alla moda, perfette per uso quotidiano. Numeri 36-41.',
        rating: 4.7,
        reviews: 612,
        badge: '-29%',
        stock: 90,
        sku: 'CJ-DO-011'
    },
    {
        id: 'do-012',
        name: 'Vestito da Sera Donna Elegante',
        category: 'donna',
        supplierPrice: 16.00,
        price: 44.99,
        originalPrice: 64.99,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop',
        images: [],
        description: 'Abito da sera lungo con spacco laterale, scollo drappeggiato, tessuto satinato lucido. Ideale per cerimonie, cene eleganti e feste. Taglie S-XL.',
        rating: 4.5,
        reviews: 287,
        badge: 'Novità',
        stock: 50,
        sku: 'CJ-DO-012'
    },
    {
        id: 'do-014',
        name: 'Cappotto Donna Lungo Classico',
        category: 'donna',
        supplierPrice: 22.00,
        price: 59.99,
        originalPrice: 89.99,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop',
        images: [],
        description: 'Cappotto lungo al ginocchio, taglio sartoriale classico, tessuto misto lana caldo. Chiusura doppio petto con bottoni dorati. Colori: cammello, nero, grigio. Taglie S-XL.',
        rating: 4.6,
        reviews: 198,
        badge: '-33%',
        stock: 40,
        sku: 'CJ-DO-014'
    },
    {
        id: 'do-015',
        name: 'Sciarpa Donna Cashmere Morbida',
        category: 'donna',
        supplierPrice: 6.00,
        price: 17.99,
        originalPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop',
        images: [],
        description: 'Sciarpa in misto cashmere ultra-morbida, 180x70cm, bordi sfrangiati. Calda e leggera, si abbina a qualsiasi outfit invernale. Disponibile in 8 colori.',
        rating: 4.7,
        reviews: 445,
        badge: '',
        stock: 200,
        sku: 'CJ-DO-015'
    }
];

const PRODUCTS_VERSION = '12'; // incrementare per forzare reset localStorage

/**
 * Gestione prodotti
 * Legge da localStorage (gestiti dall'admin) o fallback su PRODUCTS_DB
 */
const ProductManager = {
    products: [],

    init() {
        const savedVersion = localStorage.getItem('dropshop_products_version');
        if (savedVersion !== PRODUCTS_VERSION) {
            // Nuova versione: reset con prodotti aggiornati
            this.products = PRODUCTS_DB;
            localStorage.setItem('dropshop_products', JSON.stringify(PRODUCTS_DB));
            localStorage.setItem('dropshop_products_version', PRODUCTS_VERSION);
        } else {
            const saved = localStorage.getItem('dropshop_products');
            if (saved) {
                try { this.products = JSON.parse(saved); } catch { this.products = PRODUCTS_DB; }
            } else {
                this.products = PRODUCTS_DB;
                localStorage.setItem('dropshop_products', JSON.stringify(PRODUCTS_DB));
            }
        }
        return this.products;
    },

    getAll() {
        return this.products;
    },

    getById(id) {
        return this.products.find(p => p.id === id);
    },

    getByCategory(category) {
        if (!category || category === 'tutti') return this.products;
        return this.products.filter(p => p.category === category);
    },

    search(query) {
        const q = query.toLowerCase().trim();
        if (!q) return this.products;
        return this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    },

    sort(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return sorted.reverse();
            default:
                return sorted;
        }
    },

    getDiscount(product) {
        if (!product.originalPrice || product.originalPrice <= product.price) return 0;
        return Math.round((1 - product.price / product.originalPrice) * 100);
    },

    getProfit(product) {
        return product.price - product.supplierPrice;
    },

    getProfitMargin(product) {
        return ((product.price - product.supplierPrice) / product.price * 100).toFixed(1);
    },

    mergeAutoProducts(autoProducts) {
        const existingIds = new Set(this.products.map(p => p.id));
        const newOnes = autoProducts.filter(p => !existingIds.has(p.id));
        this.products = [...this.products, ...newOnes];
    }
};
