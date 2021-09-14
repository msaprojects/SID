import 'dart:convert';

import 'package:http/http.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sid_flutter/api/PenggunaModel/penggunaModel.dart';
import 'package:sid_flutter/api/PenggunaModel/resultloginModel.dart';
import 'package:sid_flutter/api/ResponseCode/responsecodeModel.dart';
import 'package:sid_flutter/api/RumahModel/RumahModel.dart';

class ApiService {
  final String BaseUrl = "http://192.168.1.213:9990/api/v1/";
  Client client = Client();
  ResponseCode responseCode = ResponseCode();

  //LOGIN
  Future<bool> LoginApp(Login data) async {
    var url = Uri.parse(BaseUrl + 'login');
    var response = await client.post(url,
        headers: {'content-type': 'application/json'}, body: loginToJson(data));
    Map resultLogin = jsonDecode(response.body);
    var loginresult = ResultLogin.fromJson(resultLogin);
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    if (response.statusCode == 200) {
      SharedPreferences sp = await SharedPreferences.getInstance();
      sp.setString('access_token', "${loginresult.access_token}");
      sp.setString('refresh_token', "${loginresult.refresh_token}");
      sp.setString('nama', "${loginresult.nama}");
      sp.setString('jabatan', "${loginresult.jabatan}");
      return true;
    } else {
      return false;
    }
  }

  //  GENERATE NEW TOKEN
  Future<bool> refreshToken(String refresh_token) async {
    var url = Uri.parse(BaseUrl + 'newtoken');
    SharedPreferences sp = await SharedPreferences.getInstance();
    final response = await client.post(url,
        headers: {"content-type": "application/json"},
        body: jsonEncode({"refresh_token": "${refresh_token}"}));
    print(response.body);
    if (response.statusCode == 200) {
      sp.setString('access_token', json.decode(response.body)['access_token']);
      return true;
    } else {
      return false;
    }
  }

  //GET DATA RUMAH DENGAN BARCODE_GEN
  Future<List<Rumah>?> DataRumah(String token, String qrcode) async {
    var url = Uri.parse(BaseUrl + 'rumah/' + qrcode);
    var response =
        await client.get(url, headers: {'content-type': 'application/json'});
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    print("Data Rumah?" + response.body);
    if (response.statusCode == 200) {
      return rumahFromJson(response.body);
    } else {
      return null;
    }
  }

  //GET ALL DATA RUMAH
  Future<List<Rumah>?> AllDataRumah(String token) async {
    print("Token " + token);
    var url = Uri.parse(BaseUrl + 'rumah');
    var response =
        await client.get(url, headers: {'Authorization': 'BEARER ${token}'});
    Map responsemessage = jsonDecode(response.body);
    responseCode = ResponseCode.fromJson(responsemessage);
    print("Data Rumah? " + rumahFromJson(response.body).toString());
    if (response.statusCode == 200) {
      return rumahFromJson(response.body);
    } else {
      return null;
    }
  }
}
