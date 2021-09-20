import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:sid_flutter/Components/Widgets/BottomNavigation.dart';
import 'package:sid_flutter/api/PenggunaModel/penggunaModel.dart';
import 'package:sid_flutter/api/utils/apiService.dart';
import 'package:sid_flutter/utils/ReusableClass.dart';
import 'package:sid_flutter/utils/warna.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool _isLoading = false,
      _passtype = true,
      _fieldUsername = true,
      _fieldPassword = true;
  ApiService _apiService = new ApiService();
  TextEditingController _tecUsername = TextEditingController(text: "");
  TextEditingController _tecPassword = TextEditingController(text: "");

  @override
  void initState() {
    super.initState();
  }

  // @override
  // void dispose() {
  //   _apiService.client.close();
  //   super.dispose();
  // }

  void _toggle() {
    setState(() {
      _passtype = !_passtype;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          color: backgroundColor,
          padding: EdgeInsets.all(25.0),
          width: double.infinity,
          height: size.height,
          child: Stack(
            alignment: Alignment.center,
            fit: StackFit.passthrough,
            children: [
              Positioned.fill(
                  top: 20,
                  child: Align(
                    alignment: Alignment.topLeft,
                    child: (Text("MSADEV")),
                  )),
              Positioned(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    "[ S I D ]",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 28),
                  ),
                  SizedBox(
                    height: 10,
                  ),
                  AnimatedTextKit(animatedTexts: [
                    TypewriterAnimatedText("Sistem Informasi Desa")
                  ]),
                  SizedBox(
                    height: 15,
                  ),
                  TextFormField(
                      controller: _tecUsername,
                      decoration: InputDecoration(
                        icon: Icon(Icons.people_alt_outlined),
                        labelText: 'Username',
                        hintText: 'Masukkan Username',
                        suffixIcon: Icon(Icons.check_circle),
                      )),
                  SizedBox(height: 10),
                  TextFormField(
                      controller: _tecPassword,
                      obscureText: _passtype,
                      decoration: InputDecoration(
                        icon: Icon(Icons.password),
                        labelText: 'Password',
                        hintText: 'Masukkan Password',
                        suffixIcon: IconButton(
                          onPressed: _toggle,
                          icon: new Icon(_passtype
                              ? Icons.remove_red_eye
                              : Icons.visibility_off),
                        ),
                      )),
                  SizedBox(
                    height: 35,
                  ),
                  ElevatedButton(
                      onPressed: () {
                        LoginClick();
                      },
                      child: Ink(
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10)),
                        child: Container(
                          width: 325,
                          height: 45,
                          alignment: Alignment.center,
                          child: Text("Login"),
                        ),
                      )),
                ],
              ))
            ],
          ),
        ),
      ),
    );
  }

  LoginClick() async {
    var username = _tecUsername.text.toString();
    var password = _tecPassword.text.toString();
    if (username == "" || password == "") {
      ReusableClasses().modalbottomWarning(
          context,
          "Kolom Belum Diisi!",
          "Harap pastikan semua kolom terisi dengan benar.",
          "f405",
          'assets/images/sorry.png');
    } else {
      Login login = Login(username: username, password: password);
      _apiService.LoginApp(login).then((isSuccess) {
        setState(() {
          _isLoading = false;
        });
        if (isSuccess) {
          Navigator.pushReplacement(context,
              MaterialPageRoute(builder: (context) => BottomNavigation()));
        } else {
          ReusableClasses().modalbottomWarning(
              context,
              "Login Gagal!",
              "${_apiService.responseCode.messageApi}",
              "f400",
              "assets/images/sorry.png");
        }
        return;
      });
    }
    return;
  }
}
