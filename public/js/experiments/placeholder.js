function initExperiment(canvasId) {
    const engine = new LabEngine(canvasId);
    const status = document.getElementById('experiment-status');
    
    engine.draw = function() {
        this.clear();
        const ctx = this.ctx;
        ctx.fillStyle = '#64748b';
        ctx.font = '24px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText("Mô phỏng đang được phát triển...", this.width/2, this.height/2);
        ctx.font = '16px Inter';
        ctx.fillText("Vui lòng quay lại sau để trải nghiệm nội dung này.", this.width/2, this.height/2 + 40);
    };

    engine.start();
    status.textContent = "Đang cập nhật";
}
