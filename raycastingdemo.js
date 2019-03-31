var c = document.querySelector("canvas");
        
c.width = 450;
c.height = 225;

var ctx = c.getContext("2d");

const halfHeight = c.height / 2;

var vals = document.getElementById("vals");

var Player = class {
    get x() { return this.x; }
    set x(x) { this.x = x; }
    
    get y() { return this.y; }
    set y(y) { this.y = y; }

    get r() { return this.r; }
    set r(r) { this.r = r; }

    static takeStep() {
        var rads = this.r * Math.PI / 180;
        var disX = Math.sin(rads) / 4;
        var disY = Math.cos(rads) / 4;
        this.x += disX;
        this.y += disY;
    }

    static rotate(degrees) {
        this.r += degrees;
        this.r = this.r % 360;
        while (this.r < 0) { this.r += 360; }
    }
}
Player.x = 2;
Player.y = 2 ;
Player.r = 0;

function absFloor(n, floorTowards) { // floors n twoards the given value
    var upperLim = Math.floor(floorTowards + 1);
    var lowerLim = Math.floor(floorTowards);
    if (n > lowerLim && n < upperLim) return floorTowards;
    if (floorTowards < n) return Math.floor(n);
    return -Math.floor(-n); 
}

var Ray = class {
    get d() { return this.d; }
    get r() { return this.r; }
    get x() { return this.x; }
    get y() { return this.y; }
    get trueX() { return this.trueX; }
    get trueY() { return this.trueY; }

    static updateTrueCoords() {
        this.trueX = this.x + Player.x;
        this.trueY = this.y + Player.y;
    }

    static setCoords(distance, rotation) {
        this.d = distance
        this.r = rotation
        this.rr = rotation * Math.PI / 180;
        if (this.r % 180 == 0) this.x = 0;
        else this.x = Math.sin(this.rr) * distance;
        if (this.r == 90 || this.r == 270) this.y = 0;
        else this.y = Math.cos(this.rr) * distance;
        this.updateTrueCoords();
    }

    static floorX() {
        this.trueX = absFloor(this.trueX, Player.x);
        this.x = this.trueX - Player.x;
        if (this.r % 180 == 0) {}
        else this.y = this.x / Math.tan(this.rr);
        this.d = Math.sqrt((this.x ** 2) + (this.y ** 2));
        this.updateTrueCoords();
    }

    static floorY() {
        this.trueY = absFloor(this.trueY, Player.y);
        this.y = this.trueY - Player.y;
        this.x = this.y * Math.tan(this.rr);
        this.d = Math.sqrt((this.x ** 2) + (this.y ** 2));
        this.updateTrueCoords();
    }
}

var Field = class {
    static boxAt(x, y) {
        var square = Math.floor(Math.sqrt(this.map.length));
        var switchSide = "n";
        if (Math.abs(x - Math.round(x)) < 10 ** -5) x = Math.round(x);
        if (Math.abs(y - Math.round(y)) < 10 ** -5) y = Math.round(y);
        if (Math.abs(x - Math.floor(x)) < Math.abs(y - Math.floor(y))) switchSide = "x";
        if (Math.abs(x - Math.floor(x)) > Math.abs(y - Math.floor(y))) switchSide = "y";
        var floorX = Math.floor(x);
        var floorY = Math.floor(y);
        if (this.map[floorX + (floorY * square)] && floorX < square && floorY < square && floorX >= 0 && floorY >= 0) {
            return true;
        }
        switch (switchSide) {
            case "x":
            if (floorX < 0) floorX += 2;
                floorX--;
            break;
            case "y":
            if (floorY < 0) floorY += 2;
                floorY--;
            break;
        }
        if (this.map[floorX + (floorY * square)] && floorX <= square && floorY <= square && floorX >= 0 && floorY >= 0) {
            return true;
        }
        return false;
    }
}
Field.map = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,    
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,
    1,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
]

function toHex(n) { // Converts an integer into a hex string
    if (n > 255) n = 255;
    if (n < 0) n = 0;
    var upperNible = n >> 4;
    lowerNible = n & 15;
    var map = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var hexString = map[upperNible] + map[lowerNible];
    return hexString;
}

function drawWall(distance, degrees) { // Renders a vertical line, used for displaying walls
    ctx.beginPath();
    if (distance < 1) distance = 1;
    var distanceInHex = toHex(distance * 4);
    ctx.strokeStyle = "#" + distanceInHex + distanceInHex + distanceInHex;
    ctx.moveTo(c.width * degrees / 90, halfHeight + halfHeight / distance);
    ctx.lineTo(c.width * degrees / 90, halfHeight - halfHeight / distance);
    ctx.stroke();
}

function fixRotation(rotation) {
    rotation = rotation % 360;
    while (rotation < 0) rotation += 360;
    return rotation;
}

function unDistort(distance, rotationRelativeToPlayersCenter) {
    return Math.abs(distance * Math.cos(rotationRelativeToPlayersCenter * Math.PI / 180));
}

function renderWalls() {
    for (var i = 0; i <= 90; i += 0.1) {
        i = Math.round(i * 10) / 10;
        var rotationRelativeToPlayersCenter = fixRotation(i - 45);
        var rotationRelativeToZero = fixRotation(rotationRelativeToPlayersCenter + Player.r);
        var rayHit = false;
        for (var distanceFromPlayer = 0; !rayHit && distanceFromPlayer < 100; distanceFromPlayer++) {
            Ray.setCoords(distanceFromPlayer, rotationRelativeToZero);
            Ray.floorX();
            if (Field.boxAt(Ray.trueX, Ray.trueY)) {
                drawWall(unDistort(Ray.d, rotationRelativeToPlayersCenter), i); 
                rayHit = true;
            }
            Ray.setCoords(distanceFromPlayer, rotationRelativeToZero);
            Ray.floorY();
            if (Field.boxAt(Ray.trueX, Ray.trueY)) {
                drawWall(unDistort(Ray.d, rotationRelativeToPlayersCenter), i);
                rayHit = true;
            }
        }
    }
}

var keys = {};
onkeydown = onkeyup = function(e) { // Keypress handler
    e = e || window.event;
    keys[e.key] = (e.type == 'keydown');
    if (keys["k"]) Player.rotate(45);
}

function loop() {
    requestAnimationFrame(loop);
    if (keys["w"]) {
        Player.takeStep();
    }
    if (keys["a"]) {
        Player.rotate(-3)
    }
    if (keys["s"]) {
        Player.rotate(180);
        Player.takeStep();
        Player.rotate(-180);
    }
    if (keys["d"]) {
        Player.rotate(3);
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#777777";
    ctx.fillRect(0, halfHeight, c.width, halfHeight);
    renderWalls();  
    vals.innerHTML = "X:&nbsp;" + Math.round(Player.x) + "&nbsp;Y:&nbsp;" + Math.round(Player.y) + "&nbsp;Rotation:&nbsp;" + Player.r + "&deg;";
}
loop();
