import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/utils.dart';
import 'package:truustmobile/models/login/loginpost.dart';
import 'package:truustmobile/utils/apiservice.dart';
import 'package:truustmobile/utils/customSnackbar.dart';
import 'package:truustmobile/views/pages/dashboard/dashboard.dart';

class LoginController extends GetxController {
  late TextEditingController namaController, passwordController;

  @override
  void onInit() {
    // TODO: implement onInit
    namaController = TextEditingController();
    passwordController = TextEditingController();
  }

  @override
  void onClose() {
    // TODO: implement onClose
    super.onClose();
    namaController.dispose();
    passwordController.dispose();
  }

  checkLogin() {
    if (namaController.text.isEmpty) {
      custoSnackbar('error', 'Harap isi Kolom nama!', 'error');
    } else if (passwordController.text.isEmpty) {
      custoSnackbar('error', 'Harap isi password!', 'error');
    } else {
      Get.showOverlay(
          asyncFunction: () => postLogin(),
          loadingWidget: CircularProgressIndicator());
    }
  }

  postLogin() async {
    LoginModel data = LoginModel(
        nama: namaController.text, password: passwordController.text);
    ApiService().LoginApp(data).then((value) {
      if (value) {
        Get.to(Dashboard());
      } else {
        custoSnackbar('error', 'username atau password anda salah', 'error');
      }
    });
  }
}
