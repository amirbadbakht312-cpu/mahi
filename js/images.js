// مدیریت تصاویر
const Images = {
    cache: {},
    lakeImage: null,
    lakeImageLoaded: false,
    backgroundImage: null,
    backgroundLoaded: false,
    choobImage: null,
    choobLoaded: false,
    
    IMAGES: {
        triangle: CONFIG.IMAGE_BASE_PATH + 'pangghadamposht1.jpeg',
        triangleFlash1: CONFIG.IMAGE_BASE_PATH + 'pangghadamposht2.jpeg',
        triangleFlash2: CONFIG.IMAGE_BASE_PATH + 'pangghadamposht2.jpeg',
        circle: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast1.jpeg',
        circleFlash1: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast2.jpeg',
        circleFlash2: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast3.jpeg',
        trapezoid: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast1.jpeg',
        trapezoidFlash1: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast2.jpeg',
        trapezoidFlash2: CONFIG.IMAGE_BASE_PATH + 'pangghadamrast3.jpeg',
        square: CONFIG.IMAGE_BASE_PATH + 'pangghadamjolo1.jpeg',
        squareFlash1: CONFIG.IMAGE_BASE_PATH + 'pangghadamjolo2.jpeg',
        squareFlash2: CONFIG.IMAGE_BASE_PATH + 'pangghadamjolo2.jpeg',
    },
    
    loadImage(src) {
        if (!this.cache[src]) {
            const img = new Image();
            img.src = src;
            this.cache[src] = img;
        }
        return this.cache[src];
    },
    
    loadInitialImages() {
        this.lakeImage = new Image();
        this.lakeImage.onload = () => {
            this.lakeImageLoaded = true;
            const maxDim = Math.max(this.lakeImage.width, this.lakeImage.height);
            Lake.radius = maxDim / 3;
        };
        this.lakeImage.src = CONFIG.IMAGE_BASE_PATH + 'daryache.jpeg';
        
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            this.backgroundLoaded = true;
        };
        this.backgroundImage.src = CONFIG.IMAGE_BASE_PATH + 'paszamine.jpeg';
        
        this.choobImage = new Image();
        this.choobImage.onload = () => {
            this.choobLoaded = true;
        };
        this.choobImage.src = CONFIG.IMAGE_BASE_PATH + 'choob_jolo.jpeg';
    },
    
    getCurrentImage(state) {
        if (state.hasTarget && state.currentFlashIndex === 1) return this.getFlash1Image(state);
        else if (state.hasTarget && state.currentFlashIndex === 2) return this.getFlash2Image(state);
        return this.getBaseImage(state);
    },
    
    getBaseImage(state) {
        switch (state.currentShape) {
            case 'triangle': return this.loadImage(this.IMAGES.triangle);
            case 'circle': return this.loadImage(this.IMAGES.circle);
            case 'trapezoid': return this.loadImage(this.IMAGES.trapezoid);
            default: return this.loadImage(this.IMAGES.square);
        }
    },
    
    getFlash1Image(state) {
        switch (state.currentShape) {
            case 'triangle': return this.loadImage(this.IMAGES.triangleFlash1);
            case 'circle': return this.loadImage(this.IMAGES.circleFlash1);
            case 'trapezoid': return this.loadImage(this.IMAGES.trapezoidFlash1);
            default: return this.loadImage(this.IMAGES.squareFlash1);
        }
    },
    
    getFlash2Image(state) {
        switch (state.currentShape) {
            case 'triangle': return this.loadImage(this.IMAGES.triangleFlash2);
            case 'circle': return this.loadImage(this.IMAGES.circleFlash2);
            case 'trapezoid': return this.loadImage(this.IMAGES.trapezoidFlash2);
            default: return this.loadImage(this.IMAGES.squareFlash2);
        }
    },
    
    shouldFlipImage(state) {
        if (state.currentShape === 'triangle' && state.hasTarget && state.currentFlashIndex === 2) return true;
        if (state.currentShape === 'circle') return true;
        return false;
    },
    
    shouldFlipBottomHalf(state) {
        return state.currentShape === 'square' && state.hasTarget && state.currentFlashIndex === 2;
    }
};
