import 'dart:convert';

class ResultLogin {
  var access_token, refresh_token, nama, jabatan;

  ResultLogin({this.access_token, this.refresh_token, this.nama, this.jabatan});
  factory ResultLogin.fromJson(Map<dynamic, dynamic> map) {
    return ResultLogin(
        access_token: map["access_token"],
        refresh_token: map["refresh_token"],
        nama: map["nama"],
        jabatan: map["jabatan"]);
  }

  @override
  String toString() {
    return 'ResultLogin{access_token: $access_token, refresh_token: $refresh_token, nama: $nama, jabatan: $jabatan}';
  }
}

List<ResultLogin> resultloginFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<ResultLogin>.from(data.map((item) => ResultLogin.fromJson(item)));
}
