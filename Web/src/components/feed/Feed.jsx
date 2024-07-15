import './feed.css';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import Blogpost from './components/Blogpost';

export default function Feed() {
  const feedRef = useRef(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simuler le chargement initial de données (première publication de blog)
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Simuler le chargement initial de données (première publication de blog)
    const initialPosts = [
      {
        id: 1,
        imgSrc: 'https://picsum.photos/200/300',
        blogTitle: 'Titre 1',
        blogDescription: 'Description du blog 1',
      },
      {
        id: 2,
        imgSrc: 'https://picsum.photos/200/300',
        blogTitle: 'Titre 2',
        blogDescription: 'Description du blog 2',
      },
      {
        id: 3,
        imgSrc: 'https://picsum.photos/200/300',
        blogTitle: 'Titre 3',
        blogDescription: 'Description du blog 3',
      },
      {
        id: 4,
        imgSrc: 'https://picsum.photos/200/300',
        blogTitle: 'Titre 4',
        blogDescription: 'Description du blog 4',
      }
    ];

    setBlogPosts(initialPosts);
  };

  const loadMorePosts = () => {
    setLoading(true);

    setTimeout(() => {
      const newPosts = Array.from({ length: 4 }, (_, index) => ({
        id: blogPosts.length + index + 1,
        imgSrc: 'https://picsum.photos/200/300',
        blogTitle: `Nouveau Titre ${blogPosts.length + index + 1}`,
        blogDescription: `Nouvelle Description du blog ${blogPosts.length + index + 1}`,
      }));

      setBlogPosts(prevPosts => [...prevPosts, ...newPosts]);
      setLoading(false); // Désactiver le chargement
    }, 1000); // Simulation d'un chargement asynchrone (1 seconde ici, remplacez par votre logique réelle)
  };

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = feedRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (!loading) {
        loadMorePosts();
      }
    }
  }, [loading, loadMorePosts]);

  useEffect(() => {
    const currentFeedRef = feedRef.current;
    currentFeedRef.addEventListener('scroll', handleScroll);

    // Nettoyage de l'écouteur d'événement lorsque le composant est démonté
    return () => {
      currentFeedRef.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className='feed' ref={feedRef}>
      <div className="space1em"></div>
      {blogPosts.map(post => (
        <Blogpost
          key={post.id}
          imgSrc={post.imgSrc}
          blogTitle={post.blogTitle}
          blogDescription={post.blogDescription}
        />
      ))}
      {loading && <p>Chargement...</p>}
    </div>
  );
}
