// نقشه کوچک
const Minimap = {
    draw(ctx) {
        const mmX = WindowManager.canvas.width - CONFIG.MINIMAP_WIDTH - CONFIG.MINIMAP_PADDING;
        const mmY = CONFIG.MINIMAP_PADDING;
        
        this.drawBackground(ctx, mmX, mmY);
        this.drawContent(ctx, mmX, mmY);
        this.drawLabel(ctx, mmX, mmY);
    },
    
    drawBackground(ctx, mmX, mmY) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = 'rgba(10, 10, 22, 0.75)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(mmX, mmY, CONFIG.MINIMAP_WIDTH, CONFIG.MINIMAP_HEIGHT, CONFIG.MINIMAP_BORDER_RADIUS);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    },
    
    drawContent(ctx, mmX, mmY) {
        const margin = 4;
        const mapLeft = mmX + margin;
        const mapTop = mmY + margin;
        const mapWidth = CONFIG.MINIMAP_WIDTH - margin * 2;
        const mapHeight = CONFIG.MINIMAP_HEIGHT - margin * 2;
        const scaleX = mapWidth / WindowManager.worldWidth;
        const scaleY = mapHeight / WindowManager.worldHeight;
        
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(mmX, mmY, CONFIG.MINIMAP_WIDTH, CONFIG.MINIMAP_HEIGHT, CONFIG.MINIMAP_BORDER_RADIUS);
        ctx.clip();
        
        // پس‌زمینه مینی‌مپ
        ctx.fillStyle = 'rgba(25, 25, 45, 0.8)';
        ctx.fillRect(mapLeft, mapTop, mapWidth, mapHeight);
        
        // دریاچه کوچک
        const lakeMiniX = mapLeft + Lake.centerX * scaleX;
        const lakeMiniY = mapTop + Lake.centerY * scaleY;
        const lakeMiniR = Lake.radius * scaleX;
        ctx.fillStyle = 'rgba(30, 100, 200, 0.6)';
        ctx.beginPath();
        ctx.arc(lakeMiniX, lakeMiniY, Math.max(lakeMiniR, 3), 0, Math.PI*2);
        ctx.fill();
        
        // شبکه
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 0.3;
        for (let wx = 0; wx <= WindowManager.worldWidth; wx += 200) {
            ctx.beginPath();
            ctx.moveTo(mapLeft + wx * scaleX, mapTop);
            ctx.lineTo(mapLeft + wx * scaleX, mapTop + mapHeight);
            ctx.stroke();
        }
        for (let wy = 0; wy <= WindowManager.worldHeight; wy += 200) {
            ctx.beginPath();
            ctx.moveTo(mapLeft, mapTop + wy * scaleY);
            ctx.lineTo(mapLeft + mapWidth, mapTop + wy * scaleY);
            ctx.stroke();
        }
        
        // محدوده دید دوربین
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(
            mapLeft + Camera.x * scaleX, 
            mapTop + Camera.y * scaleY, 
            WindowManager.canvas.width * scaleX, 
            WindowManager.canvas.height * scaleY
        );
        
        // موقعیت شکل اصلی
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(
            mapLeft + Core.state.squareWorldX * scaleX, 
            mapTop + Core.state.squareWorldY * scaleY, 
            Math.max(4, CONFIG.BASE_SIZE * scaleX), 
            Math.max(4, CONFIG.BASE_SIZE * scaleX)
        );
        
        // هدف
        if (Core.state.hasTarget || Core.state.targetAlpha > 0.1) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(
                mapLeft + Core.state.targetWorldX * scaleX, 
                mapTop + Core.state.targetWorldY * scaleY, 
                2.4, 0, 2*Math.PI
            );
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    drawLabel(ctx, mmX, mmY) {
        ctx.save();
        ctx.font = '9px system-ui';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('نقشه', mmX + 6, mmY + 14);
        ctx.restore();
    }
};
