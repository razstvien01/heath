import 'dart:io';

import 'package:flutter/material.dart';
import 'package:mobile/models/record_model.dart';
import 'package:mobile/screens/record_tile.dart';

enum RecordActions { showReceipt, showSignature, edit, delete, sync }

class RecordList extends StatefulWidget {
  const RecordList({super.key});

  @override
  State<RecordList> createState() => _RecordListState();
}

class _RecordListState extends State<RecordList> {
  static List<RecordModel> records = [
    RecordModel(dateEntered: DateTime(2024, 5, 12), balance: 120, reason: 'Office Supplies Again', receipt: File(''), signature: null),
    RecordModel(dateEntered: DateTime(2024, 5, 9), balance: 100, reason: 'Office Supplies', receipt: null, signature: File(''))
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Record List'),
      ),
      body: ListView(
        children: records.map((record) => RecordTile(record: record)).toList()
      )
    );
  }
}