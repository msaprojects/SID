import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:sid_flutter/utils/warna.dart';

class MenuPage extends StatefulWidget {
  @override
  _MenuPageState createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryColor,
        centerTitle: true,
        title: Text('Menu'),
      ),
      body: ListView(
        children: [
          Container(
            padding: EdgeInsets.all(20.0),
            alignment: Alignment.center,
            margin: EdgeInsets.all(20),
            width: double.infinity,
            height: 80.0,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: Colors.black26)),
            child: Row(
              children: <Widget>[
                Icon(Icons.home),
                SizedBox(
                  width: 20,
                ),
                Text(
                  'Data Rumah',
                  style: TextStyle(fontSize: 22),
                )
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0),
            alignment: Alignment.center,
            margin: EdgeInsets.all(20),
            width: double.infinity,
            height: 80.0,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: Colors.black26)),
            child: Row(
              children: <Widget>[
                Icon(Icons.payment),
                SizedBox(
                  width: 20,
                ),
                Text(
                  'Set Tagihan',
                  style: TextStyle(fontSize: 22),
                )
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0),
            alignment: Alignment.center,
            margin: EdgeInsets.all(20),
            width: double.infinity,
            height: 80.0,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: Colors.black26)),
            child: Row(
              children: <Widget>[
                Icon(Icons.date_range),
                SizedBox(
                  width: 20,
                ),
                Text(
                  'Data Bulan',
                  style: TextStyle(fontSize: 22),
                )
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 20.0, right: 20.0),
            alignment: Alignment.center,
            margin: EdgeInsets.all(20),
            width: double.infinity,
            height: 80.0,
            decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: Colors.black26)),
            child: Row(
              children: <Widget>[
                Icon(Icons.people),
                SizedBox(
                  width: 20,
                ),
                Text(
                  'Pengguna',
                  style: TextStyle(fontSize: 22),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
