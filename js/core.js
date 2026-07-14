// هسته اصلی و مدیریت وضعیت
const Core = {
    // وضعیت فعلی
    state: {
        squareWorldX: 400,
        squareWorldY: 350,
        currentShape: 'square',
        targetWorldX: 400,
        targetWorldY: 350,
        hasTarget: false,
        waypoints: [],
        targetAlpha: 0,
        imageFlashTimer: 0,
        currentFlashIndex: 0,
        selectedTool: -1
    },
    
    // به‌روزرسانی وضعیت
    update() {
        Trail.addPosition(this.state.squareWorldX, this.state.squareWorldY);
        
        if (this.state.hasTarget) {
            this.state.imageFlashTimer++;
            if (this.state.imageFlashTimer >= CONFIG.FLASH_INTERVAL) {
                this.state.imageFlashTimer = 0;
                this.state.currentFlashIndex = (this.state.currentFlashIndex + 1) % 3;
            }
        } else {
            this.state.currentFlashIndex = 0;
            this.state.imageFlashTimer = 0;
        }
        
        if (this.state.hasTarget) {
            this.moveTowardsTarget();
        }
        
        Camera.update(this.state.squareWorldX, this.state.squareWorldY);
        
        if (!this.state.hasTarget && this.state.targetAlpha > 0) {
            this.state.targetAlpha = Math.max(0, this.state.targetAlpha - CONFIG.TARGET_FADE_SPEED);
        } else if (this.state.hasTarget) {
            this.state.targetAlpha = CONFIG.TARGET_MAX_ALPHA;
        }
    },
    
    moveTowardsTarget() {
        let currentTargetX = this.state.targetWorldX;
        let currentTargetY = this.state.targetWorldY;
        
        if (this.state.waypoints.length > 0) {
            currentTargetX = this.state.waypoints[0].x;
            currentTargetY = this.state.waypoints[0].y;
        }
        
        const centerX = this.state.squareWorldX + CONFIG.BASE_SIZE / 2;
        const centerY = this.state.squareWorldY + CONFIG.BASE_SIZE / 2;
        const dx = currentTargetX - centerX;
        const dy = currentTargetY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= CONFIG.ARRIVAL_THRESHOLD) {
            if (this.state.waypoints.length > 0) {
                this.state.waypoints.shift();
            } else {
                this.state.squareWorldX = this.state.targetWorldX - CONFIG.BASE_SIZE / 2;
                this.state.squareWorldY = this.state.targetWorldY - CONFIG.BASE_SIZE / 2;
                Geometry.clampSquareToWorld(this.state);
                this.state.hasTarget = false;
            }
            return;
        }
        
        const step = Math.min(CONFIG.MOVE_SPEED, distance);
        const normX = dx / distance;
        const normY = dy / distance;
        let newX = this.state.squareWorldX + normX * step;
        let newY = this.state.squareWorldY + normY * step;
        
        if (Geometry.isSquareCollidingWithLake(newX, newY, CONFIG.LAKE_BUFFER)) {
            const obsDx = (newX + CONFIG.BASE_SIZE/2) - Lake.centerX;
            const obsDy = (newY + CONFIG.BASE_SIZE/2) - Lake.centerY;
            const obsDist = Math.sqrt(obsDx * obsDx + obsDy * obsDy);
            
            if (obsDist > 0.01) {
                const safeDist = Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE/2;
                newX = Lake.centerX + (obsDx / obsDist) * safeDist - CONFIG.BASE_SIZE/2;
                newY = Lake.centerY + (obsDy / obsDist) * safeDist - CONFIG.BASE_SIZE/2;
            } else {
                newX = Lake.centerX + Lake.radius + CONFIG.LAKE_BUFFER + 5;
                newY = Lake.centerY;
            }
            
            this.state.waypoints = Geometry.calculatePathWithLakeAvoidance(
                newX + CONFIG.BASE_SIZE/2, 
                newY + CONFIG.BASE_SIZE/2, 
                this.state.targetWorldX, 
                this.state.targetWorldY
            );
        }
        
        this.state.squareWorldX = newX;
        this.state.squareWorldY = newY;
        Geometry.clampSquareToWorld(this.state);
        
        if (Geometry.isSquareCollidingWithLake(this.state.squareWorldX, this.state.squareWorldY, 0)) {
            const safePoint = Geometry.getClosestSafePointOnLake(
                this.state.squareWorldX + CONFIG.BASE_SIZE/2, 
                this.state.squareWorldY + CONFIG.BASE_SIZE/2
            );
            this.state.squareWorldX = safePoint.x - CONFIG.BASE_SIZE/2;
            this.state.squareWorldY = safePoint.y - CONFIG.BASE_SIZE/2;
            Geometry.clampSquareToWorld(this.state);
        }
    },
    
    setTarget(worldX, worldY) {
        if (Geometry.isPointInsideLake(worldX, worldY, CONFIG.BASE_SIZE/2)) {
            const safePoint = Geometry.getClosestSafePointOnLake(worldX, worldY);
            this.state.targetWorldX = safePoint.x;
            this.state.targetWorldY = safePoint.y;
        } else {
            this.state.targetWorldX = Math.max(CONFIG.BASE_SIZE/2, Math.min(worldX, WindowManager.worldWidth - CONFIG.BASE_SIZE/2));
            this.state.targetWorldY = Math.max(CONFIG.BASE_SIZE/2, Math.min(worldY, WindowManager.worldHeight - CONFIG.BASE_SIZE/2));
        }
        
        const squareCenterX = this.state.squareWorldX + CONFIG.BASE_SIZE / 2;
        const squareCenterY = this.state.squareWorldY + CONFIG.BASE_SIZE / 2;
        const dx = this.state.targetWorldX - squareCenterX;
        const dy = this.state.targetWorldY - squareCenterY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) this.state.currentShape = 'trapezoid';
            else this.state.currentShape = 'circle';
        } else {
            if (dy < 0) this.state.currentShape = 'triangle';
            else this.state.currentShape = 'square';
        }
        
        this.state.imageFlashTimer = 0;
        this.state.currentFlashIndex = 0;
        this.state.waypoints = Geometry.calculatePathWithLakeAvoidance(
            squareCenterX, squareCenterY, 
            this.state.targetWorldX, this.state.targetWorldY
        );
        this.state.hasTarget = true;
        this.state.targetAlpha = CONFIG.TARGET_MAX_ALPHA;
    }
};
