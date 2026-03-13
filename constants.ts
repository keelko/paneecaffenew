import type { Product, Extra } from './types';

export const RESTAURANT_ADDRESS = "Via Pasquale Stanislao Mancini 13, 83031 Ariano Irpino (AV)";

export const DELIVERY_FEE = 3;

export const REMOVABLE_INGREDIENTS = ['formaggio', 'bacon', 'insalata', 'pomodoro', 'cipolla', 'cetrioli', 'maionese', 'bbq'];

export const EXTRAS_BURGER: Extra[] = [
    { name: 'Bacon', price: 1 },
    { name: 'Cetriolini', price: 1 },
    { name: 'Doppio Cheddar', price: 1 },
    { name: 'Cipolla Caramellata', price: 1 },
    { name: 'Doppio Hamburger', price: 4 },
];

export const EXTRAS_SAUCES: Extra[] = [
    { name: 'Ketchup', price: 0 },
    { name: 'Maionese', price: 0 },
    { name: 'Barbecue', price: 0 },
];

export const FRY_SAUCES: Extra[] = [
    { name: 'Ketchup', price: 0 },
    { name: 'Maionese', price: 0 },
    { name: 'Barbecue', price: 0 },
];

// These are drinks for the menu option, price is 0 as it's included.
export const DRINKS: Product[] = [
  { id: 101, name: "Coca Cola", price: 0, description: "33cl", image: "https://i.imgur.com/I39zBFO.png", category: 'drink', isDrink: true },
  { id: 109, name: "Coca Cola Zero", price: 0, description: "33cl", image: "https://www.acqua.store/wp-content/uploads/2024/09/coca-cola-zero-lat-33cl.webp", category: 'drink', isDrink: true },
  { id: 102, name: "Fanta", price: 0, description: "33cl", image: "https://i.imgur.com/kgcxxR1.png", category: 'drink', isDrink: true },
  { id: 103, name: "Sprite", price: 0, description: "33cl", image: "https://i.imgur.com/SBHwZQ7.png", category: 'drink', isDrink: true },
  { id: 104, name: "Estathé Limone", price: 0, description: "33cl", image: "https://i.imgur.com/mAxJlOq.png", category: 'drink', isDrink: true },
  { id: 108, name: "Estathé Pesca", price: 0, description: "33cl", image: "https://i.imgur.com/evKbSj3.png", category: 'drink', isDrink: true },
  { id: 105, name: "Birra Castello", price: 0, description: "33cl", image: "https://cdn.tescoma.com/content/images/product/boccale-birra-piccolo-mybeer-salute_144119.jpg?width=2048", category: 'drink', isDrink: true },
  { id: 106, name: "Acqua Naturale", price: 0, description: "33cl", image: "https://i.imgur.com/w8aQbQc.png", category: 'drink', isDrink: true },
  { id: 107, name: "Acqua Frizzante", price: 0, description: "33cl", image: "https://i.imgur.com/cPU8HfW.png", category: 'drink', isDrink: true },
];

export const KIDS_DRINKS: Product[] = DRINKS.filter(drink => 
    !drink.name.toLowerCase().includes('birra') &&
    !drink.name.toLowerCase().includes('nastro azzurro') &&
    !drink.name.toLowerCase().includes('becks') &&
    !drink.name.toLowerCase().includes('heineken') &&
    !drink.name.toLowerCase().includes('weisse') &&
    !drink.name.toLowerCase().includes('ipa')
);


