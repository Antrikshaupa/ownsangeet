import { useState, useEffect } from 'react';

export const usePageContent = (slug: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/pages/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch page');
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [slug]);

    return { data, loading, error };
};

export const useMusicTracks = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/music')
            .then(res => res.json())
            .then(data => {
                setTracks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return { tracks, loading };
};
