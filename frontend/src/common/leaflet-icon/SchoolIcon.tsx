import L from "leaflet"
import schoolIconPng from "./icons/icons8-school-96.png";

// CSS styles for the school icon
const schoolIconHTML = `
    <div class="school-icon-container">
        <div class="school-icon-wrapper">
            <img src="${schoolIconPng}" alt="School" class="school-icon-image" />
            <div class="school-icon-pulse"></div>
        </div>
        <div class="school-road-indicator">
            <div class="school-position-dot"></div>
        </div>
    </div>
`;

const schoolIconCSS = `
    .school-icon-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .school-icon-wrapper {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 3px solid #4CAF50;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        animation: schoolIconBounce 2s ease-in-out infinite;
        z-index: 10;
    }
    
    .school-icon-image {
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
    }
    
    .school-icon-pulse {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #4CAF50;
        border-radius: 50%;
        animation: schoolIconPulse 2s ease-in-out infinite;
        opacity: 0.6;
    }
    
    .school-road-indicator {
        position: absolute;
        top: 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
    }
    
    .school-position-dot {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #8BC34A;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: schoolArrowPulse 1.5s ease-in-out infinite;
        position: relative;
    }
    
    .school-position-dot::after {
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
    
    @keyframes schoolIconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    @keyframes schoolIconPulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.1);
            opacity: 0.3;
        }
    }
    
    @keyframes schoolArrowPulse {
        0%, 100% { 
            transform: scale(1) translateY(0);
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
        50% { 
            transform: scale(1.1) translateY(-2px);
            filter: drop-shadow(0 4px 8px rgba(139, 195, 74, 0.4));
        }
    }
    
    .school-icon-container:hover .school-icon-wrapper {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
        transition: all 0.3s ease;
    }
    
    .school-icon-container:hover .school-icon-pulse {
        animation-duration: 1s;
    }
    
    .school-icon-container:hover .school-position-dot {
        border-top-color: #689F38;
        animation-duration: 0.8s;
    }
    
    .school-icon-container:hover .school-position-dot::after {
        border-top-color: #fff;
    }
`;

// Inject CSS styles
if (typeof document !== 'undefined' && !document.getElementById('school-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'school-icon-styles';
    style.textContent = schoolIconCSS;
    document.head.appendChild(style);
}

export const schoolIcon = L.divIcon({
    html: schoolIconHTML,
    className: 'custom-school-icon',
    iconSize: [70, 70],     // increased size to accommodate road indicator
    iconAnchor: [35, 35]    // center point
});

// Alternative simpler version with just enhanced styling
export const schoolIconSimple = L.icon({
    iconUrl: schoolIconPng,
    iconSize: [40, 40],     // larger size
    iconAnchor: [20, 20],   // center point
    className: 'simple-school-icon'
});

// CSS for simple version
const simpleSchoolIconCSS = `
    .simple-school-icon {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .simple-school-icon:hover {
        filter: drop-shadow(0 6px 12px rgba(76, 175, 80, 0.5));
        transform: scale(1.1);
    }
`;

// Inject simple CSS styles
if (typeof document !== 'undefined' && !document.getElementById('simple-school-icon-styles')) {
    const style = document.createElement('style');
    style.id = 'simple-school-icon-styles';
    style.textContent = simpleSchoolIconCSS;
    document.head.appendChild(style);
}