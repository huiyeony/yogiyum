export interface User {
  /// 사용자 ID (UUID)
  id: string;

  nickname: string;

  /// 사용자 이메일
  email: string;

  /// 가입일자
  registerDate: Date;
}
