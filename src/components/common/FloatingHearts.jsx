import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const left = Math.random() * 100;
      const size = Math.random() * 20 + 10;
      const duration = Math.random() * 3 + 4;
      const delay = Math.random() * 2;

      setHearts((prev) => [...prev, { id, left, size, duration, delay }]);

      setTimeout(
        () => {
          setHearts((prev) => prev.filter((h) => h.id !== id));
        },
        (duration + delay) * 1000,
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: `${heart.left}%`,
            animation: `floatUp ${heart.duration}s ${heart.delay}s linear forwards`,
          }}
        >
          <Heart
            className="text-pink-300/30 fill-pink-300/30"
            style={{ width: heart.size, height: heart.size }}
          />
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
