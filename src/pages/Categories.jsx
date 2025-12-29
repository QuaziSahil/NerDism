import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

const Categories = () => {
    const categories = [...new Set(postsData.map(post => post.category))];

    return (
        <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
            <div className="container">
                <h1>Categories</h1>
                <div style={{ display: 'flex', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                        <Link
                            key={cat}
                            to={`/blog?category=${cat}`}
                            style={{
                                padding: '20px 40px',
                                background: 'var(--card-bg)',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                border: '1px solid var(--border-color)'
                            }}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Categories;
