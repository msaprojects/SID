import 'dart:convert';

class Rumah {
  num idnomor_rumah, aktif;
  var kode, keterangan, jenis_rumah;
  Rumah(
      {required this.idnomor_rumah,
      this.kode,
      this.keterangan,
      this.jenis_rumah,
      required this.aktif});

  factory Rumah.fromJson(Map<String, dynamic> map) {
    return Rumah(
      idnomor_rumah: map["idnomor_rumah"],
      kode: map["kode"],
      keterangan: map["keterangan"],
      jenis_rumah: map["jenis_rumah"],
      aktif: map["aktif"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "kode": kode,
      "keterangan": keterangan,
      "jenis_rumah": jenis_rumah,
      "aktif": aktif,
    };
  }

  @override
  String toString() {
    return 'Rumah{idnomor_rumah: $idnomor_rumah, kode: $kode, keterangan: $keterangan, jenis_rumah: $jenis_rumah, aktif: $aktif}';
  }
}

List<Rumah> rumahFromJson(String dataJson) {
  final data = json.decode(dataJson);
  return List<Rumah>.from(data["data"].map((item) => Rumah.fromJson(item)));
}

String rumahToJson(Rumah data) {
  final jsonData = data.toJson();
  return json.encode(jsonData);
}
