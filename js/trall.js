// مدیریت دنباله حرکت
const Trail = {
    positions: [],
    
    init() {
        this.positions = [];
        for (let i = 0; i < CONFIG.TRAIL_LENGTH; i++) {
            this.positions.push({ x: Core.state.squareWorldX, y: Core.state.squareWorldY });
        }
    },
    
    addPosition(x, y) {
        this.positions.push({ x, y });
        while (this.positions.length > CONFIG.TRAIL_LENGTH) {
            this.positions.shift();
        }
    }
};
