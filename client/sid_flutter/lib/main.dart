import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:sid_flutter/Components/SplashscreenPage/SplashScreenPage.dart';
import 'package:sid_flutter/utils/warna.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sistem Informasi Desa',
      theme: ThemeData.light().copyWith(
          scaffoldBackgroundColor: backgroundColor,
          textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme)
              .apply(bodyColor: textColor),
          canvasColor: Colors.transparent),
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}
