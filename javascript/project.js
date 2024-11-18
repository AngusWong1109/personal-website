// Random color generator for dots
function getRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
      '#D4A5A5', '#9B859D', '#A8E6CE', '#DCEDC2', '#FFD3B5'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initialize random colors for dots
document.querySelectorAll('.timeline-node').forEach(node => {
    node.style.backgroundColor = getRandomColor();
});

// Scroll animation with improved threshold
function checkScroll() {
    const items = document.querySelectorAll('.timeline-item');
    
    items.forEach(item => {
      const itemTop = item.getBoundingClientRect().top;
      const itemBottom = item.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // Show item when it's 85% into view
      if (itemTop < windowHeight * 0.85 && itemBottom > 0) {
        item.classList.add('visible');
      } else {
        item.classList.remove('visible');
      }
    });
}

// Initial check and add scroll listener
window.addEventListener('load', checkScroll);
window.addEventListener('scroll', checkScroll);

// Dialog functions
function showDialog(projectId) {
    document.getElementById(projectId).classList.add('active');
    document.querySelector('.overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideDialog(projectId) {
    document.getElementById(projectId).classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
    document.body.style.overflow = '';
}

function hideAllDialogs() {
    document.querySelectorAll('.dialog').forEach(dialog => {
      dialog.classList.remove('active');
    });
    document.querySelector('.overlay').classList.remove('active');
    document.body.style.overflow = '';
}

// Close dialog when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      hideAllDialogs();
    }
});