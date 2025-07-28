export interface Menu {
  /// 메뉴 고유 id
  id: number;

  /// 식당 id
  restaurantId: number;

  /// 메뉴명
  name: string;

  /// 메뉴 소개
  description: string;

  /// 메뉴 가격
  price: string;

  /// 메뉴 이미지 URL
  imageUrl?: URL;
}
