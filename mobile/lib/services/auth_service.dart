import 'package:dio/dio.dart';
import '../models/auth_model.dart';
import 'api_service.dart';

class AuthException implements Exception {
  final String message;
  AuthException(this.message);
}

class AuthService {
  final ApiService _api = ApiService();

  Future<LoginResponse> login(LoginRequest request) async {
    try {
      final response = await _api.dio.post('/auth/login', data: request.toJson());
      final loginResponse = LoginResponse.fromJson(response.data);
      await _api.saveToken(loginResponse.accessToken);
      return loginResponse;
    } on DioException catch (e) {
      throw AuthException(_extractErrorMessage(e));
    }
  }

  Future<String> register(RegisterRequest request) async {
    try {
      final response = await _api.dio.post('/auth/register', data: request.toJson());
      return response.data['message'] ?? 'Compte créé avec succès';
    } on DioException catch (e) {
      throw AuthException(_extractErrorMessage(e));
    }
  }

  Future<void> logout() async {
    await _api.clearToken();
  }

  String _extractErrorMessage(DioException e) {
    if (e.response?.data != null && e.response?.data is Map) {
      final data = e.response!.data as Map;
      if (data.containsKey('error')) return data['error'];
    }
    return 'Une erreur est survenue. Veuillez réessayer.';
  }
}