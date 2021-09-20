import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:sid_flutter/Components/RumahPage/RumahPage.dart';
import 'package:sid_flutter/utils/warna.dart';

class MenuPage extends StatefulWidget {
  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0, top: 20.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: Card(
              child: ListTile(
                onTap: () {
                  Navigator.push(context,
                      MaterialPageRoute(builder: (context) => RumahPage()));
                },
                title: Text(
                  'Data Rumah',
                  style: TextStyle(fontSize: 22),
                ),
                leading: Icon(
                  Icons.home,
                  color: Colors.black,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0, top: 10.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: Card(
              child: ListTile(
                onTap: () {},
                title: Text(
                  'Tagihan',
                  style: TextStyle(fontSize: 22),
                ),
                leading: Icon(
                  Icons.payment,
                  color: Colors.black,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0, top: 10.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: Card(
              child: ListTile(
                onTap: () {},
                title: Text(
                  'Data Bulan',
                  style: TextStyle(fontSize: 22),
                ),
                leading: Icon(
                  Icons.date_range,
                  color: Colors.black,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0, top: 10.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: Card(
              child: ListTile(
                onTap: () {},
                title: Text(
                  'Pengguna',
                  style: TextStyle(fontSize: 22),
                ),
                leading: Icon(
                  Icons.people,
                  color: Colors.black,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
