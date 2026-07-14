// مدیریت دوربین
const Camera = {
    x: 0,
    y: 0,
    
    update(squareWorldX, squareWorldY) {
        const viewWidth = WindowManager.canvas.width;
        const viewHeight = WindowManager.canvas.height;
        const squareCenterX = squareWorldX + CONFIG.BASE_SIZE / 2;
        const squareCenterY = squareWorldY + CONFIG.BASE_SIZE / 2;
        
        let targetCamX = this.x;
        let targetCamY = this.y;
        
        const leftEdge = this.x + CONFIG.CAMERA_MARGIN;
        const rightEdge = this.x + viewWidth - CONFIG.CAMERA_MARGIN;
        const topEdge = this.y + CONFIG.CAMERA_MARGIN;
        const bottomEdge = this.y + viewHeight - CONFIG.CAMERA_MARGIN;
        
        if (squareCenterX < leftEdge) {
            targetCamX = squareCenterX - CONFIG.CAMERA_MARGIN;
        } else if (squareCenterX > rightEdge) {
            targetCamX = squareCenterX - viewWidth + CONFIG.CAMERA_MARGIN;
        }
        
        if (squareCenterY < topEdge) {
            targetCamY = squareCenterY - CONFIG.CAMERA_MARGIN;
        } else if (squareCenterY > bottomEdge) {
            targetCamY = squareCenterY - viewHeight + CONFIG.CAMERA_MARGIN;
        }
        
        targetCamX = Math.max(0, Math.min(targetCamX, WindowManager.worldWidth - viewWidth));
        targetCamY = Math.max(0, Math.min(targetCamY, WindowManager.worldHeight - viewHeight));
        
        this.x += (targetCamX - this.x) * 0.12;
        this.y += (targetCamY - this.y) * 0.12;
        
        this.x = Math.max(0, Math.min(this.x, WindowManager.worldWidth - viewWidth));
        this.y = Math.max(0, Math.min(this.y, WindowManager.worldHeight - viewHeight));
    }
};
