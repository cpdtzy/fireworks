const Fireworks = {
    canvas: null,
    context: null,
    createFireworks(sx, sy) {
        const angle = Math.floor(Math.random() * 360);
        const speed = Math.random() * 5;

        return {
            angle,
            radians: angle * (Math.PI / 180),
            x: sx,
            y: sy,
            speed,
            radius: speed,
            size: Math.ceil(Math.random() * 4),
            hue: Math.floor(Math.random() * 100) + 150,
            brightness: Math.floor(Math.random() * 31) + 50,
            alpha: (Math.floor(Math.random() * 61) + 40) / 100,
        };
    },
    drawFireWorks(particles) {
        const context = this.context;

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const vx = Math.cos(p.radians) * p.radius; // 小球水平下落时的距离
            const vy = Math.sin(p.radians) * p.radius + 0.4; // 小球落下时的距离

            p.x += vx;
            p.y += vy;
            p.radius *= 1 - p.speed / 100;
            p.alpha -= 0.01; // 透明度
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            context.beginPath();
            context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            context.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
            context.fill();
            context.closePath();
        }

        return particles;
    },
    init() {
        const canvas = document.querySelector('canvas');
        const context = canvas.getContext('2d');

        this.canvas = canvas;
        this.context = context;
        this.resize();
        window.addEventListener("resize", () => this.resize());
    },
    fillCanvasBackground(options = {}, context) {
        context = context ?? this.context;
        const {width = this.canvas.width, height = this.canvas.height, alpha = 1} = options;

        context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        context.fillRect(0, 0, width, height);
    },
    resize() {
        const {clientWidth, clientHeight} = document.body;
        const [width, height] = [clientWidth, clientHeight];

        this.canvas.width = clientWidth;
        this.canvas.height = clientHeight;
        this.fillCanvasBackground({width: clientWidth, height: clientHeight});
        const fireworks = [];
        const [sx, sy] = [width * Math.random(), height * Math.random()]
        for (let i = 0; i < 100; i++) {
            fireworks.push(this.createFireworks(sx, sy));
        }

        this.tick(fireworks);
    },
    tick(fireworks) {
        const context = this.context;

        context.globalCompositeOperation = 'hard-light';
        const curFireworks = this.drawFireWorks(fireworks);

        if (curFireworks.length) {
            requestAnimationFrame(() => this.tick(curFireworks));
        }
    },
};

Fireworks.init();