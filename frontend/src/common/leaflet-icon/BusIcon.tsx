import L from "leaflet"
import busIconPng from "./icons/icons8-bus-100.png";

// CSS styles for the bus icon
const busIconHTML = `
    <div class="bus-icon-container">
        <div class="bus-icon-wrapper">
            <img src="${busIconPng}" alt="Bus" class="bus-icon-image" />
            <div class="bus-icon-pulse"></div>
        </div>
        <div class="bus-road-indicator">
            <div class="bus-position-dot"></div>
        </div>
    </div>
`;

const busIconCSS = `
    .bus-icon-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .bus-icon-wrapper {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 3px solid #2196F3;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        animation: busIconBounce 2s ease-in-out infinite;
        z-index: 10;
    }
    
    .bus-icon-image {
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
    }
    
    .bus-icon-pulse {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #2196F3;
        border-radius: 50%;
        animation: busIconPulse 2s ease-in-out infinite;
        opacity: 0.6;
    }
    
    .bus-road-indicator {
        position: absolute;
        top: 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
    }
    
    .bus-position-dot {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #FF5722;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: busArrowPulse 1.5s ease-in-out infinite;
        position: relative;
    }
    
    .bus-position-dot::after {
        content: '';
        position: absolute;
        top: -15px;
        left: -6px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 9px solid #fff;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
    
    @keyframes busIconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    @keyframes busIconPulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.1);
            opacity: 0.3;
        }
    }
    
    @keyframes busRoadMove {
        0% { background-position: 0 0; }
        100% { background-position: 8px 0; }
    }
    
    @keyframes busArrowPulse {
        0%, 100% { 
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        50% { 
            transform: scale(1.1) translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(255, 87, 34, 0.4));
        }
    }
    
    .bus-icon-container:hover .bus-icon-wrapper {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
        transition: all 0.3s ease;
    }
    
    .bus-icon-container:hover .bus-icon-pulse {
        animation-duration: 1s;
    }
    
    .bus-icon-container:hover .bus-position-dot {
        border-top-color: #E91E63;
        animation-duration: 0.8s;
    }
    
    .bus-icon-container:hover .bus-position-dot::after {
        border-top-color: #fff;
    }
`;

// Inject CSS styles
if (typeof document !== 'undefined' && !document.getElementById('bus-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'bus-icon-styles';
    style.textContent = busIconCSS;
    document.head.appendChild(style);
}

export const busIcon = L.divIcon({
    html: busIconHTML,
    className: 'custom-bus-icon',
    iconSize: [70, 70],     // increased size to accommodate road indicator
    iconAnchor: [35, 35]    // center point
});

// Alternative simpler version with just enhanced styling
export const busIconSimple = L.icon({
    iconUrl: busIconPng,
    iconSize: [40, 40],     // larger size
    iconAnchor: [20, 20],   // center point
    className: 'simple-bus-icon'
});

// CSS for simple version
const simpleBusIconCSS = `
    .simple-bus-icon {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .simple-bus-icon:hover {
        filter: drop-shadow(0 6px 12px rgba(33, 150, 243, 0.5));
        transform: scale(1.1);
    }
`;

// Inject simple CSS styles
if (typeof document !== 'undefined' && !document.getElementById('simple-bus-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'simple-bus-icon-styles';
    style.textContent = simpleBusIconCSS;
    document.head.appendChild(style);
}