// Initialize the map
let map = L.map('map').setView([0, 0], 13);

// Add the tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a custom marker icon
const customIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 56],
});

// Initialize marker variable
let marker;

// DOM Elements
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const ipElement = document.getElementById('ip');
const locationElement = document.getElementById('location');
const timezoneElement = document.getElementById('timezone');
const ispElement = document.getElementById('isp');

// Variable to store API key
let API_KEY = '';

// Function to update the UI with the data
function updateUI(data) {
    const { ip, location, isp } = data;
    
    ipElement.textContent = ip;
    locationElement.textContent = `${location.city}, ${location.region} ${location.postalCode}`;
    timezoneElement.textContent = `UTC ${location.timezone}`;
    ispElement.textContent = isp;

    // Update map location
    const lat = location.lat;
    const lng = location.lng;
    
    // If marker exists, remove it
    if (marker) {
        map.removeLayer(marker);
    }

    // Add new marker
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // Center map on new location
    map.setView([lat, lng], 13);
}

// Function to fetch IP data
async function getIPData(searchTerm = '') {
    try {
        const baseUrl = 'https://geo.ipify.org/api/v2/country,city';
        const url = searchTerm
            ? `${baseUrl}?apiKey=${API_KEY}&${isValidIP(searchTerm) ? 'ipAddress' : 'domain'}=${searchTerm}`
            : `${baseUrl}?apiKey=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch IP data');
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch IP data. Please try again.');
    }
}

// Function to validate IP address
function isValidIP(ip) {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
}

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = input.value.trim();
    if (searchTerm) {
        getIPData(searchTerm);
    }
});

// Initialize app
async function initApp() {
    try {
        console.log('Fetching configuration...');
        const response = await fetch('/config');
        console.log('Config response status:', response.status);
        const config = await response.json();
        console.log('API Key received:', config.apiKey ? 'Yes' : 'No');
        API_KEY = config.apiKey;
        
        if (!API_KEY) {
            throw new Error('API key not received from server');
        }
        
        getIPData();
    } catch (error) {
        console.error('Error loading configuration:', error);
        alert('Failed to initialize the application. Please try again later.');
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', initApp);
