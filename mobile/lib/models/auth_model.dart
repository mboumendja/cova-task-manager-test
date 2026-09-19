class LoginRequest {
  final String email;
  final String password;

  LoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() => {'email': email, 'password': password};
}

class RegisterRequest {
  final String fullName;
  final String email;
  final String password;

  RegisterRequest({required this.fullName, required this.email, required this.password});

  Map<String, dynamic> toJson() => {
        'fullName': fullName,
        'email': email,
        'password': password,
      };
}

class LoginResponse {
  final String fullName;
  final String email;
  final String accessToken;
  final int expiresIn;

  LoginResponse({
    required this.fullName,
    required this.email,
    required this.accessToken,
    required this.expiresIn,
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      fullName: json['fullName'],
      email: json['email'],
      accessToken: json['accessToken'],
      expiresIn: json['expiresIn'],
    );
  }
}