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
  String _dropdownValue = "Rumah";
  bool _aktif = false;
  var access_token = "", refresh_token = "", nama = "", jabatan = "";
  late bool isSuccess;
  late SharedPreferences sp;
  ApiService _apiService = new ApiService();

  cekToken() async {
    sp = await SharedPreferences.getInstance();
    access_token = sp.getString("access_token")!;
    refresh_token = sp.getString("refresh_token")!;
    jabatan = sp.getString("jabatan")!;
    nama = sp.getString("nama")!;
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
    cekToken();
    super.initState();
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
            style: TextStyle(color: primaryColor),
          ),
          backgroundColor: Colors.white,
          icon: Icon(
            Icons.add,
            color: primaryColor,
          ),
        ),
        body: FutureBuilder(
            future: _apiService.AllDataRumah(access_token),
            builder: (context, AsyncSnapshot<List<Rumah>?> snapshot) {
              if (snapshot.hasError) {
                print(snapshot.error.toString());
                return ReusableClasses().modalbottomWarning(
                    context,
                    "Error",
                    "${_apiService.responseCode.messageApi}",
                    "400",
                    'assets/images/sorry.png');
              } else if (snapshot.connectionState == ConnectionState.waiting) {
                return Center(
                  child: Column(
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
                List<Rumah>? dataRumah = snapshot.data;
                return _listDataRumah(dataRumah);
              } else {
                return Center(
                  child: Column(
                    children: [
                      Text(
                          'Sepertinya ada masalah, coba back dan buka lagi menu ini yaa...')
                    ],
                  ),
                );
              }
              // return const Center(
              //   child: CircularProgressIndicator(),
              // );
            }));
  }

  Widget _listDataRumah(List<Rumah>? dataIndex) {
    return SingleChildScrollView(
        child: Expanded(
      flex: 1,
      child: Container(
          padding: EdgeInsets.only(left: 20, right: 20),
          child: Scrollbar(child: ListView.builder(
            itemBuilder: (context, index) {
              Rumah? datarumah = dataIndex![index];
              return Container(
                child: Card(
                  child: InkWell(
                    onTap: () {},
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [Text(datarumah.kode)],
                    ),
                  ),
                ),
              );
            },
          ))),
    ));
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
                                  print(value);
                                });
                              },
                              items: <String>[
                                'Rumah',
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
                                _aktif = value;
                                print(value);
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
                      onPressed: () {},
                      child: Ink(
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(18)),
                        child: Container(
                          width: 325,
                          height: 45,
                          alignment: Alignment.center,
                          child: Text("Simpan"),
                        ),
                      )),
                ],
              ),
            ),
          );
        });
  }
}
