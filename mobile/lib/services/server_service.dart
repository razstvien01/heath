import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/utils/api_paths.dart';
import 'package:mobile/utils/env_keys.dart';

class ServerService {
  Future<bool> canConnectToServer() async {
    try {
      final response = await http.get(Uri.http(dotenv.env[EnvKeys.baseUrl]!, ApiPaths.pingUrl));

      if (response.statusCode == 200) {
        return true;
      } 
      return false;
    } on SocketException catch(_) {
        return false;
    }
  }

  Future<Result<Uint8List>> getImage(String imageUrl) async {
    var result = Result<Uint8List>(Uint8List(0));
    try {
      final response = await http.get(Uri.http(dotenv.env[EnvKeys.baseUrl]!, imageUrl));
      result.value = response.bodyBytes;
    } on SocketException catch(_) {
        result.exceptions.add(Exception('Cannot connect to Server'));
    }
    return result;
  }
}