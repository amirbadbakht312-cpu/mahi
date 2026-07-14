// مدیریت ورودی‌ها
const Input = {
    init() {
        const canvas = WindowManager.canvas;
        canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
        canvas.addEventListener('touchstart', this.onPointerDown.bind(this), { passive: false });
        
        document.addEventListener('touchmove', this.preventTouchDefaults, { passive: false });
        document.addEventListener('gesturestart', this.preventTouchDefaults);
        document.addEventListener('gesturechange', this.preventTouchDefaults);
        document.addEventListener('gestureend', this.preventTouchDefaults);
        
        window.addEventListener('resize', () => WindowManager.resize());
    },
    
    preventTouchDefaults(e) {
        e.preventDefault();
    },
    
    getCanvasCoords(e) {
        const rect = WindowManager.canvas.getBoundingClientRect();
        const scaleX = WindowManager.canvas.width / rect.width;
        const scaleY = WindowManager.canvas.height / rect.height;
        
        let clientX, clientY;
        if (e.touches) {
            if (e.touches.length === 0) return null;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    },
    
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + Camera.x,
            y: screenY + Camera.y
        };
    },
    
    onPointerDown(e) {
        e.preventDefault();
        const coords = this.getCanvasCoords(e);
        if (!coords) return;
        
        // بررسی نوار ابزار
        const toolIndex = Toolbar.isClickOnToolbar(coords.x, coords.y);
        if (toolIndex >= 0) {
            if (Core.state.selectedTool === toolIndex) {
                Core.state.selectedTool = -1;
            } else {
                Core.state.selectedTool = toolIndex;
            }
            return;
        }
        
        // کلیک روی دنیا
        const worldPos = this.screenToWorld(coords.x, coords.y);
        Core.setTarget(worldPos.x, worldPos.y);
    }
};
