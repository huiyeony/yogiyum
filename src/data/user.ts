import type { Comment } from '../entities/comment';

export const user = {
  nickname: '전수아',
  email: 'suajeon@email.com',
  password: '12345678',
  signupDate: new Date('2023-09-01'),
};

export const dummyComments: Comment[] = [
  {
    restaurantID: 101,
    userId: '수아',
    createdAt: new Date('2024-06-01'),
    comment: '너무 맛있었어요!',
    rating: 4,
  },
  {
    restaurantID: 102,
    userId: '민준',
    createdAt: new Date('2024-06-15'),
    comment: '서비스가 정말 친절했어요.',
    rating: 5.0,
  },
  {
    restaurantID: 103,
    userId: '지현',
    createdAt: new Date('2024-06-20'),
    comment: '맛은 평범했지만 분위기가 좋았어요.',
    rating: 3,
  },
  {
    restaurantID: 104,
    userId: '영수',
    createdAt: new Date('2024-07-01'),
    comment: '너무 짰어요... 다시는 안 가요.',
    rating: 1,
  },
  {
    restaurantID: 105,
    userId: '하늘',
    createdAt: new Date('2024-07-10'),
    comment: '양이 많고 가성비 최고!',
    rating: 4,
  },
  {
    restaurantID: 106,
    userId: '다은',
    createdAt: new Date('2024-07-11'),
    comment: '인테리어가 예뻐서 사진 많이 찍었어요.',
    rating: 4,
  },
  {
    restaurantID: 107,
    userId: '준호',
    createdAt: new Date('2024-07-12'),
    comment: '음식 나오는 시간이 너무 오래 걸렸어요.',
    rating: 2,
  },
  {
    restaurantID: 108,
    userId: '서연',
    createdAt: new Date('2024-07-13'),
    comment: '고기가 부드럽고 맛있었어요!',
    rating: 4,
  },
  {
    restaurantID: 109,
    userId: '태형',
    createdAt: new Date('2024-07-14'),
    comment: '깔끔하고 조용해서 좋았어요.',
    rating: 4,
  },
  {
    restaurantID: 110,
    userId: '유진',
    createdAt: new Date('2024-07-15'),
    comment: '웨이팅이 길지만 그만한 가치가 있어요.',
    rating: 5,
  },
  {
    restaurantID: 201,
    userId: '전수아',
    createdAt: new Date('2024-07-16'),
    comment: '분위기 너무 좋고 조명이 예뻐요!',
    rating: 4,
  },
  {
    restaurantID: 202,
    userId: '전수아',
    createdAt: new Date('2024-07-17'),
    comment: '디저트가 정말 맛있었어요 🍰',
    rating: 4,
  },
  {
    restaurantID: 203,
    userId: '전수아',
    createdAt: new Date('2024-07-18'),
    comment: '가격 대비 퀄리티가 살짝 아쉬웠어요.',
    rating: 5,
  },
];
