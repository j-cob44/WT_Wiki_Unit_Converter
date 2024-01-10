// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const defaultOptions = {speed: "mph", altitude: "feet", climbSpeed: "feet/minute"};
const restoreOptions = () => {
  chrome.storage.sync.get(defaultOptions).then((newOptions) => {
    document.getElementById('speed').value = newOptions.speed;
    document.getElementById('altitude').value = newOptions.altitude;
    document.getElementById('climb-speed').value = newOptions.climbSpeed;
  });
};

// Saves options to chrome.storage
const saveOptions = () => {
  const speed = document.getElementById('speed').value;
  const altitude = document.getElementById('altitude').value;
  const climbSpeed = document.getElementById('climb-speed').value;
  const options = {speed, altitude, climbSpeed};

  chrome.storage.sync.set(options).then(() => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Unit settings saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 750);
  });
};
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
