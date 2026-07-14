// رندرینگ اصلی
const Renderer = {
    draw(ctx) {
        ctx.clearRect(0, 0, WindowManager.canvas.width, WindowManager.canvas.height);
        
        // پس‌زمینه
        if (Images.backgroundLoaded && Images.backgroundImage.complete) {
            ctx.drawImage(Images.backgroundImage, 0, 0, WindowManager.canvas.width, WindowManager.canvas.height);
        } else {
            ctx.fillStyle = '#0f0f1f';
            ctx.fillRect(0, 0, WindowManager.canvas.width, WindowManager.canvas.height);
        }
        
        ctx.save();
        ctx.translate(-Camera.x, -Camera.y);
        
        this.drawGrid(ctx);
        this.drawWorldBorder(ctx);
        this.drawLake(ctx);
        this.drawWaypoints(ctx);
        this.drawTarget(ctx);
        this.drawTrail(ctx);
        this.drawMainShape(ctx);
        this.drawWood(ctx);
        this.drawDashedLine(ctx);
        
        ctx.restore();
        
        // نوار ابزار (بیرون از translate دوربین)
        this.drawToolbar(ctx);
    },
    
    drawGrid(ctx) {
        ctx.strokeStyle = 'rgba(180, 180, 255, 0.06)';
        ctx.lineWidth = 0.8;
        const gridStep = 110;
        const startX = Math.floor(Camera.x / gridStep) * gridStep;
        const startY = Math.floor(Camera.y / gridStep) * gridStep;
        const endX = Camera.x + WindowManager.canvas.width + gridStep;
        const endY = Camera.y + WindowManager.canvas.height + gridStep;
        
        for (let x = startX; x <= endX; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endY);
            ctx.stroke();
        }
        for (let y = startY; y <= endY; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(startX, y);
            ctx.lineTo(endX, y);
            ctx.stroke();
        }
        
        // نقاط ریز
        ctx.fillStyle = 'rgba(200, 200, 255, 0.08)';
        const dotStep = 45;
        for (let x = Math.floor(Camera.x / dotStep) * dotStep; x <= endX; x += dotStep) {
            for (let y = Math.floor(Camera.y / dotStep) * dotStep; y <= endY; y += dotStep) {
                ctx.beginPath();
                ctx.arc(x, y, 1.3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },
    
    drawWorldBorder(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(0, 0, WindowManager.worldWidth, WindowManager.worldHeight);
    },
    
    drawLake(ctx) {
        if (Images.lakeImageLoaded && Images.lakeImage.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(Lake.centerX, Lake.centerY, Lake.radius, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(
                Images.lakeImage, 
                Lake.centerX - Lake.radius, 
                Lake.centerY - Lake.radius, 
                Lake.radius * 2, 
                Lake.radius * 2
            );
            ctx.restore();
            
            ctx.save();
            ctx.strokeStyle = 'rgba(100, 180, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(Lake.centerX, Lake.centerY, Lake.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    },
    
    drawWaypoints(ctx) {
        if (Core.state.waypoints.length > 0 && Core.state.hasTarget) {
            ctx.save();
            ctx.fillStyle = '#ff9f1c';
            ctx.shadowColor = 'rgba(255, 159, 28, 0.7)';
            ctx.shadowBlur = 12;
            for (const wp of Core.state.waypoints) {
                ctx.beginPath();
                ctx.arc(wp.x, wp.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    },
    
    drawTarget(ctx) {
        if (Core.state.targetAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = Core.state.targetAlpha;
            const grad = ctx.createRadialGradient(
                Core.state.targetWorldX, Core.state.targetWorldY, 3,
                Core.state.targetWorldX, Core.state.targetWorldY, 30
            );
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(0.6, 'rgba(255,255,255,0.3)');
            grad.addColorStop(1, 'rgba(255,255,200,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(Core.state.targetWorldX, Core.state.targetWorldY, 24, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(Core.state.targetWorldX, Core.state.targetWorldY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    },
    
    drawTrail(ctx) {
        if (Trail.positions.length > 1) {
            for (let i = 0; i < Trail.positions.length; i++) {
                const pos = Trail.positions[i];
                const progress = i / (Trail.positions.length - 1 || 1);
                const alpha = 0.04 + progress * 0.2;
                const scale = 0.55 + progress * 0.45;
                this.drawImageShape(ctx, pos.x, pos.y, alpha, scale);
            }
        }
    },
    
    drawMainShape(ctx) {
        this.drawImageShape(ctx, Core.state.squareWorldX, Core.state.squareWorldY, 1.0, 1.0);
    },
    
    drawWood(ctx) {
        if (Core.state.selectedTool !== 0 || !Images.choobLoaded || !Images.choobImage.complete) return;
        
        const woodPos = Geometry.getWoodPosition(Core.state);
        ctx.save();
        ctx.drawImage(Images.choobImage, woodPos.x, woodPos.y, woodPos.size, woodPos.size);
        ctx.restore();
    },
    
    drawDashedLine(ctx) {
        if (Core.state.hasTarget && Core.state.targetAlpha > 0.15) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.3;
            ctx.setLineDash([7, 9]);
            ctx.beginPath();
            ctx.moveTo(
                Core.state.squareWorldX + CONFIG.BASE_SIZE/2, 
                Core.state.squareWorldY + CONFIG.BASE_SIZE/2
            );
            if (Core.state.waypoints.length > 0) {
                ctx.lineTo(Core.state.waypoints[0].x, Core.state.waypoints[0].y);
            } else {
                ctx.lineTo(Core.state.targetWorldX, Core.state.targetWorldY);
            }
            ctx.stroke();
            ctx.restore();
        }
    },
    
    drawImageShape(ctx, worldX, worldY, alpha = 1.0, scale = 1.0) {
        const size = CONFIG.BASE_SIZE * scale;
        const offset = (CONFIG.BASE_SIZE - size) / 2;
        const x = worldX + offset;
        const y = worldY + offset;
        const img = Images.getCurrentImage(Core.state);
        
        if (!img || !img.complete) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        if (Images.shouldFlipImage(Core.state)) {
            ctx.translate(x + size / 2, y);
            ctx.scale(-1, 1);
            ctx.drawImage(img, -size / 2, 0, size, size);
        } else if (Images.shouldFlipBottomHalf(Core.state)) {
            ctx.drawImage(img, 0, 0, img.width, img.height / 2, x, y, size, size / 2);
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y + size / 2, size, size / 2);
            ctx.clip();
            ctx.translate(x + size / 2, y + size / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(img, 0, img.height / 2, img.width, img.height / 2, -size / 2, 0, size, size / 2);
            ctx.restore();
        } else {
            ctx.drawImage(img, x, y, size, size);
        }
        ctx.restore();
    },
    
    drawToolbar(ctx) {
        Toolbar.updateSquares();
        
        const totalWidth = 4 * (CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING) - CONFIG.TOOLBAR_PADDING;
        const startX = (WindowManager.canvas.width - totalWidth) / 2;
        const startY = WindowManager.canvas.height - CONFIG.TOOLBAR_SQUARE_SIZE - CONFIG.TOOLBAR_Y_OFFSET;
        
        // پس‌زمینه نوار ابزار
        ctx.save();
        ctx.fillStyle = 'rgba(10, 10, 25, 0.8)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        const barX = startX - CONFIG.TOOLBAR_PADDING;
        const barY = startY - CONFIG.TOOLBAR_PADDING;
        const barW = totalWidth + CONFIG.TOOLBAR_PADDING * 2;
        const barH = CONFIG.TOOLBAR_SQUARE_SIZE + CONFIG.TOOLBAR_PADDING * 2;
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, barH, 10);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // رسم مربع‌ها
        for (let i = 0; i < Toolbar.squares.length; i++) {
            const sq = Toolbar.squares[i];
            
            ctx.save();
            
            if (Core.state.selectedTool === i) {
                ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 3;
                ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
                ctx.shadowBlur = 8;
            } else {
                ctx.fillStyle = 'rgba(30, 30, 50, 0.6)';
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                ctx.lineWidth = 1.5;
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
            }
            
            ctx.beginPath();
            ctx.roundRect(sq.x, sq.y, sq.size, sq.size, 6);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // تصویر چوب در مربع اول
            if (i === 0 && Images.choobLoaded && Images.choobImage.complete) {
                const imgPadding = 6;
                ctx.save();
                ctx.drawImage(
                    Images.choobImage, 
                    sq.x + imgPadding, 
                    sq.y + imgPadding, 
                    sq.size - imgPadding * 2, 
                    sq.size - imgPadding * 2
                );
                ctx.restore();
            }
        }
    }
};
