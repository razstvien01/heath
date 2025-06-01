import 'dart:convert';
import 'dart:io';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/utils/api_paths.dart';
import 'package:mobile/utils/env_keys.dart';

class RecordService {
  Future<Result<List<RecordModel>>> fetchRecords(String guid) async {
    Result<List<RecordModel>> result = Result([]);
    final response = await http.post(Uri.http(dotenv.env[EnvKeys.baseUrl]!, ApiPaths.recordListUrl), 
      body: {
        'guid': guid
      }
    );

    if (response.statusCode == 200) {
      final List<dynamic> jsonList = jsonDecode(response.body);
      result.value = jsonList.map((e) => RecordModel.fromServer(e)).toList();
    } 
    else if(response.statusCode != 404) {
      result.exceptions.add(Exception("Failed to fetch Records"));
    }

    return result;
  }

  Future<Result<bool>> isPublicGuid(String guid) async {
    Result<bool> result = Result(false);

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
    } on SocketException catch(_) {
        result.exceptions.add(Exception('Cannot connect to Server'));
    }
    
    return result;
  }

  Future<Result<void>> addRecords(List<RecordInputModel> inputModels) async {
    Result<void> result = Result(null);
    List<Map<String, dynamic>> records = [];

    var request = http.MultipartRequest('POST', Uri.http(dotenv.env[EnvKeys.baseUrl]!, ApiPaths.syncUrl));

    for(int i = 0; i < inputModels.length; i++)
    {
      var inputModel = inputModels[i];

      if(inputModel.reason.isEmpty) {
        result.exceptions.add(Exception("Reason is not provided on one of the data"));
        return result;
      } 

      Map<String, dynamic> jsonData = {
        'guid': inputModel.guid,
        'amount': inputModel.amount,
        'reason': inputModel.reason,
        'createdAt': inputModel.createdAt.toUtc().toIso8601String()
      };

      if(inputModel.signature != null) {
        jsonData['signature'] = inputModel.signature!;
      }

      records.add(jsonData);

      if(inputModel.receipt != null) {
        request.files.add(await http.MultipartFile.fromPath('receipt-$i', inputModel.receipt!.path));
      }
    }

    request.fields.addAll({
      'records': jsonEncode(records)
    });

    var response = await request.send();

    if (response.statusCode != 200) {
      result.exceptions.add(Exception("Failed to sync Record"));
    } 

    return result;
  }
}