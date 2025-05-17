import 'dart:convert';
import 'dart:io';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/utils/api_paths.dart';
import 'package:mobile/utils/env_keys.dart';

class RecordService {
  Future<List<RecordModel>> fetchRecords(String guid) async {
    final response = await http.post(Uri.http(dotenv.env[EnvKeys.baseUrl]!, ApiPaths.recordListUrl), 
      body: {
        'guid': guid
      }
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((e) => RecordModel.fromJson(e)).toList();
    } 
    else if(response.statusCode == 404) {
      return [];
    }
    else {
      throw Exception('Failed to load records');
    }
  }

  Future<Result<bool>> isPublicGuid(String guid) async {
    Result<bool> result = Result(false);
    if(guid.isEmpty) {
      result.exceptions.add(Exception("No GUID yet, please set it by clicking the Key button"));
      return Future.value(result);
    }

    try {
      final response = await http.post(Uri.http(dotenv.env[EnvKeys.baseUrl]!, ApiPaths.isPublicGuidUrl), 
        body: {
          'guid': guid
        }
      );

      if (response.statusCode == 200) {
        result.value = response.body.toLowerCase() == 'true';
        if(!result.value) {
          result.exceptions.add(Exception('Not a valid GUID'));
        }
      } 
      else {
        result.exceptions.add(Exception('Not a valid GUID'));
      }
    } on SocketException catch(e) {
        result.exceptions.add(Exception('Cannot connect to Server'));
    }
    
    return result;
  }
}