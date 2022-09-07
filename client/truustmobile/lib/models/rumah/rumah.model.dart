class RumahModel {
  String? message;
  List<Data>? data;

  RumahModel({this.message, this.data});

  RumahModel.fromJson(Map<String, dynamic> json) {
    message = json['message'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  int? idrumah;
  String? kodeRumah;
  String? keterangan;
  String? jenisBangunan;
  int? aktif;
  String? createdAt;
  String? updatedAt;

  Data(
      {this.idrumah,
      this.kodeRumah,
      this.keterangan,
      this.jenisBangunan,
      this.aktif,
      this.createdAt,
      this.updatedAt});

  Data.fromJson(Map<String, dynamic> json) {
    idrumah = json['idrumah'];
    kodeRumah = json['kode_rumah'];
    keterangan = json['keterangan'];
    jenisBangunan = json['jenis_bangunan'];
    aktif = json['aktif'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['idrumah'] = this.idrumah;
    data['kode_rumah'] = this.kodeRumah;
    data['keterangan'] = this.keterangan;
    data['jenis_bangunan'] = this.jenisBangunan;
    data['aktif'] = this.aktif;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
