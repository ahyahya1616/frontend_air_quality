const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const fetchAllData = async () => {
    const response = await fetch(`${API_BASE_URL}/air-quality`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data;
};

export const fetchReport = async () => {
    const response = await fetch(`${API_BASE_URL}/air-quality/report`);
    if (!response.ok) throw new Error('Failed to fetch report');
    return response.json();
};

export const fetchRange = async (start, end) => {
    const response = await fetch(`${API_BASE_URL}/air-quality/range?start=${start}&end=${end}`);
    if (!response.ok) throw new Error('Failed to filter by range');
    return response.json();
};

export const fetchSensors = async () => {
    const response = await fetch(`${API_BASE_URL}/sensors`);
    if (!response.ok) throw new Error('Failed to fetch sensors');
    return response.json();
};

export const fetchActuators = async () => {
    const response = await fetch(`${API_BASE_URL}/actuators`);
    if (!response.ok) throw new Error('Failed to fetch actuators');
    return response.json();
};
