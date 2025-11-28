import L from "leaflet"
import pickupIconPng from "./icons/icons8-location-100.png";

// CSS styles for the pickup icon
const pickupIconHTML = `
    <div class="pickup-icon-container">
        <div class="pickup-icon-wrapper">
            <img src="${pickupIconPng}" alt="Pickup" class="pickup-icon-image" />
            <div class="pickup-icon-pulse"></div>
        </div>
        <div class="pickup-road-indicator">
            <div class="pickup-position-dot"></div>
        </div>
    </div>
`;

const pickupIconCSS = `
    .pickup-icon-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .pickup-icon-wrapper {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 3px solid #FF9800;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        animation: pickupIconBounce 2s ease-in-out infinite;
        z-index: 10;
    }
    
    .pickup-icon-image {
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
    }
    
    .pickup-icon-pulse {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #FF9800;
        border-radius: 50%;
        animation: pickupIconPulse 2s ease-in-out infinite;
        opacity: 0.6;
    }
    
    .pickup-road-indicator {
        position: absolute;
        top: 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
    }
    
    .pickup-position-dot {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #FFC107;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: pickupArrowPulse 1.5s ease-in-out infinite;
        position: relative;
    }
    
    .pickup-position-dot::after {
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
    
    @keyframes pickupIconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    @keyframes pickupIconPulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.1);
            opacity: 0.3;
        }
    }
    
    @keyframes pickupArrowPulse {
        0%, 100% { 
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        50% { 
            transform: scale(1.1) translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(255, 193, 7, 0.4));
        }
    }
    
    .pickup-icon-container:hover .pickup-icon-wrapper {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(255, 152, 0, 0.4);
        transition: all 0.3s ease;
    }
    
    .pickup-icon-container:hover .pickup-icon-pulse {
        animation-duration: 1s;
    }
    
    .pickup-icon-container:hover .pickup-position-dot {
        border-top-color: #F57C00;
        animation-duration: 0.8s;
    }
    
    .pickup-icon-container:hover .pickup-position-dot::after {
        border-top-color: #fff;
    }
`;

// Inject CSS styles
if (typeof document !== 'undefined' && !document.getElementById('pickup-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'pickup-icon-styles';
    style.textContent = pickupIconCSS;
    document.head.appendChild(style);
}

export const pickupIcon = L.divIcon({
    html: pickupIconHTML,
    className: 'custom-pickup-icon',
    iconSize: [70, 70],     // increased size to accommodate road indicator
    iconAnchor: [35, 35]    // center point
});

// Alternative simpler version with just enhanced styling
export const pickupIconSimple = L.icon({
    iconUrl: pickupIconPng,
    iconSize: [40, 40],     // larger size
    iconAnchor: [20, 20],   // center point
    className: 'simple-pickup-icon'
});

// CSS for simple version
const simplePickupIconCSS = `
    .simple-pickup-icon {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .simple-pickup-icon:hover {
        filter: drop-shadow(0 6px 12px rgba(255, 152, 0, 0.5));
        transform: scale(1.1);
    }
`;

// Inject simple CSS styles
if (typeof document !== 'undefined' && !document.getElementById('simple-pickup-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'simple-pickup-icon-styles';
    style.textContent = simplePickupIconCSS;
    document.head.appendChild(style);
}