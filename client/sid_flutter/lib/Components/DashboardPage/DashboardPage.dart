import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sid_flutter/Components/LoginPage/LoginPage.dart';
import 'package:sid_flutter/api/utils/apiService.dart';
import 'package:sid_flutter/utils/warna.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  var access_token = "", refresh_token = "", nama = "", jabatan = "";
  late bool isSuccess;
  late SharedPreferences sp;
  ApiService _apiService = new ApiService();

  @override
  void initState() {
    cekToken();
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  cekToken() async {
    sp = await SharedPreferences.getInstance();
    access_token = sp.getString("access_token")!;
    refresh_token = sp.getString("refresh_token")!;
    jabatan = sp.getString("jabatan")!;
    nama = sp.getString("nama")!;
    //checking jika token kosong maka di arahkan ke menu login jika tidak akan meng-hold token dan refresh token
    if (access_token == null) {
      Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (BuildContext context) => LoginPage()),
          (Route<dynamic> route) => false);
    } else {
      _apiService.refreshToken(refresh_token).then((value) => setState(() {
            if (!value) {
              Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                      builder: (BuildContext context) => LoginPage()),
                  (Route<dynamic> route) => false);
            }
          }));
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: CustomScrollView(
        physics: ClampingScrollPhysics(),
        slivers: <Widget>[
          _buildHeader(screenHeight),
          _buildBanner(screenHeight),
          _buildPerhitungan(screenHeight),
          _buildLastTransaction(screenHeight)
        ],
      ),
    );
  }

  SliverToBoxAdapter _buildHeader(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
          padding:
              const EdgeInsets.only(left: 20, right: 20, top: 55, bottom: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    height: 10,
                  ),
                  Text(
                    'powered by MSADEV Solution.',
                    style: TextStyle(fontSize: 12),
                  ),
                  SizedBox(
                    height: 20,
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(
                        'Halo, ',
                        style: const TextStyle(
                            fontSize: 28.0, fontWeight: FontWeight.w200),
                      ),
                      SizedBox(
                        child: DefaultTextStyle(
                          style: const TextStyle(
                              fontSize: 28.0,
                              color: textColor,
                              fontWeight: FontWeight.bold),
                          child: AnimatedTextKit(animatedTexts: [
                            TypewriterAnimatedText(
                              nama.toString(),
                            )
                          ]),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          )),
    );
  }

  SliverToBoxAdapter _buildBanner(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.only(left: 20, right: 20),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Container(
            color: secondColor,
            height: 150,
            width: 200,
          ),
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildPerhitungan(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Keuangan',
              style: TextStyle(
                fontSize: 22,
              ),
            )
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildLastTransaction(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Transaksi Terakhir',
              style: TextStyle(
                fontSize: 22,
              ),
            )
          ],
        ),
      ),
    );
  }
}
