// 浪一浪轉盤功能

class WheelOfSurf {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.resultText = document.getElementById('resultText');
        this.resultInfo = document.getElementById('resultInfo');

        // 東石景點資料
        this.surfSpots = [
            { name: '東石漁人碼頭', region: '東石鄉', difficulty: '★★★★★', color: '#0099cc' },
            { name: '鰲鼓濕地', region: '東石鄉', difficulty: '★★★★★', color: '#4ECDC4' },
            { name: '東石蚵棚', region: '東石鄉', difficulty: '★★★★☆', color: '#45B7D1' },
            { name: '先天宮', region: '東石鄉', difficulty: '★★★☆☆', color: '#FFA07A' },
            { name: '海產小吃街', region: '東石鄉', difficulty: '★★★★★', color: '#98D8C8' },
            { name: '東石港區', region: '東石鄉', difficulty: '★★★★☆', color: '#F7DC6F' },
            { name: '副瀧宮', region: '東石鄉', difficulty: '★★★☆☆', color: '#BB8FCE' },
            { name: '東石公園', region: '東石鄉', difficulty: '★★★★☆', color: '#85C1E2' }
        ];

        this.currentRotation = 0;
        this.isSpinning = false;
        
        this.init();
    }

    init() {
        this.drawWheel();
        this.spinButton.addEventListener('click', () => this.spin());
    }

    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const numSegments = this.surfSpots.length;
        const anglePerSegment = (2 * Math.PI) / numSegments;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 繪製每個區塊
        this.surfSpots.forEach((spot, index) => {
            const startAngle = index * anglePerSegment + this.currentRotation;
            const endAngle = startAngle + anglePerSegment;

            // 繪製扇形
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = spot.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // 繪製文字
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + anglePerSegment / 2);
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 18px "Noto Sans TC", sans-serif';
            this.ctx.fillText(spot.name, radius * 0.65, 5);
            this.ctx.restore();
        });

        // 繪製中心圓
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00a8cc';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        this.ctx.fillStyle = '#00a8cc';
        this.ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPIN', centerX, centerY + 5);
    }

    spin() {
        if (this.isSpinning) return;

        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.resultDisplay.classList.remove('show');

        // 隨機選擇一個結果
        const randomIndex = Math.floor(Math.random() * this.surfSpots.length);
        const anglePerSegment = (2 * Math.PI) / this.surfSpots.length;
        
        // 計算目標角度（加上多圈旋轉）
        const targetAngle = (randomIndex * anglePerSegment) + (Math.PI * 2 * 5) + (Math.random() * anglePerSegment);
        const startRotation = this.currentRotation;
        const totalRotation = targetAngle;

        const duration = 4000; // 4 秒
        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用 easeOut 效果
            const easeOut = 1 - Math.pow(1 - progress, 3);
            this.currentRotation = startRotation + (totalRotation * easeOut);

            this.drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.currentRotation = this.currentRotation % (Math.PI * 2);
                this.showResult(randomIndex);
                this.isSpinning = false;
                this.spinButton.disabled = false;
            }
        };

        animate();
    }

    showResult(index) {
        const spot = this.surfSpots[index];
        
        this.resultText.textContent = spot.name;
        this.resultInfo.innerHTML = `
            <p><strong>地區：</strong>${spot.region}</p>
            <p><strong>難度：</strong>${spot.difficulty}</p>
            <p><strong>推薦程度：</strong>⭐⭐⭐⭐⭐</p>
            <p style="margin-top: 15px; color: #666;">
                ${this.getSpotDescription(spot.name)}
            </p>
        `;

        setTimeout(() => {
            this.resultDisplay.classList.add('show');
        }, 500);

        // 顯示通知
        if (window.utils) {
            window.utils.showNotification(`今天就去 ${spot.name} 探索吧！`, 'success');
        }
    }

    getSpotDescription(spotName) {
        const descriptions = {
            '東石漁人碼頭': '最美的濱海風光與日落美景，是東石必訪景點。',
            '鰲鼓濕地': '候鳥天堂，生態豐富，適合親子同遊。',
            '東石蚵棚': '體驗蚵農文化的最佳地點，可現擈現烤新鮮蚵。',
            '先天宮': '東石信仰中心，建築精美，文化氣息濃厚。',
            '海產小吃街': '集結各式鮮美海產，讓你一次品嚐夠。',
            '東石港區': '體驗漁村風情，觀賞漁船進出港的活力景象。',
            '副瀧宮': '東石重要建築，保存著豐富的地方文化。',
            '東石公園': '休閒放鬆的好去處，適合家庭遊憩。'
        };

        return descriptions[spotName] || '絕佳的東石景點，值得一訪！';
    }
}

// 初始化轉盤
document.addEventListener('DOMContentLoaded', function() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (wheelCanvas) {
        new WheelOfSurf('wheelCanvas');
    }
});
