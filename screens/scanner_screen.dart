
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
  static const String _expectedQRCode = 'SALA_ISTEC_2026';

  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;
    
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isEmpty) return;

    final String? code = barcodes.first.rawValue;
    setState(() => _isProcessing = true);

    // 1. Validação imediata do QR Code
    if (code != _expectedQRCode) {
      _showErrorDialog('QR Code Inválido', 'O código lido não pertence a uma sala de aula válida do ISTEC.');
      setState(() => _isProcessing = false);
      return;
    }

    _showValidationDialog();
    
    try {
      // 2. Verificação de GPS e "Conexão" (Simulada para o core)
      // No Flutter real, usaríamos o package connectivity_plus aqui.
      final position = await GeoHelper.determinePosition();
      
      final distance = GeoHelper.calculateDistance(
        position.latitude, position.longitude,
        GeoHelper.targetLat, GeoHelper.targetLng
      );

      if (!mounted) return;
      Navigator.pop(context); // Fecha dialog de espera

      if (distance <= GeoHelper.radiusMeters) {
        final newRecord = CheckInRecord(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          timestamp: DateTime.now(),
          location: 'Campus ISTEC - Sala Validada',
          isSuccess: true,
        );
        context.read<AppState>().addRecord(newRecord);
        _showStatusSnackbar('Check-in realizado com sucesso!', Colors.green);
        Navigator.pop(context);
      } else {
        _showErrorDialog('Localização Incorreta', 'O QR Code é válido, mas você está fora do raio de 100m do campus.');
      }
    } catch (e) {
      if (!mounted) return;
      Navigator.pop(context);
      
      // Tratamento de Erro de "Sem Conexão" ou Falha de Serviço
      String errorMsg = e.toString();
      if (errorMsg.contains('disabled') || errorMsg.contains('denied')) {
        _showErrorDialog('Sem Conexão/Acesso', 'Não foi possível aceder aos serviços de localização. Verifique o seu GPS e internet.');
      } else {
        _showStatusSnackbar('Erro: $e', Colors.red);
      }
    } finally {
      if (mounted) setState(() => _isProcessing = false);
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
            Text('Validando Presença...'),
          ],
        ),
      ),
    );
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title, style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context), 
            child: const Text('TENTAR NOVAMENTE')
          )
        ],
      ),
    );
  }

  void _showStatusSnackbar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: color, behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Check-in ISTEC 2026')),
      body: Stack(
        children: [
          MobileScanner(
            controller: MobileScannerController(facingMode: CameraFacing.back),
            onDetect: _onDetect,
          ),
          // Frame de auxílio visual
          Center(
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.white.withOpacity(0.5), width: 2),
                borderRadius: BorderRadius.circular(30),
              ),
              child: Center(
                child: Container(
                  width: 200,
                  height: 2,
                  color: Colors.red.withOpacity(0.5), // Linha de scan
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
