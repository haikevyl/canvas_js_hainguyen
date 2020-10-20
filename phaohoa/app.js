const WIDTH = screen.width;
const HEIGHT = screen.height;
const PARTICLE_SIZE = 5;
const PARTICLE_CHANGE_SIZE = 0.1;
const PARTICLE_CHANGE_SPEED = 0.3;
const PARTICLE_MIN_SPEED = 13;
const NUMBER_PARTICLE_PER_BULLET = 25;
const FALL_SPEED = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;


class particle {
    constructor(bullet, deg){
        this.bullet = bullet;
        this.deg = deg;
        this.ctx = bullet.ctx;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];
    }

    update() {
        this.speed -= PARTICLE_CHANGE_SPEED;

        if(this.speed <= 0){
            this.speed = 0;
        };

        // cap nhat toc do roi
        this.fallSpeed += FALL_SPEED;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;


        this.x += this.speedX;
        this.y += this.speedY;

        if(this.size > PARTICLE_CHANGE_SIZE){
            this.size -= PARTICLE_CHANGE_SIZE;
        };

        if(this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1,
                size: this.size,
            });
        };

        this.dots.forEach( dot => {
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
            dot.size += DOT_CHANGE_SIZE_SPEED;
        });

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        });

        if(this.dots.length == 0)
        {
            this.remove();
        }
    };

    remove(){
        this.bullet.particle.splice(this.bullet.particle.indexOf(this), 1);
    };

    draw(){
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba(' + this.color + ', ' + dot.alpha +')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        

    }
}

class bullet {
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;

        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2;
        this.color = Math.floor(Math.random() * 155) + ',' +
                        Math.floor(Math.random() * 155) + ',' +
                        Math.floor(Math.random() * 155);

        this.particles = [];
        let particleDeg = Math.PI * 2 / NUMBER_PARTICLE_PER_BULLET;
        for (let i = 0; i < NUMBER_PARTICLE_PER_BULLET; i++)
        {
            let newParticle = new particle(this, particleDeg * i);
            this.particles.push(newParticle);
        }
        
    }

    update(){
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach( particle => particle.update() );
    };

    remove(){
        this.fireworks.bullet.splice(this.fireworks.bullet.indexOf(this), 1);
    }

    draw(){
        this.particles.forEach( particle => particle.draw() );
    }
}


class fireworks {
    constructor(){
        this.init();
        this.loop();

        this.bullets = [];

        setInterval(() => {
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 500);
    }

    init(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;

        document.body.appendChild(this.canvas);
    }

    loop(){
        if(this.bullets){
            this.bullets.forEach( bullet => bullet.update() );
        };
        
        this.draw();
        setTimeout(() => {
            this.loop();
        }, 20);
    };

    clearScreen(){
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    draw(){
        this.clearScreen();
        if(this.bullets){
            this.bullets.forEach( bullet => bullet.draw() );
        };
    }
}



var p = new fireworks();