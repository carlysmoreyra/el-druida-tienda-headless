// Mock Tienda Nube API Service
// Esto simula la estructura de datos que nos devolvería la verdadera API de Tienda Nube.

export const mockProducts = [
  // Categoria: Mangas/Libros
  { id: 1, name: 'El Druida Vol. 1 - Edición Especial', price: 8500, category: 'mangas', image: 'manga1.webp', isNew: true },
  { id: 2, name: 'Grimorio de Hechizos Modernos', price: 12000, category: 'mangas', image: 'manga2.webp', isNew: false },
  { id: 3, name: 'Códice del Bosque de Cristal', price: 9500, category: 'mangas', image: 'manga3.webp', isNew: false },
  
  // Categoria: Merch/POD
  { id: 4, name: 'Buzo "Runas Cibernéticas" (Full Print)', price: 45000, category: 'merch', image: 'apparel1.webp', isNew: true },
  { id: 5, name: 'Remera "Druida Hacker" (Algodón 100%)', price: 18000, category: 'merch', image: 'apparel2.webp', isNew: false },
  { id: 6, name: 'Taza Mágica Reactiva "El Bosque Digital"', price: 6200, category: 'merch', image: 'mug1.webp', isNew: false },
];

export const fetchProductsByCategory = async (category) => {
  try {
    const isLocal = window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'http://localhost:3001' : '';
    const response = await fetch(`${baseUrl}/api/products`);
    const data = await response.json();

    if (data.mockRequired) {
      console.warn('⚠️ Usando Mock temporal hasta que configures el archivo .env');
      return new Promise(resolve => {
        setTimeout(() => resolve(mockProducts.filter(p => p.category === category)), 600);
      });
    }

    // Función de extracción robusta para soportar productos de MercadoLibre u otros idiomas
    const extractText = (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field.es || field.pt || field.en || Object.values(field)[0] || '';
    };

    const normalizedData = (data || []).map(p => {
      let productPrice = 0;
      if (p.variants && p.variants[0] && p.variants[0].price) {
        productPrice = parseFloat(p.variants[0].price);
      } else if (p.price) {
        productPrice = parseFloat(p.price);
      }
      
      return {
        id: p.id,
        name: extractText(p.name) || 'Objeto Magico',
        price: productPrice,
        image: p.images && p.images.length > 0 ? p.images[0].src : p.image,
        isNew: true,
        description: extractText(p.description) || 'Sin descripción detallada.',
        variantId: p.variants && p.variants[0] ? p.variants[0].id : null,
        url: p.canonical_url
      };
    });

    // Dividir los productos según el nombre (podemos ajustarlo luego a tags de Tienda Nube)
    return normalizedData.filter(p => {
       const isMerch = p.name.toLowerCase().match(/hoodie|buzo|taza|remera|polera/);
       if (category === 'merch') return isMerch;
       return !isMerch;
    });
  } catch (err) {
    console.error('API local no responde. Usando Mock de respaldo.');
    return mockProducts.filter(p => p.category === category);
  }
};
