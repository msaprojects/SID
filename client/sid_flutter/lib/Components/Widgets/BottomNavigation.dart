import 'package:flutter/material.dart';
import 'package:sid_flutter/Components/DashboardPage/DashboardPage.dart';
import 'package:sid_flutter/Components/MenuPage/menuPage.dart';
import 'package:sid_flutter/Components/PaymentPage/PaymentPage.dart';
import 'package:sid_flutter/utils/warna.dart';

class BottomNavigation extends StatefulWidget {
  @override
  _BottomNavigationState createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<BottomNavigation> {
  int _currentTab = 0;
  PageStorageBucket bucket = PageStorageBucket();
  List<Widget> _currentPage = <Widget>[
    DashboardPage(),
    ScanPaymentPage(),
    MenuPage()
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _BackPressed,
      child: Scaffold(
        body: PageStorage(
          bucket: bucket,
          child: _currentPage[_currentTab],
        ),
        bottomNavigationBar: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedIconTheme: IconThemeData(color: primaryColor),
          selectedItemColor: primaryColor,
          unselectedItemColor: primaryColor.withOpacity(.40),
          onTap: (value) {
            setState(() {
              _currentTab = value;
            });
          },
          currentIndex: _currentTab,
          items: [
            BottomNavigationBarItem(
              label: 'Home',
              icon: Icon(Icons.favorite),
            ),
            BottomNavigationBarItem(
              label: 'Payment',
              icon: Icon(Icons.qr_code_2),
            ),
            BottomNavigationBarItem(
              label: 'Menu',
              icon: Icon(Icons.menu),
            ),
          ],
        ),
      ),
    );
  }

  Future<bool> _BackPressed() async {
    DateTime currentTime = DateTime.now();
    bool backbutton = DateTime == null ||
        currentTime.difference(DateTime.now()) > Duration(seconds: 3);
    if (backbutton) {
      print("Tekan lagi untuk keluar");
      return false;
    } else {
      return true;
    }
  }
}
