import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sid_flutter/Components/LoginPage/LoginPage.dart';
import 'package:sid_flutter/api/RumahModel/RumahModel.dart';
import 'package:sid_flutter/api/utils/apiService.dart';
import 'package:sid_flutter/utils/ReusableClass.dart';
import 'package:sid_flutter/utils/warna.dart';

class RumahPage extends StatefulWidget {
  @override
  _RumahPageState createState() => _RumahPageState();
}

class _RumahPageState extends State<RumahPage> {
  TextEditingController _tecKode = TextEditingController(text: "");
  TextEditingController _tecKeterangan = TextEditingController(text: "");
  String _dropdownValue = "Rumah", kodeRumah = 'A1';
  bool _aktif = false;
  int _aktiftoboolean = 0;
  var access_token = "", refresh_token = "", nama = "", jabatan = "";
  late bool isSuccess;
  late SharedPreferences sp;
  ApiService _apiService = new ApiService();

  cekToken() async {
    sp = await SharedPreferences.getInstance();
    setState(() {
      access_token = sp.getString("access_token")!;
      refresh_token = sp.getString("refresh_token")!;
      jabatan = sp.getString("jabatan")!;
      nama = sp.getString("nama")!;
    });
    print(
        access_token + " ~ " + refresh_token + " ~ " + jabatan + " ~ " + nama);
    //checking jika token kosong maka di arahkan ke menu login jika tidak akan meng-hold token dan refresh token
    // if (access_token == null) {
    //   Navigator.of(context).pushAndRemoveUntil(
    //       MaterialPageRoute(builder: (BuildContext context) => LoginPage()),
    //       (Route<dynamic> route) => false);
    // } else {
    //   _apiService.refreshToken(refresh_token).then((value) => setState(() {
    //         if (!value) {
    //           Navigator.of(context).pushAndRemoveUntil(
    //               MaterialPageRoute(
    //                   builder: (BuildContext context) => LoginPage()),
    //               (Route<dynamic> route) => false);
    //         }
    //       }));
    // }
  }

  @override
  void initState() {
    super.initState();
    cekToken();
  }

