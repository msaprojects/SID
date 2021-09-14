import 'package:flutter/material.dart';
import 'package:sid_flutter/utils/warna.dart';

class TagihanPage extends StatefulWidget {
  @override
  _TagihanPageState createState() => _TagihanPageState();
}

class _TagihanPageState extends State<TagihanPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Setting Tagihan'),
        centerTitle: true,
        backgroundColor: primaryColor,
      ),
    );
  }
}
