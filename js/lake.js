// مدیریت دریاچه
const Lake = {
    centerX: 1200,
    centerY: 900,
    radius: 80,
    
    init() {
        this.centerX = WindowManager.worldWidth / 2;
        this.centerY = WindowManager.worldHeight / 2;
    },
    
    updatePosition() {
        this.centerX = WindowManager.worldWidth / 2;
        this.centerY = WindowManager.worldHeight / 2;
    }
};
