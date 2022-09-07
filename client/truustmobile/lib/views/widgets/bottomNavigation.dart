import 'package:flutter/material.dart';
import 'package:truustmobile/utils/warna.dart';

import '../pages/akun/akun.dart';
import '../pages/dashboard/dashboard.dart';
import '../pages/login/login.dart';
import '../pages/pembayaran/pembayaran.dart';

class BottomNavigation extends StatefulWidget {
  BottomNavigation({Key? key}) : super(key: key);

  @override
  State<BottomNavigation> createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation> {
  int _currentTab = 0;
  PageStorageBucket bucket = PageStorageBucket();
  List<Widget> _currentPage = <Widget>[
    Dashboard(),
    Pembayaran(),
    Akun(),
  ];

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _backPressed,
      child: Scaffold(
        body: PageStorage(bucket: bucket, child: _currentPage[_currentTab]),
        bottomNavigationBar: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: warna1,
          selectedIconTheme: IconThemeData(color: warna2),
          selectedItemColor: warna2,
          unselectedItemColor: warna2.withOpacity(0.40),
          unselectedFontSize: 10.0,
          items: [
            BottomNavigationBarItem(
                label: 'Dashboard', icon: Icon(Icons.home_sharp)),
            BottomNavigationBarItem(
                label: 'Pembayaran', icon: Icon(Icons.qr_code_2_rounded)),
            BottomNavigationBarItem(label: 'Akun', icon: Icon(Icons.person)),
          ],
          onTap: (value) {
            setState(() {
              _currentTab = value;
            });
          },
          currentIndex: _currentTab,
        ),
      ),
    );
  }

  Future<bool> _backPressed() async {
    DateTime currentTime = DateTime.now();
    bool backButton = DateTime == null ||
        currentTime.difference(DateTime.now()) > Duration(seconds: 2);
    if (backButton) {
      return false;
    } else {
      return true;
    }
  }
}
