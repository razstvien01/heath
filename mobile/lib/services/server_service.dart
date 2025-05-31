import 'dart:io';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
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
}