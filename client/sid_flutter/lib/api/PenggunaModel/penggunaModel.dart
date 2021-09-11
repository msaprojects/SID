import 'dart:convert';

class Login {
  var username, password;
  Login({this.username, this.password});

  factory Login.fromJson(Map<String, dynamic> map) {
    return Login(username: map["username"], password: map["password"]);
  }

  Map<String, dynamic> toJson() {
    return {"username": username, "password": password};
  }

  @override
  String toString() {
    return 'Login{username: $username, password: $password}';
  }
}

List<Login> loginFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<Login>.from(data.map((item) => Login.fromJson(item)));
}

String loginToJson(Login data) {
  final jsonData = data.toJson();
  return json.encode(jsonData);
}
