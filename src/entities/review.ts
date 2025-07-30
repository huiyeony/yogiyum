export interface Review {
  /// 리뷰 id
  id: number;

  /// 식당 ID
  restaurantID: number;

  /// 작성자 ID
  userId: string;

  /// 작성 시간
  createdAt: Date;

  /// 댓글 내용
  comment: string;

  /// 별점
  rating: number;
}
