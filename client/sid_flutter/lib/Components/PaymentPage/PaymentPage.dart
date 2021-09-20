import 'dart:developer';
import 'dart:io';

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sid_flutter/Components/PaymentPage/DetailBayarPage.dart';
import 'package:sid_flutter/Components/RumahPage/RumahPage.dart';
import 'package:sid_flutter/api/utils/apiService.dart';
import 'package:sid_flutter/utils/ReusableClass.dart';
import 'package:sid_flutter/utils/warna.dart';

class ScanPaymentPage extends StatefulWidget {
  @override
  _ScanPaymentPageState createState() => _ScanPaymentPageState();
}

class _ScanPaymentPageState extends State<ScanPaymentPage> {
//QRCODE VARIABLE
  Barcode? result;
  QRViewController? controller;
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

// AUDIO VARIABLE
  AudioPlayer audioPlayer = AudioPlayer();
  AudioCache audioCache = AudioCache();
  String? audioPath;

  //VARIABLE
  String? dataqr;
  String? token;
  ApiService _apiService = new ApiService();
  late SharedPreferences sp;
  var access_token = "", refresh_token = "", nama = "", jabatan = "";
  late bool isSuccess;

  cekToken() async {
    sp = await SharedPreferences.getInstance();
    access_token = sp.getString("access_token")!;
    refresh_token = sp.getString("refresh_token")!;
    jabatan = sp.getString("jabatan")!;
    nama = sp.getString("nama")!;
  }

  @override
  void initState() {
    super.initState();
    if (Platform.isIOS) {
      audioCache.fixedPlayer?.notificationService.startHeadlessService();
    }
    cekToken();
    print("token? " + token.toString());
  }

  void playSound() async {
    final file = await audioCache.loadAsFile('audio/success-payment.mp3');
    final bytes = await file.readAsBytes();
    audioCache.playBytes(bytes);
  }

  // In order to get hot reload to work we need to pause the camera if the platform
  // is android, or resume the camera if the platform is iOS.
  @override
  void reassemble() {
    super.reassemble();
    if (Platform.isAndroid) {
      controller!.pauseCamera();
    }
    controller!.resumeCamera();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Expanded(flex: 4, child: _buildQrView(context)),
          Expanded(
            flex: 1,
            child: FittedBox(
              fit: BoxFit.contain,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  // if (result != null)
                  //   Text(
                  //       'Barcode Type: ${describeEnum(result!.format)}   Data: ${result!.code}')
                  // else
                  //   Text('Scan a code'),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: <Widget>[
                      Container(
                        margin: EdgeInsets.all(5),
                        child: ElevatedButton(
                            style:
                                ElevatedButton.styleFrom(primary: primaryColor),
                            onPressed: () async {
                              await controller?.toggleFlash();
                              setState(() {});
                            },
                            child: FutureBuilder(
                              future: controller?.getFlashStatus(),
                              builder: (context, snapshot) {
                                // return Text('Flash: ${snapshot.data}');
                                return snapshot.data == true
                                    ? Icon(Icons.flash_off)
                                    : Icon(Icons.flash_on);
                              },
                            )),
                      ),
                      Container(
                        margin: EdgeInsets.all(5),
                        child: ElevatedButton(
                            style:
                                ElevatedButton.styleFrom(primary: primaryColor),
                            onPressed: () async {
                              await controller?.flipCamera();
                              setState(() {});
                            },
                            child: FutureBuilder(
                              future: controller?.getCameraInfo(),
                              builder: (context, snapshot) {
                                return snapshot.data == CameraFacing.back
                                    ? Icon(Icons.camera_front)
                                    : Icon(Icons.cameraswitch);
                                // if (snapshot.data != null) {
                                //   return Text(
                                //       'Camera facing ${describeEnum(snapshot.data!)}');
                                // } else {
                                //   return Text('loading');
                                // }
                              },
                            )),
                      ),
                      // Container(
                      //   margin: EdgeInsets.all(8),
                      //   child: ElevatedButton(
                      //     onPressed: () async {
                      //       await controller?.pauseCamera();
                      //     },
                      //     child: Icon(Icons.pause),
                      //   ),
                      // ),
                      // Container(
                      //   margin: EdgeInsets.all(8),
                      //   child: ElevatedButton(
                      //     onPressed: () async {
                      //       await controller?.resumeCamera();
                      //     },
                      //     child: Icon(Icons.play_arrow),
                      //   ),
                      // )
                    ],
                  ),
                  result == null
                      ? Text('Scan a code')
                      : result!.code.split('2b')[0].toString() != '\$'
                          ? Text('QR Tidak Valid!')
                          : ElevatedButton(
                              onPressed: () {
                                _PaymentDetail();
                              },
                              style: ElevatedButton.styleFrom(
                                elevation: 0.0,
                                primary: primaryColor,
                              ),
                              child: Ink(
                                decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(18)),
                                child: Container(
                                  alignment: Alignment.center,
                                  child: Text(
                                    "Lanjutkan Pembayaran",
                                  ),
                                ),
                              )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQrView(BuildContext context) {
    // For this example we check how width or tall the device is and change the scanArea and overlay accordingly.
    var scanArea = (MediaQuery.of(context).size.width < 400 ||
            MediaQuery.of(context).size.height < 400)
        ? 250.0
        : 300.0;
    // To ensure the Scanner view is properly sizes after rotation
    // we need to listen for Flutter SizeChanged notification and update controller
    return QRView(
      key: qrKey,
      overlayMargin: EdgeInsets.all(5),
      onQRViewCreated: _onQRViewCreated,
      overlay: QrScannerOverlayShape(
          borderColor: primaryColor,
          borderRadius: 10,
          borderLength: 30,
          borderWidth: 10,
          cutOutBottomOffset: 10,
          cutOutSize: scanArea),
      onPermissionSet: (ctrl, p) => _onPermissionSet(context, ctrl, p),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        result = scanData;
        print('PRINT QR VALUE? ' +
            result.toString() +
            ' ~ ' +
            result!.code.split('2b')[0].toString());
      });
    });
    setState(() {
      this.controller = controller;
    });
  }

  void _onPermissionSet(BuildContext context, QRViewController ctrl, bool p) {
    log('${DateTime.now().toIso8601String()}_onPermissionSet $p');
    if (!p) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('no Permission')),
      );
    }
  }

  _PaymentDetail() {
    print("Dapet QR? " + result!.code.toString());
    Navigator.of(context).push(MaterialPageRoute(builder: (context) {
      return DetailBayarPage(qrvalue: result!.code.toString());
    }));
    return;
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
    cekToken();
  }
}
