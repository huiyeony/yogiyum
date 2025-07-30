export interface Restaurant {
  id: number;

  /// 식당 이름
  name: string;

  /// 식당 대표 사진 URL
  thumbnailUrl?: URL;

  /// 위도
  latitude: string;

  /// 경도
  longitude: string;

  /// (도로명) 주소
  address: string;

  /// 연락처
  telephone: string;

  /// 영업 시간
  openingHour: string;

  /// 분야
  category: RestaurantCategory;
}

export type RestaurantCategory =
  /// 한식
  | "Korean"

  /// 양식
  | "Western"

  /// 아시아음식
  | "Asia"

  /// 일식
  | "Japanese"

  /// 중식
  | "Chinese"

  /// 분식
  | "Street"

  /// 카페
  | "Cafe"

  /// 뷔페
  | "Buffet"

  /// 빵집
  | "Bakery"

  /// 기타
  | "Etc";
