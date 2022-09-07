class LoginResponseModel {
  String? nama;
  String? accessToken;
  String? jabatan;

  LoginResponseModel({this.nama, this.accessToken, this.jabatan});

  LoginResponseModel.fromJson(Map<String, dynamic> json) {
    nama = json['nama'];
    accessToken = json['access_token'];
    jabatan = json['jabatan'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['nama'] = this.nama;
    data['access_token'] = this.accessToken;
    data['jabatan'] = this.jabatan;
    return data;
  }
}
