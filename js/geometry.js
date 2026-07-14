// توابع هندسی و مدیریت برخورد
const Geometry = {
    isPointInsideLake(px, py, buffer = 0) {
        const dx = px - Lake.centerX;
        const dy = py - Lake.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < Lake.radius + buffer;
    },
    
    isSquareCollidingWithLake(sx, sy, buffer = 0) {
        const corners = [
            { x: sx, y: sy },
            { x: sx + CONFIG.BASE_SIZE, y: sy },
            { x: sx, y: sy + CONFIG.BASE_SIZE },
            { x: sx + CONFIG.BASE_SIZE, y: sy + CONFIG.BASE_SIZE }
        ];
        
        for (const corner of corners) {
            if (this.isPointInsideLake(corner.x, corner.y, buffer)) return true;
        }
        
        const centerX = sx + CONFIG.BASE_SIZE / 2;
        const centerY = sy + CONFIG.BASE_SIZE / 2;
        
        return this.isPointInsideLake(centerX, centerY, buffer);
    },
    
    getClosestSafePointOnLake(worldX, worldY) {
        const dx = worldX - Lake.centerX;
        const dy = worldY - Lake.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            return {
                x: Lake.centerX + Math.cos(angle) * (Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE/2),
                y: Lake.centerY + Math.sin(angle) * (Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE/2)
            };
        }
        
        const safeDist = Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE / 2;
        const normX = dx / dist;
        const normY = dy / dist;
        
        return {
            x: Lake.centerX + normX * safeDist,
            y: Lake.centerY + normY * safeDist
        };
    },
    
    doesLineIntersectLake(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const fx = x1 - Lake.centerX;
        const fy = y1 - Lake.centerY;
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = fx * fx + fy * fy - (Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE/2) ** 2;
        
        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return false;
        
        discriminant = Math.sqrt(discriminant);
        const t1 = (-b - discriminant) / (2 * a);
        const t2 = (-b + discriminant) / (2 * a);
        
        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    },
    
    calculatePathWithLakeAvoidance(fromX, fromY, toX, toY) {
        const path = [];
        
        if (!this.doesLineIntersectLake(fromX, fromY, toX, toY)) {
            return path;
        }
        
        const fromSafe = this.getClosestSafePointOnLake(fromX, fromY);
        const toSafe = this.getClosestSafePointOnLake(toX, toY);
        
        const angleFrom = Math.atan2(fromSafe.y - Lake.centerY, fromSafe.x - Lake.centerX);
        const angleTo = Math.atan2(toSafe.y - Lake.centerY, toSafe.x - Lake.centerX);
        
        let angleDiff = angleTo - angleFrom;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        
        const safeRadius = Lake.radius + CONFIG.LAKE_BUFFER + CONFIG.BASE_SIZE / 2;
        const midAngle = angleFrom + angleDiff / 2;
        
        const midPoint = {
            x: Lake.centerX + Math.cos(midAngle) * safeRadius * 1.4,
            y: Lake.centerY + Math.sin(midAngle) * safeRadius * 1.4
        };
        
        midPoint.x = Math.max(CONFIG.BASE_SIZE, Math.min(WindowManager.worldWidth - CONFIG.BASE_SIZE, midPoint.x));
        midPoint.y = Math.max(CONFIG.BASE_SIZE, Math.min(WindowManager.worldHeight - CONFIG.BASE_SIZE, midPoint.y));
        
        path.push(midPoint);
        return path;
    },
    
    clampSquareToWorld(state) {
        if (state.squareWorldX < 0) state.squareWorldX = 0;
        if (state.squareWorldY < 0) state.squareWorldY = 0;
        if (state.squareWorldX + CONFIG.BASE_SIZE > WindowManager.worldWidth) {
            state.squareWorldX = WindowManager.worldWidth - CONFIG.BASE_SIZE;
        }
        if (state.squareWorldY + CONFIG.BASE_SIZE > WindowManager.worldHeight) {
            state.squareWorldY = WindowManager.worldHeight - CONFIG.BASE_SIZE;
        }
    },
    
    getWoodPosition(state) {
        const centerX = state.squareWorldX + CONFIG.BASE_SIZE / 2;
        const centerY = state.squareWorldY + CONFIG.BASE_SIZE / 2;
        const woodSize = CONFIG.BASE_SIZE * CONFIG.WOOD_SIZE_RATIO;
        
        let woodX;
        if (Images.shouldFlipImage(state)) {
            woodX = state.squareWorldX + CONFIG.BASE_SIZE - woodSize;
        } else {
            woodX = state.squareWorldX;
        }
        
        const woodY = centerY - woodSize / 2;
        
        return { x: woodX, y: woodY, size: woodSize };
    }
};
