
# Configurações de Permissões Nativas

Estes blocos devem ser inseridos nos respectivos arquivos nativos para que o Flutter consiga aceder ao Hardware.

## 1. Android (android/app/src/main/AndroidManifest.xml)
Adicione estas linhas dentro da tag `<manifest>`, mas fora da tag `<application>`:

```xml
<!-- Permissões para Câmara (Scanner QR) -->
<uses-permission android:name="android.permission.CAMERA" />

<!-- Permissões para GPS (Validação de Proximidade) -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Permissão para Internet (Sincronização) -->
<uses-permission android:name="android.permission.INTERNET" />
```

## 2. iOS (ios/Runner/Info.plist)
Adicione estas chaves dentro da tag `<dict>`:

```xml
<key>NSCameraUsageDescription</key>
<string>A aplicação ISTEC Check-in necessita de aceder à câmara para ler os códigos QR das salas de aula.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>A sua localização é necessária para confirmar que se encontra no campus do ISTEC no momento do check-in.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>A sua localização é necessária para confirmar a sua presença nas instalações do ISTEC.</string>
```
