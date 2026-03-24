import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchProductsByCategory } from './services/api';

function ProductCard({ product, onClick }) {
  return (
    <div className="glass-panel product-card" style={{ padding: '2rem', position: 'relative', cursor: 'pointer' }} onClick={onClick}>
      {product.isNew && (
        <div className="tech-text" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent-emerald)', color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', zIndex: 10 }}>
          NUEVO
        </div>
      )}
      <div className="flex-center" style={{ width: '100%', height: '300px', background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--text-muted)', overflow: 'hidden' }}>
        {product.image && product.image.includes('http') ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>[ Imágen {product.name} ]</span>
        )}
      </div>
      <h3 style={{ fontSize: '1.2rem', minHeight: '3em' }}>{product.name}</h3>
      <p className="tech-text" style={{ margin: '1.5rem 0', color: 'var(--accent-gold)', fontSize: '1.3rem' }}>
        ${product.price ? product.price.toLocaleString('es-AR') : '0'} ARS
      </p>
      <button className="btn-primary" style={{ width: '100%' }}>Ver Detalles</button>
    </div>
  );
}

function ProductSection({ title, subtitle, id, category, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsByCategory(category).then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, [category]);

  return (
    <section id={id} className="featured" style={{ marginTop: '8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '2.5rem' }}>
          <span className="tech-text" style={{ fontSize: '1rem', display: 'block', color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>// {subtitle}</span>
          {title}
        </h2>
      </div>
      
      {loading ? (
        <div className="flex-center tech-text" style={{ height: '300px', color: 'var(--accent-emerald)', animation: 'pulse 1.5s infinite' }}>
          Conectando con Nucleo de Tienda Nube...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => onSelectProduct(product)} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductDetail({ product, onBack }) {
  // Cuando usamos Vercel como dominio principal, no podemos usar la canonical URL.
  // Pero podemos enviar al usuario directo al carrito usando el subdominio checkout configurado.
  const handleBuy = () => {
    // Si tienes el subdominio configurado como checkout.eldruidadepapel.com.ar:
    // window.location.href = `https://checkout.eldruidadepapel.com.ar/checkout/v3/start/${product.variantId}`;
    
    // Por ahora, para asegurarnos de que no falle, lo mandamos al dominio original de Tienda Nube temporal
    // Extraemos el subdominio original de la canonical_url de Tienda Nube
    let checkoutDomain = 'eldruidadepapel.mitiendanube.com';
    if (product.url) {
        try {
            const urlObj = new URL(product.url);
            checkoutDomain = urlObj.hostname;
        } catch(e) {}
    }
    
    if (product.variantId) {
      window.open(`https://${checkoutDomain}/cart/add/${product.variantId}`, '_blank');
    } else {
      window.open(product.url || `https://${checkoutDomain}`, '_blank');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <button onClick={onBack} className="tech-text" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        &larr; VOLVER AL ECOSISTEMA
      </button>

      <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', padding: '2rem', gap: '3rem' }}>
        <div style={{ flex: '1 1 400px', height: '500px', background: 'rgba(0,0,0,0.5)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {product.image && product.image.includes('http') ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>[ Sin Imagen ]</div>
          )}
        </div>

        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '1rem' }}>{product.name}</h1>
          <div className="tech-text" style={{ color: 'var(--accent-gold)', fontSize: '2rem', marginBottom: '2rem' }}>
            ${product.price ? product.price.toLocaleString('es-AR') : '0'} ARS
          </div>
          
          <div style={{ color: 'var(--text-main)', opacity: 0.9, marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.8' }} 
               dangerouslySetInnerHTML={{ __html: product.description }} />

          <button onClick={handleBuy} className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.2rem', boxShadow: 'var(--neon-glow)' }}>
            Agregar al Carrito en Tienda Nube
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <nav className="glass-panel flex-center" style={{ padding: '1rem 2rem', marginTop: '2rem', justifyContent: 'space-between', position: 'sticky', top: '1rem', zIndex: 100 }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', textShadow: 'var(--neon-glow)' }}>
          El Druida <span style={{ color: 'var(--text-main)' }}>de Papel</span>
        </div>
        <div className="links tech-text" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#mangas">Mangas & Libros</a>
          <a href="#merch">Runas & Merch</a>
        </div>
      </nav>

      <header className="hero space-y-8" style={{ marginTop: '6rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Donde la Magia <br/>
          <span style={{ color: 'var(--accent-emerald)', textShadow: 'var(--neon-glow)' }}>Se Hace Digital</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Explora nuestra colección de mangas, libros y artefactos. 
          El ecosistema perfecto donde la naturaleza se fusiona con la tecnología.
        </p>
      </header>
      
      <ProductSection id="mangas" title="Mangas y Conocimiento" subtitle="BIBLIOTECA DEL DRUIDA" category="mangas" onSelectProduct={setSelectedProduct} />
      <ProductSection id="merch" title="Colección Print On Demand" subtitle="ARTEFACTOS Y RUNAS" category="merch" onSelectProduct={setSelectedProduct} />
      
      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-glass)' }}>
        <p className="tech-text" style={{ color: 'var(--text-muted)' }}>&copy; 2026 El Druida de Papel. Ecosistema Digital Tienda Nube.</p>
      </footer>
    </div>
  );
}

export default App;
