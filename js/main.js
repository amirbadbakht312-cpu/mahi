// نقطه شروع و حلقه اصلی
const WindowManager = {
    canvas: null,
    ctx: null,
    worldWidth: 2400,
    worldHeight: 1800,
    
    init() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initRoundRect();
        this.resize();
        Images.loadInitialImages();
        
        // موقعیت اولیه
        Core.state.squareWorldX = Lake.centerX + Lake.radius + 60;
        Core.state.squareWorldY = Lake.centerY - 100;
        Core.state.currentShape = 'square';
        Core.state.targetWorldX = Core.state.squareWorldX + CONFIG.BASE_SIZE/2;
        Core.state.targetWorldY = Core.state.squareWorldY + CONFIG.BASE_SIZE/2;
        Core.state.hasTarget = false;
        Core.state.targetAlpha = 0;
        Core.state.waypoints = [];
        
        Trail.init();
        
        Camera.x = Core.state.squareWorldX + CONFIG.BASE_SIZE/2 - this.canvas.width/2;
        Camera.y = Core.state.squareWorldY + CONFIG.BASE_SIZE/2 - this.canvas.height/2;
        Camera.update(Core.state.squareWorldX, Core.state.squareWorldY);
        
        Input.init();
        this.startAnimation();
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.worldWidth = window.innerWidth * CONFIG.WORLD_MULTIPLIER;
        this.worldHeight = window.innerHeight * CONFIG.WORLD_MULTIPLIER;
        Lake.updatePosition();
        Geometry.clampSquareToWorld(Core.state);
        Camera.update(Core.state.squareWorldX, Core.state.squareWorldY);
    },
    
    initRoundRect() {
        if (!this.ctx.roundRect) {
            this.ctx.roundRect = function(x, y, w, h, r) {
                if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
                this.beginPath();
                this.moveTo(x + r.tl, y);
                this.lineTo(x + w - r.tr, y);
                this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
                this.lineTo(x + w, y + h - r.br);
                this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
                this.lineTo(x + r.bl, y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
                this.lineTo(x, y + r.tl);
                this.quadraticCurveTo(x, y, x + r.tl, y);
                this.closePath();
            };
        }
    },
    
    animationLoop() {
        Core.update();
        Renderer.draw(this.ctx);
        Minimap.draw(this.ctx);
        requestAnimationFrame(() => this.animationLoop());
    },
    
    startAnimation() {
        this.animationLoop();
    }
};

// شروع برنامه
window.addEventListener('DOMContentLoaded', () => {
    WindowManager.init();
});
