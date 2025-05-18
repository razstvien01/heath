import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/dialog_results/record_key_dialog_result.dart';
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

  @override
  void initState() {
    super.initState();
    fetchRecords();
  }

  Future<void> fetchRecords() async {
    Result<bool> isValidGuid = await RecordService().isPublicGuid(guid);
    errors = isValidGuid.exceptions;

    setState(() {
      if(!isValidGuid.value) {
        futureRecords = Future.value(Result([]));
      } else {
        futureRecords = RecordService().fetchRecords(guid);
      }
    });
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