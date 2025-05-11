import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:mobile/models/record_model.dart';
import 'package:mobile/screens/record_tile.dart';
import 'package:mobile/services/record_service.dart';
import 'package:mobile/services/result.dart';

enum RecordActions { showReceipt, showSignature, edit, delete, sync }

class RecordList extends StatefulWidget {
  const RecordList({super.key});

  @override
  State<RecordList> createState() => _RecordListState();
}

class _RecordListState extends State<RecordList> {
  final TextEditingController guidController = TextEditingController();
  late Future<List<RecordModel>> futureRecords = Future.value([]);
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
        futureRecords = Future.value([]);
      } else {
        futureRecords = RecordService().fetchRecords(guid);
      }
    });
  }

  void onGuidChange() {
    guid = guidController.text.trim();
    fetchRecords();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Record List'),
        actions: [
          IconButton(onPressed: () => showDialog(context: context, 
            builder: (BuildContext context) => Dialog(
                        child: Padding(
                          padding: const EdgeInsets.all(5.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              TextField(
                                controller: guidController,
                                decoration: InputDecoration(
                                  hintText: 'Input Records GUID here',
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  onGuidChange();
                                  Navigator.pop(context);
                                },
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        )
            )), 
            icon: Icon(Icons.vpn_key))
        ],
      ),
      body: FutureBuilder<List<RecordModel>>(
        future: futureRecords, 
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (errors!.isNotEmpty) {
            return Center(child: Text('${errors!.first}'));
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final records = snapshot.data!;

          if (records.isEmpty) {
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
              children: records.map((record) => RecordTile(record: record)).toList()
            ) 
          );
        }
      )
    );
  }
}