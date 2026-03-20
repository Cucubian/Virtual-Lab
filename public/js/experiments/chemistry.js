function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const status = document.getElementById('experiment-status');
    const resetBtn = document.getElementById('reset-btn');

    class Beaker extends LabObject {
        constructor(x, y, name, liquidColor, isTarget = false) {
            super(x, y, 80, 100, '#cbd5e1');
            this.name = name;
            this.liquidColor = liquidColor;
            this.originalLiquidColor = liquidColor;
            this.isTarget = isTarget;
            this.draggable = !isTarget;
            this.isMixed = false;
        }

        draw(ctx) {
            // Draw Liquid
            ctx.fillStyle = this.liquidColor;
            ctx.fillRect(this.x + 5, this.y + 20, this.width - 10, this.height - 25);

            // Draw Beaker Outline
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x + this.width, this.y);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, this.x + this.width/2, this.y + this.height + 25);
            ctx.textAlign = 'left';
        }
    }

    const acid = new Beaker(150, 250, 'Axit HCl', 'rgba(239, 68, 68, 0.4)');
    const base = new Beaker(500, 250, 'Bazơ NaOH + Phenolphthalein', 'rgba(255, 255, 255, 0.2)', true);

    engine.addObject(base);
    engine.addObject(acid);

    const originalUpdate = engine.update.bind(engine);
    engine.update = function(deltaTime) {
        if (engine.isDragging && engine.draggedObject === acid) {
            if (engine.checkCollision(acid, base)) {
                base.isMixed = true;
                base.liquidColor = 'rgba(236, 72, 153, 0.6)'; // Pink
                status.textContent = "Phản ứng: Đã xảy ra sự trung hòa!";
            }
        }
    };

    resetBtn.onclick = () => {
        acid.x = 150;
        acid.y = 250;
        base.liquidColor = base.originalLiquidColor;
        base.isMixed = false;
        status.textContent = "Sẵn sàng";
    };

    engine.start();
    status.textContent = "Kéo cốc Axit vào cốc Bazơ";
}
