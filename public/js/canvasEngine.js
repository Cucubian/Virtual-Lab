class LabEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.objects = [];
        this.isDragging = false;
        this.draggedObject = null;
        this.animationId = null;
        this.lastTime = performance.now();

        // Matter.js support
        this.useMatter = false;
        this.matterEngine = null;
        this.matterRunner = null;

        this.initEvents();
    }

    enableMatter(gravity = 1) {
        if (!window.Matter) return;
        this.useMatter = true;
        const { Engine, Runner } = Matter;
        this.matterEngine = Engine.create();
        this.matterEngine.gravity.y = gravity;
        this.matterRunner = Runner.create();
        Runner.run(this.matterRunner, this.matterEngine);
    }

    initEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.canvas.dispatchEvent(mouseEvent);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                this.canvas.dispatchEvent(mouseEvent);
            }
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.canvas.dispatchEvent(new MouseEvent('mouseup', {}));
        }, false);
    }

    addObject(obj) {
        this.objects.push(obj);
        if (this.useMatter && obj.body) {
            Matter.Composite.add(this.matterEngine.world, obj.body);
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Grid
        this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
        this.ctx.lineWidth = 1;
        for(let i=0; i<this.width; i+=40) {
            this.ctx.beginPath(); this.ctx.moveTo(i, 0); this.ctx.lineTo(i, this.height); this.ctx.stroke();
        }
        for(let j=0; j<this.height; j+=40) {
            this.ctx.beginPath(); this.ctx.moveTo(0, j); this.ctx.lineTo(this.width, j); this.ctx.stroke();
        }
    }

    update(deltaTime) {
        this.objects.forEach(obj => {
            if (obj.update) obj.update(deltaTime, this.width, this.height);
        });
    }

    draw() {
        this.clear();
        this.objects.forEach(obj => obj.draw(this.ctx));
    }

    start() {
        const loop = (time) => {
            const deltaTime = (time - this.lastTime) / 1000;
            this.lastTime = time;
            this.update(Math.min(deltaTime, 0.1));
            this.draw();
            this.animationId = requestAnimationFrame(loop);
        };
        this.animationId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.matterRunner) Matter.Runner.stop(this.matterRunner);
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    handleMouseDown(e) {
        const pos = this.getMousePos(e);
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (obj.draggable && obj.isPointInside(pos.x, pos.y)) {
                this.isDragging = true;
                this.draggedObject = obj;
                obj.offsetX = pos.x - obj.x;
                obj.offsetY = pos.y - obj.y;
                if (this.useMatter && obj.body) {
                    obj.wasStatic = obj.body.isStatic;
                    Matter.Body.setStatic(obj.body, true);
                }
                break;
            }
        }
    }

    handleMouseMove(e) {
        if (this.isDragging && this.draggedObject) {
            const pos = this.getMousePos(e);
            this.draggedObject.x = pos.x - this.draggedObject.offsetX;
            this.draggedObject.y = pos.y - this.draggedObject.offsetY;
            if (this.useMatter && this.draggedObject.body) {
                Matter.Body.setPosition(this.draggedObject.body, { x: this.draggedObject.x, y: this.draggedObject.y });
            }
        }
    }

    handleMouseUp() {
        if (this.isDragging && this.draggedObject && this.useMatter && this.draggedObject.body) {
            if (this.draggedObject.wasStatic === false) {
                Matter.Body.setStatic(this.draggedObject.body, false);
            }
        }
        this.isDragging = false;
        this.draggedObject = null;
    }
}

class LabObject {
    constructor(x, y, w, h, color, type = 'rect') {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.type = type; // 'rect' or 'circle'
        this.draggable = false;
        this.body = null;
    }

    draw(ctx) {
        if (this.body && !this.body.isStatic) {
            this.x = this.body.position.x;
            this.y = this.body.position.y;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.body) ctx.rotate(this.body.angle);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;

        if (this.type === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        } else {
            // Draw Rect (compatible with all browsers)
            ctx.beginPath();
            const r = 4; // corner radius
            const w = this.width;
            const h = this.height;
            ctx.moveTo(-w/2 + r, -h/2);
            ctx.lineTo(w/2 - r, -h/2);
            ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
            ctx.lineTo(w/2, h/2 - r);
            ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
            ctx.lineTo(-w/2 + r, h/2);
            ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
            ctx.lineTo(-w/2, -h/2 + r);
            ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }

    isPointInside(px, py) {
        if (this.type === 'circle') {
            const dx = px - this.x;
            const dy = py - this.y;
            return Math.sqrt(dx*dx + dy*dy) < this.width / 2;
        }
        return px >= this.x - this.width/2 && px <= this.x + this.width/2 &&
               py >= this.y - this.height/2 && py <= this.y + this.height/2;
    }
}
