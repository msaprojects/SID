import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/login/loginpost.dart';

class ApiService {
  String baseUrl = "http://localhost:9993/api/v1/";
  Future<bool> LoginApp(LoginModel data) async {
    print(data);
    var url = Uri.parse(baseUrl + 'login');
    var response = await http.post(url,
        headers: {'content-type': 'application/json'},
        body: json.encode(data.toJson()));
    if (response.statusCode == 200) {
      return true;
    } else {
      return false;
    }
  }
}
