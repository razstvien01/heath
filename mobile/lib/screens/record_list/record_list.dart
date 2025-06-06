import 'dart:async';
import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/dialog_results/record_key_dialog_result.dart';
import 'package:mobile/screens/record_add/record_add.dart';
import 'package:mobile/screens/record_list/record_key_dialog/record_key_dialog.dart';
import 'package:mobile/screens/record_list/record_tile_dismissible.dart';
import 'package:mobile/screens/record_list/record_tile.dart';
import 'package:mobile/services/record_offline_service.dart';
import 'package:mobile/services/record_service.dart';
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/services/server_service.dart';
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
  RecordOfflineService recordOfflineService = RecordOfflineService();
  String guid = "";
  ValueNotifier<bool> offlineMode = ValueNotifier(false);
  Timer? connectivityTimer;

  @override
  void initState() {
    super.initState();
    fetchRecords();
    checkServerStatus();
    startConnectivityCheckTimer();
  }

  @override
  void dispose() {
    connectivityTimer?.cancel();
    super.dispose();
  }

  void startConnectivityCheckTimer() {
    connectivityTimer = Timer.periodic(Duration(seconds: 10), (_) async {
      checkServerStatus();
    });
  }

  void checkServerStatus() async {
    offlineMode.value = !await ServerService().canConnectToServer();
  }

  Future<void> fetchRecords() async {
    Result<bool> isValidGuid = await validateGuid(guid);
    errors = isValidGuid.exceptions;

    setState(() {
      if (!isValidGuid.value) {
        futureRecords = Future.value(Result([]));
        return;
      }

      if (offlineMode.value) {
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

    if(!offlineMode.value) {
      return RecordService().isPublicGuid(guid);
    }

    result.value = true;
    return Future.value(result);
  }

  Future<Result<List<RecordModel>>> fetchCombinedRecordsOffline() async {
    var lastOnlineRecords = await recordOfflineService.fetchLastOnlineRecords(guid);
    return combineAndSortRecords(await recordOfflineService.fetchOfflineRecords(guid), lastOnlineRecords.value);
  }

  Future<Result<List<RecordModel>>> fetchCombinedRecordsOnline() async {
    var onlineRecords = await RecordService().fetchRecords(guid);
    if (await recordOfflineService.isGuidStored(guid)) {
      recordOfflineService.storeLastOnlineData(guid, onlineRecords);
    }

    return combineAndSortRecords(await recordOfflineService.fetchOfflineRecords(guid), onlineRecords.value);
  }

  Future<Result<List<RecordModel>>> combineAndSortRecords(List<RecordModel> recordA, List<RecordModel> recordB) {
    var result = Result([...recordA, ...recordB]);
    result.value.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    
    double runningBalance = 0;
    for (var record in result.value.reversed) {
      runningBalance += record.amount;
      record.runningBalance = runningBalance;
    }
    return Future.value(result);
  }

  void retrieveGuid() async {
    var result = await showDialog<RecordKeyDialogResult>(context: context, builder: (context) => RecordKeyDialog(offlineMode: offlineMode));
    String? currentName;
    if(result != null) {
      guid = result.key;
      currentName = result.name;
    }
    
    if(guid.isNotEmpty) {
      if(currentName != null) {
        var keyBox = await Hive.openBox(BoxNames.keys);
        keyBox.put(currentName, guid);
      }

      fetchRecords();
    }
  }

  void syncAll() async {
    var offlineItems = await RecordOfflineService().removeAllOfflineRecords(guid);
    await RecordService().addRecords(offlineItems.map((item) => RecordInputModel.fromStorage(guid, item)).toList());
    fetchRecords();
  }

  void syncOne(String viewModelGuid) async {
    var removedRecord = await recordOfflineService.removeOfflineRecord(guid, viewModelGuid);
    await RecordService().addRecords([RecordInputModel.fromStorage(guid, removedRecord)]);
    fetchRecords();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Record List'),
        leading: ValueListenableBuilder(
          valueListenable: offlineMode, 
          builder: (context, isOffline, _) => Icon(
            isOffline ? Icons.cloud_off : Icons.cloud_done,
            color: isOffline ? Colors.red.shade400 : Colors.green.shade600,
          )
        ),
        actions: [
          IconButton(
            onPressed: retrieveGuid, 
            icon: Icon(Icons.vpn_key)
          ),
          if(errors != null && errors!.isEmpty) 
          ValueListenableBuilder(
            valueListenable: offlineMode, 
            builder: (context, isOffline, _) { 
              if(isOffline) return SizedBox();
              return IconButton(onPressed: syncAll, icon: Icon(Icons.cloud_upload));
            }
          ),
          if(errors != null && errors!.isEmpty) 
          IconButton(
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
              children: results.value.map((record) {
                if(record.isSynced) {
                  return RecordTile(record: record);
                } else {
                  return ValueListenableBuilder(
                    valueListenable: offlineMode, 
                    builder: (context, isOffline, _) => RecordTileDismissible(guid: guid, record: record, canSync: !isOffline, 
                      onSync: () => syncOne(record.viewModelGuid!)
                    )
                  );
                }
              }).toList() 
            ) 
          );
        }
      )
    );
  }
}