// نوار ابزار
const Toolbar = {
    squares: [],
    
    isClickOnToolbar(screenX, screenY) {
        const totalWidth = this.squares.length * (CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING) - CONFIG.TOOLBAR_PADDING;
        const startX = (WindowManager.canvas.width - totalWidth) / 2;
        const startY = WindowManager.canvas.height - CONFIG.TOOLBAR_SQUARE_SIZE - CONFIG.TOOLBAR_Y_OFFSET;
        
        for (let i = 0; i < this.squares.length; i++) {
            const sx = startX + i * (CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING);
            const sy = startY;
            if (screenX >= sx && screenX <= sx + CONFIG.TOOLBAR_SQUARE_SIZE &&
                screenY >= sy && screenY <= sy + CONFIG.TOOLBAR_SQUARE_SIZE) {
                return i;
            }
        }
        return -1;
    },
    
    updateSquares() {
        const totalWidth = 4 * (CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING) - CONFIG.TOOLBAR_PADDING;
        const startX = (WindowManager.canvas.width - totalWidth) / 2;
        const startY = WindowManager.canvas.height - CONFIG.TOOLBAR_SQUARE_SIZE - CONFIG.TOOLBAR_Y_OFFSET;
        
        this.squares = [];
        for (let i = 0; i < 4; i++) {
            this.squares.push({
                x: startX + i * (CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING),
                y: startY,
                size: CONFIG.TOOLBAR_SQUARE_SIZE
            });
        }
    }
};
