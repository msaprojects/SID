import 'package:flutter/material.dart';
import 'package:truustmobile/utils/warna.dart';

class Dashboard extends StatefulWidget {
  Dashboard({Key? key}) : super(key: key);

  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    Size size = MediaQuery.of(context).size;
    return Scaffold(
        body: Padding(
      padding: const EdgeInsets.only(left: 20.0, right: 20.0),
      child: CustomScrollView(
        physics: ClampingScrollPhysics(),
        slivers: <Widget>[
          _uiAccountName(screenHeight),
          _uiHeaderBox(screenHeight),
          _uiMenu(screenHeight),
          _uiQuickMenu(screenHeight)
        ],
      ),
    ));
  }

  SliverToBoxAdapter _uiAccountName(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
        padding:
            EdgeInsets.only(left: 20.0, right: 20.0, top: 45.0, bottom: 10.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Dashboard'.toUpperCase(),
              style: TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 18.0, color: warna1),
            ),
            Container(
              width: 50.0,
              height: 50.0,
              decoration: BoxDecoration(
                  border: Border.all(
                    color: warna1,
                  ),
                  color: warna1,
                  borderRadius: BorderRadius.all(Radius.circular(15.0))),
            )
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _uiHeaderBox(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
          padding:
              EdgeInsets.only(left: 20.0, right: 20.0, top: 45.0, bottom: 10.0),
          child: Container(
            width: 280.0,
            height: 125.0,
            decoration: BoxDecoration(
                border: Border.all(
                  color: warna1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: warna2.withOpacity(0.5),
                    spreadRadius: 4,
                    blurRadius: 3,
                    offset: Offset(1, 4), // changes position of shadow
                  ),
                ],
                color: warna1,
                borderRadius: BorderRadius.all(Radius.circular(15.0))),
          )),
    );
  }

  SliverToBoxAdapter _uiMenu(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
          // width: 280,
          padding:
              EdgeInsets.only(left: 20.0, right: 20.0, top: 35.0, bottom: 10.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                height: 35.0,
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
              SizedBox(
                height: 15.0,
              ),
              Container(
                height: 35.0,
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
              SizedBox(
                height: 15.0,
              ),
              Container(
                height: 35.0,
                decoration: BoxDecoration(
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
            ],
          )),
    );
  }

  SliverToBoxAdapter _uiQuickMenu(double screenHeight) {
    return SliverToBoxAdapter(
      child: Container(
          // width: 280,
          padding:
              EdgeInsets.only(left: 20.0, right: 20.0, top: 35.0, bottom: 10.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                width: 65,
                height: 65.0,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(15.0)),
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
              SizedBox(
                width: 15.0,
              ),
              Container(
                width: 65,
                height: 65.0,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(15.0)),
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
              SizedBox(
                width: 15.0,
              ),
              Container(
                width: 65,
                height: 65.0,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(15.0)),
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
              SizedBox(
                width: 15.0,
              ),
              Container(
                width: 65,
                height: 65.0,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(15.0)),
                  boxShadow: [
                    BoxShadow(
                      color: warna2.withOpacity(0.5),
                      spreadRadius: 4,
                      blurRadius: 3,
                      offset: Offset(1, 4), // changes position of shadow
                    ),
                  ],
                  color: warna1,
                ),
              ),
            ],
          )),
    );
  }
}
