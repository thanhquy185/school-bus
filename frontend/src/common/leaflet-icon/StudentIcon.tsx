import L from "leaflet"
import defaultStudentIconPng from "./icons/icons8-student-100.png";

// Function to create student icon HTML with dynamic image
const createStudentIconHTML = (imageUrl?: string | null) => {
    const finalImageUrl = imageUrl || defaultStudentIconPng;
    
    return `
        <div class="student-icon-container">
            <div class="student-icon-wrapper">
                <img src="${finalImageUrl}" alt="Student" class="student-icon-image" />
                <div class="student-icon-pulse"></div>
            </div>
            <div class="student-road-indicator">
                <div class="student-position-dot"></div>
            </div>
        </div>
    `;
};

const studentIconCSS = `
    .student-icon-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .student-icon-wrapper {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 3px solid #9C27B0;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
        animation: studentIconBounce 2s ease-in-out infinite;
        z-index: 10;
    }
    
    .student-icon-image {
        width: 24px;
        height: 24px;
        object-fit: contain;
        z-index: 2;
        border-radius: 50%;
    }
    
    .student-icon-pulse {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid #9C27B0;
        border-radius: 50%;
        animation: studentIconPulse 2s ease-in-out infinite;
        opacity: 0.6;
    }
    
    .student-road-indicator {
        position: absolute;
        top: 45px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
    }
    
    .student-position-dot {
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 12px solid #E91E63;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        animation: studentArrowPulse 1.5s ease-in-out infinite;
        position: relative;
    }
    
    .student-position-dot::after {
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
    
    @keyframes studentIconBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    
    @keyframes studentIconPulse {
        0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
        }
        50% { 
            transform: scale(1.1);
            opacity: 0.8;
        }
    }
    
    @keyframes studentArrowPulse {
        0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.8;
        }
        50% { 
            transform: translateY(-2px) scale(1.05);
            opacity: 1;
        }
    }
`;

// Function to inject CSS if not already injected
let isStudentCSSInjected = false;

const injectStudentCSS = () => {
    if (!isStudentCSSInjected) {
        const styleElement = document.createElement('style');
        styleElement.textContent = studentIconCSS;
        document.head.appendChild(styleElement);
        isStudentCSSInjected = true;
    }
};

// Function to create student icon
export const createStudentIcon = (imageUrl?: string | null) => {
    // Inject CSS
    injectStudentCSS();
    
    // Create the icon
    return L.divIcon({
        html: createStudentIconHTML(imageUrl),
        className: 'student-leaflet-div-icon',
        iconSize: [50, 60],
        iconAnchor: [25, 55],
        popupAnchor: [0, -55]
    });
};

// Default export function
const StudentIcon = (imageUrl?: string | null) => createStudentIcon(imageUrl);

export default StudentIcon;
