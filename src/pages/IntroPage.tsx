import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const navigate = useNavigate();

  //3.5초 유지
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Main");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-[Dongle] px-8">
      <div className="flex flex-row items-center justify-center max-w-5xl w-full gap-10">
        {/* 왼쪽: GIF 이미지 */}
        <motion.img
          src="/intro-food.gif"
          alt="인트로 애니메이션"
          className="w-56 h-56"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        />

        {/* 오른쪽: 슬로건 */}
        <div className="flex flex-col">
          {/* 첫 줄: "마곡의 모든 맛집," */}
          <motion.p
            className="text-4xl text-gray-700 font-['Gowun_Dodum']"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            마곡의 모든 맛집,
          </motion.p>

          {/* 둘째 줄: "요기얌에서" (요기얌만 딜레이 + 강조) */}
          <div className="flex flex-row items-baseline gap-2 mt-2">
            <motion.span
              className="text-5xl text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              {/* 앞 문장 */}
              <span> </span>
            </motion.span>

            <motion.span
              className="text-5xl text-orange-500 font-[jua]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
            >
              요기얌
            </motion.span>

            <motion.span
              className="text-4xl text-gray-700 font-['Gowun_Dodum']"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              에서
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
