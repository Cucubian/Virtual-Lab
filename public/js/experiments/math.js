function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const params = document.getElementById('params-container');
    const status = document.getElementById('experiment-status');

    let sideA = 100;
    let sideB = 100;
    const originX = 300;
    const originY = 400;

    // Add Sliders
    params.innerHTML = `
        <div class="param-row">
            <label>Cạnh A: <span id="valA">${sideA}</span></label>
            <input type="range" id="sliderA" min="50" max="250" value="${sideA}">
        </div>
        <div class="param-row">
            <label>Cạnh B: <span id="valB">${sideB}</span></label>
            <input type="range" id="sliderB" min="50" max="250" value="${sideB}">
        </div>
    `;

    const sliderA = document.getElementById('sliderA');
    const sliderB = document.getElementById('sliderB');
    const valA = document.getElementById('valA');
    const valB = document.getElementById('valB');

    const updateValues = () => {
        sideA = parseInt(sliderA.value);
        sideB = parseInt(sliderB.value);
        valA.textContent = sideA;
        valB.textContent = sideB;
    };

    sliderA.oninput = updateValues;
    sliderB.oninput = updateValues;

    // Custom draw for Pythagoras
    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;

        const ax = originX;
        const ay = originY - sideA;
        const bx = originX + sideB;
        const by = originY;

        // Draw Triangle
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Square A
        ctx.fillStyle = 'rgba(239, 64, 64, 0.3)';
        ctx.strokeRect(originX - sideA, ay, sideA, sideA);
        ctx.fillRect(originX - sideA, ay, sideA, sideA);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`a² = ${sideA * sideA}`, originX - sideA/2 - 20, ay + sideA/2);

        // Draw Square B
        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.strokeRect(originX, originY, sideB, sideB);
        ctx.fillRect(originX, originY, sideB, sideB);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`b² = ${sideB * sideB}`, originX + sideB/2 - 20, originY + sideB/2);

        // Draw Hypotenuse Square C
        const hyp = Math.sqrt(sideA*sideA + sideB*sideB);
        const angle = Math.atan2(sideA, sideB);
        
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(-angle);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.strokeStyle = '#06b6d4';
        ctx.strokeRect(0, -hyp, -hyp, -hyp);
        ctx.fillRect(0, -hyp, -hyp, -hyp);
        ctx.fillStyle = '#06b6d4';
        ctx.rotate(angle); // Level text
        // ctx.fillText(`c² = ${Math.round(hyp * hyp)}`, -hyp/2 - 20, -hyp/2);
        ctx.restore();

        // Text Info
        ctx.fillStyle = '#1e293b';
        ctx.font = '16px Inter';
        ctx.fillText(`Cạnh huyền (c) = ${hyp.toFixed(2)}`, 50, 50);
        ctx.fillText(`${sideA}² + ${sideB}² = ${Math.round(hyp*hyp)}`, 50, 80);
    };

    engine.start();
    status.textContent = "Đang tương tác";
}
