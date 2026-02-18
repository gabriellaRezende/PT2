
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../providers/app_state.dart';
import '../models/check_in.dart';
import '../utils/geo_helper.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  bool _isProcessing = false;

  /// NOTA TÉCNICA (Relatório):
  /// O mobile_scanner fornece um callback 'onDetect' que dispara quando um QR é focado.
  /// Aqui, pausamos o processamento para evitar leituras duplicadas enquanto
  /// validamos o GPS do aluno.
  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;
    setState(() => _isProcessing = true);

    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty) {
      _showValidationDialog();
      
      try {
        // Validação de GPS
        final position = await GeoHelper.determinePosition();
        final distance = GeoHelper.calculateDistance(
          position.latitude, position.longitude,
          GeoHelper.targetLat, GeoHelper.targetLng
        );

        Navigator.pop(context); // Fecha dialog de espera

        if (distance <= GeoHelper.radiusMeters) {
          // SUCESSO
          final newRecord = CheckInRecord(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            timestamp: DateTime.now(),
            location: 'Campus ISTEC',
            isSuccess: true,
          );
          context.read<AppState>().addRecord(newRecord);
          _showStatusSnackbar('Check-in realizado com sucesso!', Colors.green);
          Navigator.pop(context);
        } else {
          // LOCALIZAÇÃO INCORRETA
          _showErrorDialog('Localização Incorreta', 'Você deve estar no ISTEC para validar a presença.');
        }
      } catch (e) {
        Navigator.pop(context);
        _showStatusSnackbar('Erro: $e', Colors.red);
      } finally {
        setState(() => _isProcessing = false);
      }
    }
  }

  void _showValidationDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Validando GPS e QR Code...'),
          ],
        ),
      ),
    );
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('OK'))
        ],
      ),
    );
  }

  void _showStatusSnackbar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan QR Code')),
      body: Stack(
        children: [
          MobileScanner(
            controller: MobileScannerController(facingMode: CameraFacing.back),
            onDetect: _onDetect,
          ),
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.blue, width: 4),
                borderRadius: BorderRadius.circular(24),
              ),
            ),
          ),
          const Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Text(
              'Aponte para o QR Code da sala',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
            ),
          )
        ],
      ),
    );
  }
}
