import 'dart:convert';

LoginModel loginModelFromJson(String str) =>
    LoginModel.fromJson(json.decode(str));

String loginModelToJson(LoginModel data) => json.encode(data.toJson());

class LoginModel {
  LoginModel({
    required this.nama,
    required this.password,
  });

  String nama;
  String password;

  factory LoginModel.fromJson(Map<String, dynamic> json) => LoginModel(
        nama: json["nama"],
        password: json["password"],
      );

  Map<String, dynamic> toJson() => {
        "nama": nama,
        "password": password,
      };
}
