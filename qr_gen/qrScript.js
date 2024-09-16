// Selecting DOM elements
const qrType = document.getElementById('qrType');
const inputFields = document.getElementById('inputFields');
const form = document.getElementById('qrForm');
const qrCodeContainer = document.getElementById('qrcode');
const qrCounter = document.getElementById('qrCounter');

let counter = 0;  // Initialize the counter
let previousData = '';  // Store previous QR code data
let previousSize = 200; // Store previous QR code size

// Function to generate input fields based on QR code type
function generateInputFields() {
    inputFields.innerHTML = '';  // Clear previous input fields

    switch (qrType.value) {
        case 'text':
            inputFields.innerHTML = `<label for="text">Enter Text:</label><input type="text" id="text" required>`;
            break;
        case 'url':
            inputFields.innerHTML = `<label for="url">Enter URL:</label><input type="url" id="url" required>`;
            break;
        case 'email':
            inputFields.innerHTML = `<label for="email">Enter Email:</label><input type="email" id="email" required>`;
            break;
        case 'wifi':
            inputFields.innerHTML = `
                <label for="ssid">Wi-Fi SSID:</label><input type="text" id="ssid" required>
                <label for="password">Password:</label><input type="password" id="password" required>
            `;
            break;
        case 'phone':
            inputFields.innerHTML = `<label for="phone">Enter Phone Number:</label><input type="tel" id="phone" required>`;
            break;
    }
}

// Function to update counter
function updateCounter() {
    counter++;
    qrCounter.textContent = counter;
}

// Function to generate QR code and display it
function generateQRCode() {
    // Get the data from input fields
    let qrData = '';

    switch (qrType.value) {
        case 'text':
            qrData = document.getElementById('text')?.value || '';
            break;
        case 'url':
            qrData = document.getElementById('url')?.value || '';
            break;
        case 'email':
            qrData = `mailto:${document.getElementById('email')?.value || ''}`;
            break;
        case 'wifi':
            const ssid = document.getElementById('ssid')?.value || '';
            const password = document.getElementById('password')?.value || '';
            qrData = `WIFI:S:${ssid};T:WPA;P:${password};;`;
            break;
        case 'phone':
            qrData = `tel:${document.getElementById('phone')?.value || ''}`;
            break;
    }

    // Get the current size
    const qrSize = parseInt(document.getElementById('size')?.value, 10) || 200;

    // Check if the QR data has changed
    if (qrData !== previousData) {
        previousData = qrData; // Update the previous data
        previousSize = qrSize; // Update the previous size
        counter++; // Increment the counter
        qrCounter.textContent = counter;
    } else if (qrSize !== previousSize) {
        previousSize = qrSize; // Update the previous size
    }

    // Clear any previous QR codes
    qrCodeContainer.innerHTML = '';

    // Customizations (color and size)
    const qrColor = document.getElementById('color')?.value || '#000000';
    const scaleFactor = 4; // Increase this value for higher resolution

    // Create QR code
    const qr = qrcode(0, 'L');  // L indicates low error correction level
    qr.addData(qrData);
    qr.make();

    // Generate high-resolution QR code using the canvas
    const canvas = document.createElement('canvas');
    canvas.width = qrSize * scaleFactor;
    canvas.height = qrSize * scaleFactor;
    const context = canvas.getContext('2d');

    // Render the QR code onto the canvas at high resolution
    const cellSize = (qrSize * scaleFactor) / qr.getModuleCount();
    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            context.fillStyle = qr.isDark(row, col) ? qrColor : '#ffffff';
            context.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }

    // Create a container for each QR code
    const qrWrapper = document.createElement('div');
    qrWrapper.style.display = 'inline-block';
    qrWrapper.style.margin = '10px';
    qrWrapper.style.maxWidth = '100%'; // Prevent overflow

    // Append canvas (QR code) to the wrapper
    qrWrapper.appendChild(canvas);

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL();  // Convert canvas to data URL
    downloadLink.download = 'qr-code.png';   // Filename for download
    downloadLink.textContent = 'Download QR Code';
    downloadLink.style.display = 'block';    // Make the link visible
    downloadLink.style.marginTop = '10px';   // Add spacing

    // Append download link to the wrapper
    qrWrapper.appendChild(downloadLink);

    // Append the wrapper to the container
    qrCodeContainer.appendChild(qrWrapper);
}

// Event listener for QR type change
qrType.addEventListener('change', generateInputFields);

// Form submission and QR code generation
form.addEventListener('submit', function (e) {
    e.preventDefault();  // Prevent form from reloading the page
    generateQRCode();
});

// Initialize input fields for the default type (text)
generateInputFields();