export const PRODUCTS: Product[] = [
  // Panini del Mese
  {
    id: 103, name: "Hard Pork", price: 12, menuPrice: 17, category: 'panini-del-mese',
    description: "Bun artigianale, hamburger di maiale, patata smashata, provola, funghi cardoncelli alla piastra, crema di funghi, maionese.",
    image: "https://i.imgur.com/fHyZ3eo.png",
    ingredients: ["Hamburger di maiale", "Patata smashata", "Provola", "Funghi cardoncelli", "Crema di funghi", "Maionese"],
  },
  {
    id: 104, name: "MLS", price: 15, menuPrice: 20, category: 'panini-del-mese',
    description: "Bun artigianale, ragù napoletano, provola, cannellone ripieno alla bolognese e fritto. (Solo sabato e domenica)",
    image: "https://i.imgur.com/synmOB8.png",
    ingredients: ["Ragù napoletano", "Provola", "Cannellone fritto"],
  },

  // Burgers & Smash
  {
    id: 1, name: "Classico", price: 8, menuPrice: 13, category: 'hamburger',
    description: "Bun artigianale, hamburger di manzo, provola, bacon, insalata, pomodoro.",
    image: "https://i.imgur.com/NTNB4nA.png",
    ingredients: ["Hamburger di Manzo", "Provola", "Bacon", "Insalata", "Pomodoro"],
    galleryImages: ["https://i.imgur.com/EiYXakH.png", "https://i.imgur.com/E9KWa9F.png"],
  },
  {
    id: 2, name: "Cheeseburger", price: 8, menuPrice: 13, category: 'hamburger',
    description: "Bun artigianale, hamburger di manzo, cheddar, bacon, cipolla caramellata, insalata, pomodoro.",
    image: "https://i.imgur.com/dBxcKRn.png",
    ingredients: ["Hamburger di Manzo", "Cheddar", "Bacon", "Cipolla caramellata", "Insalata", "Pomodoro"],
  },
  {
    id: 15, name: "Junior", price: 8, menuPrice: 13, category: 'hamburger',
    description: "Bun artigianale, hamburger di manzo, cheddar, bacon, patatine fritte, ketchup o maionese.",
    image: "https://i.imgur.com/ZFJvFgl.png",
    ingredients: ["Hamburger di manzo", "Cheddar", "Bacon", "Patatine fritte", "Ketchup o maionese"],
  },
  {
    id: 3, name: "Signore degli Anelli", price: 8, menuPrice: 13, category: 'hamburger',
    description: "Bun artigianale, hamburger di manzo, provola, bacon, anelli di cipolla, maionese, salsa BBQ.",
    image: "https://i.imgur.com/9JNdtMs.png",
    ingredients: ["Hamburger di Manzo", "Provola", "Bacon", "Anelli di Cipolla", "Maionese", "Salsa BBQ"],
    galleryImages: ["https://i.imgur.com/aAFQ3CQ.png", "https://i.imgur.com/zzNIT3K.png"],
  },
  {
    id: 5, name: "Smash American", price: 10, menuPrice: 15, category: 'hamburger',
    description: "Potato bun, doppio smashburger da 90g, cheddar, bacon, salsa Cane’s, cetriolini.",
    image: "https://i.imgur.com/XSdus29.png",
    ingredients: ["Doppio Smashburger 90g", "Cheddar", "Bacon", "Salsa Cane's", "Cetriolini"],
    galleryImages: ["https://i.imgur.com/Jo2wUZC.png", "https://i.imgur.com/WffE6mZ.png"],
  },
  {
    id: 100, name: "St. Jhon", price: 13, menuPrice: 18, category: 'hamburger',
    description: "Potato bun, doppio smashburger da 90g, pulled pork, cheddar, bacon jam, salsa BBQ, cipolla crispy.",
    image: "https://i.imgur.com/7LEZf88.png",
    ingredients: ["Doppio smashburger 90g", "Pulled pork", "Cheddar", "Bacon jam", "Salsa BBQ", "Cipolla crispy"],
  },
  {
    id: 101, name: "Jam", price: 13, menuPrice: 18, category: 'hamburger',
    description: "Potato bun, triplo smashburger da 90g, cheddar, bacon jam, bacon, salsa crispy.",
    image: "https://i.imgur.com/oPflcjL.png",
    ingredients: ["Triplo smashburger 90g", "Cheddar", "Bacon jam", "Bacon", "Salsa crispy"],
  },
  {
    id: 8, name: "Big Pork", price: 10, menuPrice: 15, category: 'hamburger',
    description: "Bun artigianale, pulled pork, cheddar, bacon, salsa BBQ.",
    image: "https://i.imgur.com/TDaq7KQ.png",
    ingredients: ["Pulled pork", "Cheddar", "Bacon", "Salsa BBQ"],
  },

  // Sandwiches di Pollo
  {
    id: 10, name: "Pec Chicken", price: 8, menuPrice: 13, category: 'sandwich-pollo',
    description: "Bun artigianale, petto di pollo panato e fritto, provola, bacon, insalata.",
    image: "https://i.imgur.com/qeA4Ysk.png",
    ingredients: ["Petto di pollo panato", "Provola", "Bacon", "Insalata"],
  },
  {
    id: 11, name: "Chicken Crunch", price: 10, menuPrice: 15, category: 'sandwich-pollo',
    description: "Bun artigianale, pollo alla paprika pastellato e fritto, insalata, stealth fries, salsa allo yogurt.",
    image: "https://i.imgur.com/2g1VfUs.png",
    ingredients: ["Pollo alla paprika", "Insalata", "Stealth fries", "Salsa allo yogurt"],
  },
  {
    id: 12, name: "Pol - Corn", price: 10, menuPrice: 15, category: 'sandwich-pollo',
    description: "Bun artigianale, pollo impanato nei corn flakes, salsa yogurt, pomodoro, insalata, salsa sweet chili.",
    image: "https://i.imgur.com/f9xIWeo.png",
    ingredients: ["Pollo impanato nei corn flakes", "Salsa yogurt", "Pomodoro", "Insalata", "Salsa sweet chili"],
  },

  // Vegetariano
  {
    id: 102, name: "Truffle Patty", price: 10, menuPrice: 15, category: 'veggy',
    description: "Bun artigianale, funghi cardoncelli alla piastra, provola panata e fritta, patata smashata, crema di funghi, maionese.",
    image: "https://i.imgur.com/7bt9j84.png",
    ingredients: ["Funghi cardoncelli", "Provola panata e fritta", "Patata smashata", "Crema di funghi", "Maionese"],
  },

  // Chips
  {
    id: 16, name: "Patate Classiche", price: 4, category: 'chips',
    description: "Porzione di patatine fritte classiche. Includono salse in bustina (Ketchup, Maionese).",
    image: "https://i.imgur.com/iJFKbSG.png",
  },
  {
    id: 17, name: "Patate Bacon e Cheddar", price: 6, category: 'chips',
    description: "Patatine fritte con bacon croccante e cheddar fuso. Includono salse in bustina (Ketchup, Maionese, BBQ).",
    image: "https://i.imgur.com/yJfSjf8.png",
    galleryImages: ["https://i.imgur.com/2bxm5Ax.png"],
    imagePosition: 'center 85%',
  },
  {
    id: 18, name: "Patate Pulled Pork e Cheddar", price: 8, category: 'chips',
    description: "Patatine fritte con pulled pork, cheddar fuso e salsa bbq. Includono salse in bustina.",
    image: "https://i.imgur.com/e6SUn5a.png",
    galleryImages: ["https://i.imgur.com/5j6sdlV.png", "https://i.imgur.com/OB53IG4.jpeg"],
  },

  // Starter
  {
    id: 19, name: "Alette di Pollo Fritte", price: 5, category: 'starter',
    description: "6 Pezzi di alette di pollo croccanti e saporite.",
    image: "https://i.imgur.com/pHRdByL.png",
    galleryImages: ["https://i.imgur.com/T205g8u.png"],
    imagePosition: 'center 85%',
  },
  {
    id: 20, name: "Nuggets di Pollo", price: 5, category: 'starter',
    description: "6 Pezzi di bocconcini di pollo panati e fritti.",
    image: "https://i.imgur.com/iUulL2J.png",
    galleryImages: ["https://i.imgur.com/ofQ78Us.png"],
    imagePosition: 'center 85%',
  },
  {
    id: 21, name: "Anelli di Cipolla e Salsa Crispy", price: 5, category: 'starter',
    description: "8 Pezzi di anelli di cipolla in pastella con salsa crispy.",
    image: "https://i.imgur.com/WKzMuac.png",
  },
  {
    id: 58, name: "Baby Crunch (6PZ)", price: 6, category: 'starter',
    description: "Stick di pollo panati e fritti, serviti con salsa cane's.",
    image: "https://i.imgur.com/ZdVDvCz.png",
  },

  // Box
  {
    id: 23, name: "Baby Crunch Box", price: 8, category: 'box',
    description: "Stick di pollo panati e fritti, patatine fritte, anelli di cipolla e salsa cane's.",
    image: "https://i.imgur.com/3HUDMJF.png",
  },
  {
    id: 24, name: "Chicken Box", price: 15, category: 'box',
    description: "La tua box comprende: Alette di pollo fritte (5 pz), Nuggets di pollo (5 pz), Baby crunch (5 pz), Stick di pollo ai corn flakes (5 pz). Salse incluse: Cane's, Cheddar, BBQ, Crispy.",
    image: "https://i.imgur.com/Xx1SIfk.png",
  },

  // Dolci
  {
    id: 25, name: "Donuts", price: 2, category: 'dolci',
    description: "Ciambella fritta e glassata, vari gusti disponibili.",
    image: "https://i.imgur.com/NHzDOA5.png",
  },

  // Salse
  { 
    id: 39, 
    name: "Salsa Cane's", 
    price: 1, 
    description: "La nostra salsa speciale.", 
    image: "https://i.imgur.com/DSgrypZ.png", 
    category: 'salse',
    variants: [
      { name: 'Small', price: 1 },
      { name: 'Large', price: 3 },
    ]
  },
  { 
    id: 40, 
    name: "Salsa Crispy", 
    price: 1, 
    description: "Salsa per un tocco croccante.", 
    image: "https://i.imgur.com/ODZXJfw.png", 
    category: 'salse',
    variants: [
      { name: 'Small', price: 1 },
      { name: 'Large', price: 3 },
    ]
  },
  { 
    id: 53, 
    name: "Salsa Cheddar", 
    price: 1.5, 
    description: "Salsa al formaggio cheddar, perfetta per patatine e panini.", 
    image: "https://i.imgur.com/VQiNmK2.png", 
    category: 'salse',
    variants: [
      { name: 'Small', price: 1.5 },
      { name: 'Large', price: 3.5 },
    ]
  },
  
  // Bibite standalone
  { id: 29, name: "Acqua Naturale", price: 1, description: "Naturale 33cl", image: "https://i.imgur.com/w8aQbQc.png", category: 'drink', isDrink: true },
  { id: 35, name: "Acqua Frizzante", price: 1, description: "Frizzante 33cl", image: "https://i.imgur.com/cPU8HfW.png", category: 'drink', isDrink: true },
  { id: 30, name: "Coca Cola", price: 2, description: "33cl", image: "https://i.imgur.com/I39zBFO.png", category: 'drink', isDrink: true },
  { id: 49, name: "Coca Cola Zero", price: 2, description: "33cl", image: "https://www.acqua.store/wp-content/uploads/2024/09/coca-cola-zero-lat-33cl.webp", category: 'drink', isDrink: true },
  { id: 50, name: "Pepsi", price: 2, description: "33cl", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1509px-Pepsi_logo_2014.svg.png", category: 'drink', isDrink: true },
  { id: 31, name: "Fanta", price: 2, description: "33cl", image: "https://i.imgur.com/kgcxxR1.png", category: 'drink', isDrink: true },
  { id: 32, name: "Sprite", price: 2, description: "33cl", image: "https://i.imgur.com/SBHwZQ7.png", category: 'drink', isDrink: true },
  { id: 33, name: "Estathé Limone", price: 2, description: "33cl", image: "https://i.imgur.com/mAxJlOq.png", category: 'drink', isDrink: true },
  { id: 36, name: "Estathé Pesca", price: 2, description: "33cl", image: "https://i.imgur.com/evKbSj3.png", category: 'drink', isDrink: true },
  { id: 45, name: "Redbull", price: 2.5, description: "25cl", image: "https://upload.wikimedia.org/wikipedia/it/9/98/Red_Bull_Logo.png", category: 'drink', isDrink: true },
  { id: 34, name: "Birra Castello", price: 2, description: "33cl", image: "https://cdn.tescoma.com/content/images/product/boccale-birra-piccolo-mybeer-salute_144119.jpg?width=2048", category: 'drink', isDrink: true },
  { id: 43, name: "Birra Castello 0.5L", price: 3.5, description: "50cl", image: "https://cdn.tescoma.com/content/images/product/boccale-birra-piccolo-mybeer-salute_144119.jpg?width=2048", category: 'drink', isDrink: true },
  { id: 46, name: "Nastro Azzurro", price: 2, description: "33cl", image: "https://cdn.winelivery.com/public/products/images/62cfecb258e12b006793fd36.jpeg", category: 'drink', isDrink: true },
  { id: 47, name: "Becks", price: 2, description: "33cl", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqGlW5bafAUHt4IDIzmqN3LoH0Z2IOA813UA&s", category: 'drink', isDrink: true },
  { id: 48, name: "Heineken", price: 2, description: "33cl", image: "https://eu.beerwulf.com/cdn/shop/files/Draught_keg_5L_Heineken_original_2.png?v=1753183787", category: 'drink', isDrink: true },
  { id: 42, name: "Weisse", price: 4, description: "50cl", image: "https://cdn.tescoma.com/content/images/product/boccale-birra-piccolo-mybeer-salute_144119.jpg?width=2048", category: 'drink', isDrink: true },
  { id: 44, name: "IPA", price: 5, description: "33cl", image: "https://www.topbeer.it/image/cache/wp/lj/slideshow/ipa-luppolo-350x525.webp", category: 'drink', isDrink: true },
];