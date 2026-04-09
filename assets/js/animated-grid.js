/**
 * Animated Grid Background
 * Recreates the Avail docs animated dot grid effect
 * Vanilla JS implementation - no dependencies
 */

class AnimatedGrid {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {
      gridSize: 5,           // Distance between dots (very dense pattern)
      dotSize: 1.5,          // Base dot size (small, subtle)
      dotColor: 'rgba(10, 107, 235, 0.25)',  // Blue with opacity (light mode)
      dotColorDark: 'rgba(135, 135, 135, 0.25)',  // Grey with opacity (dark mode)
      animationSpeed: 0.3,   // Speed of pulse animation
      pulseRange: 0.5,       // How much dots pulse (size variation)
      ...options
    };
    
    this.dots = [];
    this.animationFrame = null;
    this.time = 0;
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createDots();
    this.animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
      this.resize();
      this.createDots();
    });
    
    // Theme change handler
    this.setupThemeListener();
  }
  
  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    
    const rect = parent.getBoundingClientRect();
    
    // Set canvas size to match parent
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Recreate dots on resize
    this.createDots();
  }
  
  createDots() {
    this.dots = [];
    const { gridSize } = this.options;
    
    // Create grid of dots
    for (let x = 0; x < this.canvas.width; x += gridSize) {
      for (let y = 0; y < this.canvas.height; y += gridSize) {
        // Add some randomness to position
        const offsetX = (Math.random() - 0.5) * gridSize * 0.3;
        const offsetY = (Math.random() - 0.5) * gridSize * 0.3;
        
        this.dots.push({
          x: x + offsetX,
          y: y + offsetY,
          baseX: x,
          baseY: y,
          phase: Math.random() * Math.PI * 2,  // Random animation phase
          offset: Math.random() * 1000          // Random offset for variation
        });
      }
    }
  }
  
  getDotColor() {
    const isDark = document.documentElement.classList.contains('dark');
    return isDark ? this.options.dotColorDark : this.options.dotColor;
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const color = this.getDotColor();
    this.ctx.fillStyle = color;
    
    this.time += this.options.animationSpeed;
    
    this.dots.forEach(dot => {
      // Calculate pulse effect
      const pulse = Math.sin(this.time + dot.phase + dot.offset * 0.001) * this.options.pulseRange;
      const size = this.options.dotSize + pulse;
      
      // Draw dot
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, Math.max(0.5, size), 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
  
  setupThemeListener() {
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // Theme changed, dots will update color on next frame
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Auto-initialize if canvas exists
document.addEventListener('DOMContentLoaded', () => {
  // Make AnimatedGrid available globally
  window.AnimatedGrid = AnimatedGrid;
  
  // Initialize main canvas
  const canvas = document.querySelector('.animated-grid-canvas');
  if (canvas) {
    window.animatedGrid = new AnimatedGrid(canvas);
  }
  
  // Initialize inner canvas (for white card background)
  const innerCanvas = document.querySelector('.inner-grid-canvas');
  if (innerCanvas) {
    window.innerGrid = new AnimatedGrid(innerCanvas);
  }
});
