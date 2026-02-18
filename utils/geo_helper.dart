
import 'package:geolocator/geolocator.dart';
import 'dart:math' show cos, sqrt, asin;

class GeoHelper {
  static const double targetLat = 38.456;
  static const double targetLng = -9.123;
  static const double radiusMeters = 100.0;

  /// NOTA TÉCNICA (Relatório):
  /// A função abaixo lida com o fluxo de permissões do GPS.
  /// Primeiro verifica se o serviço está ativo, depois checa a permissão atual.
  /// Se negada, solicita ao utilizador. Essencial para conformidade com Android/iOS.
  static Future<Position> determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('O serviço de localização está desativado.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Permissões de localização negadas.');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      return Future.error('As permissões de localização estão permanentemente negadas.');
    }

    return await Geolocator.getCurrentPosition();
  }

  /// Calcula distância usando Haversine para precisão em metros
  static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    var p = 0.017453292519943295;
    var c = cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a)) * 1000; // Resultado em metros
  }
}
