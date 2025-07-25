export interface Restaurant {
  id: number;

  /// 식당 이름
  name: string;

  /// 식당 대표 사진 URL
  thumbnailUrl: URL;

  /// 위도
  latitude: number;

  /// (도로명) 주소
  address: number;

  /// 경도
  longitude: number;

  /// 연락처
  telephone: string;

  /// 영업 시간
  openingHour: string;

  /// 분야
  category: RestaurantCategory;
}

export enum RestaurantCategory {
  /// 한식
  Korean = "Korean",

  /// 양식
  Western = "Western",

  /// 아시아음식
  Asia = "Asia",

  /// 일식
  Japanese = "Japanese",

  /// 중식
  Chinese = "Chinese",

  /// 분식
  Street = "Street",

  /// 카페
  Cafe = "Cafe",

  /// 뷔페
  Buffet = "Buffet",

  /// 기타
  Etc = "Etc",
}