  @override
  void dispose() {
    _apiService.client.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text('Daftar Rumah'),
          centerTitle: true,
          backgroundColor: primaryColor,
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () {
            _modalAddRumah();
          },
          label: Text(
            'Tambah',
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: primaryColor,
          icon: Icon(
            Icons.add,
            color: Colors.white,
          ),
        ),
        body: FutureBuilder(
            future: _apiService.AllDataRumah(access_token),
            builder: (context, AsyncSnapshot<List<Rumah>?> snapshot) {
              if (snapshot.hasError) {
                return Center(
                    child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(
                      height: 10,
                    ),
                    Text('Ada masalah ${snapshot.error}')
                  ],
                ));
              } else if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      CircularProgressIndicator(),
                      SizedBox(
                        height: 15,
                      ),
                      Text('Sebentar ya...')
                    ],
                  ),
                );
              } else if (snapshot.connectionState == ConnectionState.done) {
                print("Status Koneksi?" + snapshot.connectionState.toString());
                if (snapshot.hasData) {
                  List<Rumah>? dataRumah = snapshot.data;
                  return _listDataRumah(dataRumah);
                } else {
                  return Center(
                    child: Text('maaf, Belum ada data tersedia...'),
                  );
                }
              } else {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                          'Sepertinya ada masalah, coba back dan buka lagi menu ini yaa...')
                    ],
                  ),
                );
              }
            }));
  }

  Widget _listDataRumah(List<Rumah>? dataIndex) {
    return ListView.builder(
      itemCount: dataIndex!.length,
      itemBuilder: (context, index) {
        Rumah? datarumah = dataIndex[index];
        return Padding(
          padding: const EdgeInsets.all(8.0),
          child: Card(
              color: datarumah.aktif == 1 ? Colors.white : Colors.redAccent,
              child: Padding(
                padding:
                    EdgeInsets.only(left: 20, right: 20, top: 10, bottom: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text('Kode : '),
                        Text(
                          datarumah.kode,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text('Jenis bangunan : '),
                        Text(
                          datarumah.jenis_rumah,
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text('Keterangan : '),
                        Text(
                          datarumah.keterangan,
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        Text('Status : '),
                        Text(
                          datarumah.aktif == 1
                              ? 'Ada Orang'
                              : 'Tidak Ada Orang',
                        ),
                      ],
                    ),
                  ],
                ),
              )),
        );
      },
    );
  }

  void _modalAddRumah() {
    showModalBottomSheet(
        isScrollControlled: true,
        context: context,
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.only(
                topLeft: Radius.circular(15.0),
                topRight: Radius.circular(15.0))),
        builder: (BuildContext context) {
          return Padding(
            padding: MediaQuery.of(context).viewInsets,
            child: Container(
              padding: EdgeInsets.all(15.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextFormField(
                      controller: _tecKode,
                      textCapitalization: TextCapitalization.characters,
                      decoration: InputDecoration(
                        icon: Icon(Icons.add_business),
                        labelText: 'Kode Rumah',
                        hintText: 'Masukkan Kode',
                        suffixIcon: Icon(Icons.check_circle),
                      )),
                  SizedBox(height: 10.0),
                  TextFormField(
                      controller: _tecKeterangan,
                      decoration: InputDecoration(
                        icon: Icon(Icons.text_fields),
                        labelText: 'Keterangan',
                        hintText: 'Masukkan Keterangan',
                        suffixIcon: Icon(Icons.check_circle),
                      )),
                  SizedBox(height: 10.0),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        child: Row(
                          children: [
                            Text('Jenis Rumah '),
                            SizedBox(
                              width: 10.0,
                            ),
                            DropdownButton(
                              dropdownColor: Colors.white,
                              value: _dropdownValue,
                              icon: Icon(Icons.arrow_drop_down),
                              onChanged: (String? value) {
                                setState(() {
                                  _dropdownValue = value!;
                                  print("Value Dropdown? " + value);
                                });
                              },
                              items: <String>[
                                'Rumah',
                                'Kontrakan',
                                'Kost',
                                'Lainnya'
                              ].map<DropdownMenuItem<String>>((String value) {
                                return DropdownMenuItem<String>(
                                    value: value, child: Text(value));
                              }).toList(),
                            )
                          ],
                        ),
                      ),
                      Container(
                        child: Row(
                          children: [
                            Text('Status'),
                            SizedBox(
                              width: 10.0,
                            ),
                            Switch(
                              value: _aktif,
                              onChanged: (value) {
                                setState(() {
                                  _aktif = value;
                                  if (_aktif) {
                                    _aktiftoboolean = 1;
                                  } else {
                                    _aktiftoboolean = 0;
                                  }
                                  print("Value Switch?" + value.toString());
                                });
                              },
                              activeColor: primaryColor,
                              activeTrackColor: secondColor,
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  ElevatedButton(
                      onPressed: () {
                        // _addRumah();
                        _modalKonfirmasi();
                        // Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                        elevation: 0.0,
                        primary: Colors.white,
                      ),
                      child: Ink(
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(18)),
                        child: Container(
                          width: 325,
                          height: 45,
                          alignment: Alignment.center,
                          child: Text(
                            "Lanjutkan",
                            style: TextStyle(color: primaryColor, fontSize: 18),
                          ),
                        ),
                      )),
                ],
              ),
            ),
          );
        });
  }

  void _modalKonfirmasi() {
    var koderumah = _tecKode.text.toString();
    var keterangan = _tecKeterangan.text.toString();
    if (koderumah == "" || keterangan == "") {
      ReusableClasses().modalbottomWarning(
          context,
          "Tidak Valid!",
          "Pastikan semua kolom terisi dengan benar",
          'f405',
          'assets/images/sorry.png');
    } else {
      showModalBottomSheet(
          isScrollControlled: true,
          context: context,
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(15.0),
                  topRight: Radius.circular(15.0))),
          builder: (BuildContext context) {
            return Padding(
              padding: MediaQuery.of(context).viewInsets,
              child: Container(
                padding: EdgeInsets.all(15.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 10,
                    ),
                    Text(
                      'Konfirmasi',
                      style:
                          TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(
                      height: 20,
                    ),
                    Text('Apakah data yang anda masukkan sudah sesuai.?',
                        style: TextStyle(fontSize: 16)),
                    SizedBox(
                      height: 20,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                            style: ElevatedButton.styleFrom(
                              elevation: 0.0,
                              primary: Colors.red,
                            ),
                            child: Ink(
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(18)),
                              child: Container(
                                alignment: Alignment.center,
                                child: Text(
                                  "Periksa Lagi",
                                ),
                              ),
                            )),
                        SizedBox(
                          width: 55,
                        ),
                        ElevatedButton(
                            onPressed: () {
                              _addRumah();
                              Navigator.of(context).pop();
                            },
                            style: ElevatedButton.styleFrom(
                              elevation: 0.0,
                              primary: Colors.white,
                            ),
                            child: Ink(
                              decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(18)),
                              child: Container(
                                alignment: Alignment.center,
                                child: Text(
                                  "Simpan",
                                  style: TextStyle(color: primaryColor),
                                ),
                              ),
                            )),
                      ],
                    ),
                  ],
                ),
              ),
            );
          });
    }
  }

  void _addRumah() {
    var koderumah = _tecKode.text.toString();
    var keterangan = _tecKeterangan.text.toString();
    _dropdownValue == 'Rumah'
        ? kodeRumah = 'A1-'
        : _dropdownValue == 'Kost'
            ? kodeRumah = 'B1-'
            : _dropdownValue == 'Kontrakan'
                ? kodeRumah = 'C1-'
                : kodeRumah = 'D1-';
    if (koderumah == "" || keterangan == "") {
      ReusableClasses().modalbottomWarning(
          context,
          "Tidak Valid!",
          "Pastikan semua kolom terisi dengan benar",
          'f405',
          'assets/images/sorry.png');
    } else {
      Rumah data = Rumah(
          idnomor_rumah: 0,
          kode: kodeRumah + koderumah,
          keterangan: keterangan,
          jenis_rumah: _dropdownValue.toString(),
          aktif: _aktiftoboolean);
      _apiService.addRumah(access_token, data).then((isSuccess) {
        if (isSuccess) {
          _tecKode.clear();
          _tecKeterangan.clear();

          ReusableClasses().modalbottomWarning(
              context,
              "Berhasil!",
              "${_apiService.responseCode.messageApi}",
              "f200",
              "assets/images/congratulations.png");
        } else {
          ReusableClasses().modalbottomWarning(
              context,
              "Gagal!",
              "${_apiService.responseCode.messageApi}",
              "f400",
              "assets/images/sorry.png");
        }
        return;
      });
    }
  }
}
