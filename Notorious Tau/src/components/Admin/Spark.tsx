import { useRef, useEffect } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

function Spark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d")! as CanvasRenderingContext2D;
    if (!ctx) {
      return;
    }

    const width = canvas.width;
    const height = canvas.height;

    const sparks: Spark[] = [];
    const gravity = 0.12;

    for (let i = 0; i < 32; i++) {
      const angleDeg = 40 + Math.random() * 100;
      const angle = (angleDeg * Math.PI) / 180;

      const speed = 8 + Math.random() * 8;

      sparks.push({
        x: width / 2,
        y: height,
        vx: Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        life: 1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      sparks.forEach((spark, index) => {
        spark.vy += gravity;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.life -= 0.01;

        ctx.globalAlpha = spark.life;
        ctx.fillStyle = "orange";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "gold";

        ctx.beginPath();
        ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2);
        ctx.fill();

        if (spark.life <= 0) {
          sparks.splice(index, 1);
        }
      });

      ctx.globalAlpha = 1;

      if (sparks.length > 1) {
        requestAnimationFrame(animate);
      }
    }

    setTimeout(() => {
      animate();
    }, 500);
  }, []);

  return (
    <div className="spark-container z-1 w-100 h-100">
      <canvas
        ref={canvasRef}
        className="spark w-100 vh-100 z-5"
        width={600}
        height={300}
      />
    </div>
  );
}

export default Spark;
