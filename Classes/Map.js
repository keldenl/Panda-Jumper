exports.Map = class Map {
    constructor(Platforms = []) {
        this.platforms = Platforms;
    }
    
    ToString() {
        let platformString = '';
        this.platforms.forEach(platform => {
            platformString += platform.ToString() + 'l';
        });
        return platformString;
    }
}

exports.PlatformBuilder = class PlatformBuilder {
    constructor(PlatformData = []) {
        this.platformData = PlatformData;
    }

    GetPlatforms() {
        if (this.platformData.length % 2 != 0) return
        const platformsArray = [];
        for (let i = 0; i < this.platformData.length; i+=2) {
            platformsArray.push(new Platform(this.platformData[i], this.platformData[i+1]));
        }
        return platformsArray;
    }
}

class Platform {
    constructor(X = 0, Y = 0, W = 1) {
        this.x = X;
        this.y = Y;
        this.w = W;
    }

    ToString() {
        return `${this.x}k${this.y}`;
    }
}