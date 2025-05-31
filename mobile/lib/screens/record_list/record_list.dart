import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/dialog_results/record_key_dialog_result.dart';
import 'package:mobile/models/hive_models/stored_record.dart';
import 'package:mobile/screens/record_add/record_add.dart';
import 'package:mobile/screens/record_list/record_key_dialog/record_key_dialog.dart';
import 'package:mobile/screens/record_list/record_tile.dart';
import 'package:mobile/services/record_service.dart';
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/utils/box_names.dart';

enum RecordActions { showReceipt, showSignature, edit, delete, sync }

class RecordList extends StatefulWidget {
  const RecordList({super.key});

  @override
  State<RecordList> createState() => _RecordListState();
}

class _RecordListState extends State<RecordList> {
  late Future<Result<List<RecordModel>>> futureRecords = Future.value(Result([]));
  late Queue<Exception>? errors = Queue();
  String guid = "";
  bool offlineMode = false;

  @override
  void initState() {
    super.initState();
    fetchRecords();
  }

  String getOfflineBoxKey(String guid) => "${guid}_offline";
  String getOnlineBoxKey(String guid) => "${guid}_online";

  Future<void> fetchRecords() async {
    Result<bool> isValidGuid = await validateGuid(guid);
    errors = isValidGuid.exceptions;

    setState(() {
      if (!isValidGuid.value) {
        futureRecords = Future.value(Result([]));
        return;
      }

      if (offlineMode) {
        futureRecords = fetchCombinedRecordsOffline();
      } else {
        futureRecords = fetchCombinedRecordsOnline();
      }
    });
  }

  Future<Result<bool>> validateGuid(String guid) {
    Result<bool> result = Result(false);
    if(guid.isEmpty) {
      result.exceptions.add(Exception("No GUID yet, please set it by clicking the Key button"));
      return Future.value(result);
    } 

    if(!offlineMode) {
      return RecordService().isPublicGuid(guid);
    }

    result.value = true;
    return Future.value(result);
  }

  Future<Result<List<RecordModel>>> fetchCombinedRecordsOffline() async {
    var lastOnlineRecords = await fetchLastOnlineRecords();
    return combineAndSortRecords(await fetchOfflineRecords(), lastOnlineRecords.value);
  }

  Future<Result<List<RecordModel>>> fetchCombinedRecordsOnline() async {
    var onlineRecords = await RecordService().fetchRecords(guid);
    if (await isGuidStored(guid)) {
      storeLastOnlineData(onlineRecords);
    }

    return combineAndSortRecords(await fetchOfflineRecords(), onlineRecords.value);
  }

  Future<Result<List<RecordModel>>> combineAndSortRecords(List<RecordModel> recordA, List<RecordModel> recordB) {
    var result = Result([...recordA, ...recordB]);
    result.value.sort((a, b) => a.createdAt.compareTo(b.createdAt));
    return Future.value(result);
  }

  Future<void> storeLastOnlineData(Result<List<RecordModel>> result) async {
    final box = await Hive.openBox(getOnlineBoxKey(guid));
    await box.clear();
    await box.addAll(result.value.map((record) => StoredRecord(
        guid: guid,
        reason: record.reason,
        amount: record.amount,
        receipt: record.receipt,
        signature: record.signature,
        createdAt: record.createdAt,
        isSynced: true,
      )));
  }

  Future<Result<List<RecordModel>>> fetchLastOnlineRecords() async {
    // Get offline records if any
    List<RecordModel> onlineRecords = [];
    if (await isGuidStored(guid)) {
      final onlineKey = getOnlineBoxKey(guid);
      final boxExists = await Hive.boxExists(onlineKey);
      if (boxExists) {
        final box = await Hive.openBox(onlineKey);
        onlineRecords = box.values
            .map((val) => RecordModel.fromLocal(val, true))
            .toList();
      }
    }
    var result = Result(onlineRecords);
    return result;
  }

  Future<List<RecordModel>> fetchOfflineRecords() async {
    List<RecordModel> offlineRecords = [];
    if (await isGuidStored(guid)) {
      final boxExists = await Hive.boxExists(getOfflineBoxKey(guid));
      if (boxExists) {
        final box = await Hive.openBox(getOfflineBoxKey(guid));
        offlineRecords = box.values
            .map((val) => RecordModel.fromLocal(val, false))
            .toList();
      }
    }
    return offlineRecords;
  }

  Future<bool> isGuidStored(String guid) async {
    var keyBox = await Hive.openBox(BoxNames.keys);
    return keyBox.values.any((key) => key == guid);
  }

  void retrieveGuid() async {
    var result = await showDialog<RecordKeyDialogResult>(context: context, builder: (context) => RecordKeyDialog());
    String? currentName;
    if(result != null) {
      guid = result.key;
      currentName = result.name;
    }
    
    if(guid.isNotEmpty) {
      if(currentName != null) {
        var keyBox = Hive.box(BoxNames.keys);
        keyBox.put(currentName, guid);
      }

      fetchRecords();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Record List'),
        actions: [
          IconButton(
            onPressed: retrieveGuid, 
            icon: Icon(Icons.vpn_key)
          ),
          if(errors != null && errors!.isEmpty) IconButton(
            onPressed: () async { 
              var shouldRefresh = await Navigator.of(context).push<bool>(MaterialPageRoute(builder: (context) => RecordAdd(recordGuid: guid)));
              if(shouldRefresh != null && shouldRefresh) {
                fetchRecords();
              }
            },
            icon: Icon(Icons.add)
          )
        ],
      ),
      body: FutureBuilder<Result<List<RecordModel>>>(
        future: futureRecords, 
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (errors!.isNotEmpty) {
            return Center(child: Text('${errors!.first}'));
          }

          final results = snapshot.data!;

          if (results.exceptions.isNotEmpty) {
            return Center(child: Text('${results.exceptions.first}'));
          }

          if (results.value.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [ 
                  Text('No Records Found'),
                  OutlinedButton(
                    onPressed: fetchRecords,
                    child: Text('Refresh'),
                  )
                ]
              )
            );
          }
        
          return RefreshIndicator(
            onRefresh: fetchRecords,
            child: ListView(
              children: results.value.map((record) => RecordTile(record: record)).toList()
            ) 
          );
        }
      )
    );
  }
}