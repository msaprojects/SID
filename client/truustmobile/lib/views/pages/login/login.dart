import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truustmobile/controller/login.controller.dart';

import '../../../utils/warna.dart';
import '../../widgets/bottomNavigation.dart';

class Login extends StatefulWidget {
  Login({Key? key}) : super(key: key);

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final loginController = Get.put(LoginController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
      color: backgroundcolor,
      child: Padding(
        padding: const EdgeInsets.only(left: 20.0, right: 20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: GetBuilder<LoginController>(builder: (controller) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      height: 80,
                      width: 175,
                      decoration: const BoxDecoration(
                          image: DecorationImage(
                              image: AssetImage(
                                'assets/images/logoapps.png',
                              ),
                              fit: BoxFit.contain)),
                    ),
                    const SizedBox(
                      height: 25.0,
                    ),
                    Container(
                        child: _TextEditingUsername(controller.namaController)),
                    const SizedBox(
                      height: 10.0,
                    ),
                    Container(
                        child: _TextEditingPassword(
                            controller.passwordController)),
                    const SizedBox(
                      height: 45.0,
                    ),
                    ElevatedButton(
                        onPressed: () {
                          controller.checkLogin();
                        },
                        style: ElevatedButton.styleFrom(
                            elevation: 0.0, primary: warna1),
                        child: Ink(
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(18.0)),
                            child: Container(
                              width: 325,
                              height: 55,
                              alignment: Alignment.center,
                              child: Text('L O G I N',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 26.0,
                                    fontWeight: FontWeight.bold,
                                  )),
                            )))
                  ],
                );
              }),
            ),
          ],
        ),
      ),
    ));
  }

  // * widget for text editing username
  Widget _TextEditingUsername(controller) {
    return TextFormField(
        style: TextStyle(color: warna2, fontSize: 22.0),
        cursorColor: warna1,
        controller: controller,
        decoration: InputDecoration(
          fillColor: Colors.white,
          filled: true,
          hoverColor: warna1,
          // border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
          focusColor: warna1,
          // icon: Icon(
          //   Icons.people_alt_outlined,
          //   color: warna2,
          // ),
          hintText: 'Masukkan Username',
          // suffixIcon: Icon(
          //   Icons.check_circle,
          //   color: warna2,
          // ),
        ));
  }

  // * widget for text editing password
  Widget _TextEditingPassword(controller) {
    return TextFormField(
        style: TextStyle(color: warna1, fontSize: 22.0),
        cursorColor: warna2,
        controller: controller,
        // obscureText: _obsecureText,
        keyboardType: TextInputType.visiblePassword,
        decoration: InputDecoration(
          fillColor: Colors.white,
          filled: true,
          hoverColor: warna1,
          // border: OutlineInputBorder(borderRadius: BorderRadius.circular(15.0)),
          // icon: Icon(
          //   Icons.password,
          //   color: warna2,
          // ),
          hintText: 'Masukkan Password',
          // suffixIcon: IconButton(
          //   onPressed: () {},
          //   icon: new Icon(
          //     Icons.remove_red_eye,
          //     color: warna1,
          //   ),
          // ),
        ));
  }
}
