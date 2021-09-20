import 'package:flutter/material.dart';
import 'package:sid_flutter/api/RumahModel/RumahModel.dart';
import 'package:sid_flutter/utils/warna.dart';

class DetailBayarPage extends StatefulWidget {
  var qrvalue = "";
  DetailBayarPage({required this.qrvalue});
  @override
  _DetailBayarPageState createState() => _DetailBayarPageState();
}

class _DetailBayarPageState extends State<DetailBayarPage> {
  var qrvalue = "";
  @override
  void initState() {
    super.initState();
    qrvalue = widget.qrvalue;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Tagihan'),
        centerTitle: true,
        backgroundColor: primaryColor,
      ),
      body: Center(
        child: Text(qrvalue),
      ),
    );
  }
}
