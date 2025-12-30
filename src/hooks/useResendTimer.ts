import { useState, useEffect } from 'react';

export const useResendTimer = (cooldownSeconds = 60) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // โหลดเวลาเป้าหมายจาก localStorage
    const targetTime = localStorage.getItem("resend_target_time");
    if (targetTime) {
      const remaining = Math.ceil((parseInt(targetTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        localStorage.removeItem("resend_target_time");
      }
    }
  }, []);

  useEffect(() => {
    // Logic นับถอยหลัง
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("resend_target_time");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const startCooldown = () => {
    const target = Date.now() + cooldownSeconds * 1000;
    localStorage.setItem("resend_target_time", target.toString());
    setTimeLeft(cooldownSeconds);
  };

  return { timeLeft, startCooldown, isCooldown: timeLeft > 0 };
};