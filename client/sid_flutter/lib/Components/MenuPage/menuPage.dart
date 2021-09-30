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
      body: Container(
        padding: EdgeInsets.only(top: 45),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: EdgeInsets.only(left: 20),
                  child: CircleAvatar(
                    backgroundColor: primaryColor,
                    child: Text(
                      'SID',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ),
                SizedBox(
                  width: 15,
                ),
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(
                    'MSADEV',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  Text('admin')
                ])
              ],
            ),
            _masterData()
          ],
        ),
      ),
    );
  }

  Widget _masterData() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: EdgeInsets.fromLTRB(20, 10, 20, 10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
              padding: EdgeInsets.only(
                  left: 20.0, right: 20.0, top: 10.0, bottom: 10.0),
              child: Text(
                'MASTER',
                style: TextStyle(fontSize: 18),
              )),
          Divider(
            height: 5,
          ),
          Container(
            padding: EdgeInsets.only(
                left: 1 - .0, right: 1 - .0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: ListTile(
              onTap: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => RumahPage()));
              },
              title: Text(
                'Data Rumah',
                style: TextStyle(fontSize: 18),
              ),
              leading: Icon(
                Icons.home_rounded,
                color: Colors.black,
                size: 22,
              ),
              trailing: Icon(Icons.arrow_forward_ios_rounded),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 60.0, right: 10.0),
            child: Divider(
              height: 5,
            ),
          ),
          Container(
            padding: EdgeInsets.only(
                left: 1 - .0, right: 1 - .0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: ListTile(
              onTap: () {},
              title: Text(
                'Tagihan',
                style: TextStyle(fontSize: 18),
              ),
              leading: Icon(
                Icons.payment,
                color: Colors.black,
              ),
              trailing: Icon(Icons.arrow_forward_ios_rounded),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 60.0, right: 10.0),
            child: Divider(
              height: 5,
            ),
          ),
          Container(
            padding: EdgeInsets.only(
                left: 1 - .0, right: 1 - .0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: ListTile(
              onTap: () {},
              title: Text(
                'Data Bulan',
                style: TextStyle(fontSize: 18),
              ),
              leading: Icon(
                Icons.date_range,
                color: Colors.black,
              ),
              trailing: Icon(Icons.arrow_forward_ios_rounded),
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 60.0, right: 10.0),
            child: Divider(
              height: 5,
            ),
          ),
          Container(
            padding: EdgeInsets.only(
                left: 1 - .0, right: 1 - .0, top: 5.0, bottom: 5.0),
            alignment: Alignment.center,
            width: double.infinity,
            child: ListTile(
              onTap: () {},
              title: Text(
                'Pengguna',
                style: TextStyle(fontSize: 18),
              ),
              leading: Icon(
                Icons.people,
                color: Colors.black,
              ),
              trailing: Icon(Icons.arrow_forward_ios_rounded),
            ),
          ),
        ],
      ),
    );
  }
}
