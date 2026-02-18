
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
  final String _validCode = 'SALA_ISTEC_2026';

  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;
    final String? code = capture.barcodes.first.rawValue;
    setState(() => _isProcessing = true);

    if (code != _validCode) {
      _showError('QR Code Inválido', 'Este código não pertence ao ISTEC.');
      setState(() => _isProcessing = false);
      return;
    }

    try {
      final pos = await GeoHelper.determinePosition();
      final dist = GeoHelper.calculateDistance(pos.latitude, pos.longitude, GeoHelper.targetLat, GeoHelper.targetLng);

      if (dist <= GeoHelper.radiusMeters) {
        context.read<AppState>().addRecord(CheckInRecord(
          id: DateTime.now().toString(),
          timestamp: DateTime.now(),
          location: 'ISTEC - Sala Validada',
          isSuccess: true,
        ));
        Navigator.pop(context);
      } else {
        _showError('Localização Incorreta', 'Você está fora do raio de 100m.');
      }
    } catch (e) {
      _showError('Erro de GPS', 'Certifique-se que o GPS está ativo.');
    } finally {
      setState(() => _isProcessing = false);
    }
  }

  void _showError(String title, String msg) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title, style: const TextStyle(color: Colors.red)),
        content: Text(msg),
        actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('OK'))],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Validar Presença')),
      body: MobileScanner(onDetect: _onDetect),
    );
  }
}
