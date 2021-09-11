import 'dart:convert';

class ResponseCode {
  var statusCode, messageApi;
  ResponseCode({this.statusCode, this.messageApi});

  factory ResponseCode.fromJson(Map<dynamic, dynamic> map) {
    return ResponseCode(
        statusCode: map["statuscode"], messageApi: map["message"]);
  }

  Map<String, dynamic> toJson() {
    return {"statuscode": statusCode, "message": messageApi};
  }

  @override
  String toString() {
    return 'ResponseCode{statuscode: $statusCode, message: $messageApi';
  }
}

List<ResponseCode> responsecodeFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<ResponseCode>.from(
      data.map((item) => ResponseCode.fromJson(item)));
}
