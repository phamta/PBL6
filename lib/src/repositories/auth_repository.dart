import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class AuthRepository {
  Future<Map<String, dynamic>?> login(String email, String password) async {
    print('Email: ${email.trim()}');
    print('Password: ${password.trim()}');
    print(
      'Body gửi đi: ${json.encode({'email': email.trim(), 'password': password.trim()})}',
    );
    final response = await http.post(
      Uri.parse('http://10.0.2.2:3001/api/v1/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email.trim(), 'password': password.trim()}),
    );
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final userJson = data['data']['user'];
      final user = UserModel.fromJson(userJson);
      final accessToken = data['data']['accessToken'];
      final refreshToken = data['data']['refreshToken'];
      return {
        'user': user,
        'accessToken': accessToken,
        'refreshToken': refreshToken,
      };
    }
    return null;
  }

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', accessToken);
    await prefs.setString('refreshToken', refreshToken);
  }
}
