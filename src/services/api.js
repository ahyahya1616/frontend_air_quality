const BASE_URL = 'http://localhost:5000/api/air-quality';

export const fetchAllData = async () => {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
};

export const fetchReport = async () => {
    const response = await fetch(`${BASE_URL}/report`);
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
};

export const fetchRange = async (start, end) => {
    const response = await fetch(`${BASE_URL}/range?start=${start}&end=${end}`);
    if (!response.ok) throw new Error('Failed to filter by range');
    return response.json();
};
