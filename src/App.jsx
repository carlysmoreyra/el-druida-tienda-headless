import React, { useState, useEffect } from 'react';
import './index.css';
import { fetchProductsByCategory } from './services/api';

function ProductCard({ product }) {
  return (
    <div className="glass-panel product-card" style={{ padding: '2rem', position: 'relative' }}>
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
        ${product.price.toLocaleString('es-AR')} ARS
      </p>
      <button className="btn-primary" style={{ width: '100%' }}>Agregar al Carrito</button>
    </div>
  );
}

function ProductSection({ title, subtitle, id, category }) {
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
        <a href={`#${category}-all`} className="tech-text" style={{ opacity: 0.8 }}>VER TODO &rarr;</a>
      </div>
      
      {loading ? (
        <div className="flex-center tech-text" style={{ height: '300px', color: 'var(--accent-emerald)', animation: 'pulse 1.5s infinite' }}>
          Conectando con Nucleo de Tienda Nube...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function App() {
  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <nav className="glass-panel flex-center" style={{ padding: '1rem 2rem', marginTop: '2rem', justifyContent: 'space-between', position: 'sticky', top: '1rem', zIndex: 100 }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', textShadow: 'var(--neon-glow)' }}>
          El Druida <span style={{ color: 'var(--text-main)' }}>de Papel</span>
        </div>
        <div className="links tech-text" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#mangas">Mangas & Libros</a>
          <a href="#merch">Runas & Merch</a>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Carrito (0)</button>
        </div>
      </nav>

      <header className="hero space-y-8" style={{ marginTop: '6rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Donde la Magia <br/>
          <span style={{ color: 'var(--accent-emerald)', textShadow: 'var(--neon-glow)' }}>Se Hace Digital</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
          Explora nuestra colección de mangas, libros y artefactos de Print On Demand. 
          El ecosistema perfecto donde la naturaleza se fusiona con la tecnología.
        </p>
        <div className="flex-center" style={{ marginTop: '3rem', gap: '1.5rem' }}>
          <a href="#mangas" className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Explorar Catálogo
          </a>
        </div>
      </header>
      
      {/* Dynamic Sections driven by Mock API */}
      <ProductSection id="mangas" title="Mangas y Conocimiento" subtitle="BIBLIOTECA DEL DRUIDA" category="mangas" />
      <ProductSection id="merch" title="Colección Print On Demand" subtitle="ARTEFACTOS Y RUNAS" category="merch" />
      
      <footer style={{ marginTop: '8rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-glass)' }}>
        <p className="tech-text" style={{ color: 'var(--text-muted)' }}>&copy; 2026 El Druida de Papel. Ecosistema Digital Tienda Nube.</p>
      </footer>
    </div>
  );
}

export default App;
