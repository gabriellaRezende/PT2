
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/check_in.dart';

class AppState with ChangeNotifier {
  bool _isLoggedIn = false;
  List<CheckInRecord> _history = [];
  
  bool get isLoggedIn => _isLoggedIn;
  List<CheckInRecord> get history => _history;

  AppState() {
    _loadHistory();
  }

  void login(String id, String pass) {
    // Simulação de auth
    if (id.isNotEmpty && pass.isNotEmpty) {
      _isLoggedIn = true;
      notifyListeners();
    }
  }

  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }

  void addRecord(CheckInRecord record) {
    _history.insert(0, record);
    _saveHistory();
    notifyListeners();
  }

  Future<void> _loadHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final String? historyData = prefs.getString('history');
    if (historyData != null) {
      final List decoded = jsonDecode(historyData);
      _history = decoded.map((item) => CheckInRecord.fromJson(item)).toList();
      notifyListeners();
    }
  }

  Future<void> _saveHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final String encoded = jsonEncode(_history.map((e) => e.toJson()).toList());
    await prefs.setString('history', encoded);
  }
}
