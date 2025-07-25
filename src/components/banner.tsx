import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const banners = [
  {
    text: "지금 회원가입하면 5천원 쿠폰 드려요!",
    image: "/banner1.png",
    bgColor: "bg-green-200",
  },
  {
    text: "첫 리뷰 작성 시 포인트 지급!",
    image: "/banner2.png",
    bgColor: "bg-blue-200",
  },
  {
    text: "이벤트 참여하고 식사권 받아가세요!",
    image: "/banner3.png",
    bgColor: "bg-yellow-200",
  },
];

export default function SlidingBanner() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative w-full h-40 overflow-hidden mb-2 ">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex justify-between items-center px-6  transition-colors duration-500 ${banners[index].bgColor}`}
          initial={{ x: direction * 100 + "%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -direction * 100 + "%", opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 왼쪽 이미지 */}
          <div className="h-full w-1/3 flex items-center justify-center">
            <img
              src={banners[index].image}
              alt="Banner"
              className="h-full w-full object-cover"
            />
          </div>

          {/* 오른쪽 텍스트 */}
          <div className="flex-1 ml-6 flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-black font-jua font-bold text-[20px]"
            >
              {banners[index].text}
            </motion.div>

            {/* 닫기 버튼 */}
            <button
              onClick={() => setVisible(false)}
              className="text-black hover:text-gray-600 ml-4"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
