import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/screens/record_list/record_list.dart';
import 'package:mobile/widgets/check_label.dart';

class RecordTile extends StatelessWidget {
  const RecordTile({
    required this.record, 
    this.runningBalance,
    super.key});

  final RecordModel record;
  final double? runningBalance;

  String formatDate(DateTime dateTime) {
    DateTime localTime = dateTime.toLocal();
    DateFormat dateFormat = DateFormat('yyyy-MM-dd h:mm a');
    return dateFormat.format(localTime);
  }

  String formatBalance(double balance) {
    return '${balance.toStringAsFixed(2)} Php';
  }

  Image getImageFromBuffer(Map<String, dynamic> bufferData) {
    final List<dynamic> intList = bufferData['data'];
    final Uint8List bytes = Uint8List.fromList(intList.cast<int>());
    return Image.memory(bytes);
  }

  Image getImageFromFile(File bufferData) {
    return Image.file(bufferData);
  }

  Image getImageFromString(String base64String) {
    final Uint8List bytes = base64Decode(base64String);
    return Image.memory(bytes);
  }

  List<PopupMenuItem<RecordActions>> getPopupMenuItems(BuildContext context) {
    List<PopupMenuItem<RecordActions>> list = [];
    if(record.hasReceipt()) {
      list.add(PopupMenuItem(
        value: RecordActions.showReceipt,
        child: Text("Show Receipt"),
        onTap: () => showDialog<void>(
          context: context, 
          builder: (BuildContext context) => Dialog(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if(record.isSynced) getImageFromBuffer(record.receipt!) else getImageFromFile(record.receiptFile!),
                const SizedBox(height: 15),
                TextButton(
                  onPressed: () => Navigator.pop(context), 
                  child: const Text('Close')
                )
              ],
            )
          )
        )
      ));
    }

    if(record.signature.isNotEmpty) {
      list.add(PopupMenuItem(
        value: RecordActions.showReceipt,
        child: Text("Show Signature"),
        onTap: () => showDialog<void>(
          context: context, 
          builder: (BuildContext context) => Dialog(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                getImageFromString(record.signature),
                const SizedBox(height: 15),
                TextButton(
                  onPressed: () => Navigator.pop(context), 
                  child: const Text('Close')
                )
              ],
            )
          )
        )
      ));
    }

    list.addAll([
      const PopupMenuItem(
        value: RecordActions.edit,
        child: Text("Edit")
      ),
      const PopupMenuItem(
        value: RecordActions.delete,
        child: Text("Delete")
      ),
      const PopupMenuItem(
        value: RecordActions.sync,
        child: Text("Sync")
      )
    ]);

    return list;
  }
  
  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Row(
          children: <Widget>[
            Expanded(
              child: Row(
                spacing: 3,
                children: [
                  Expanded(child: Text(record.reason)),
                  
                ]
              )
            ),
            Text(formatBalance(record.amount))
          ]
        ),
        subtitle: Column(
          children: <Row>[
            Row(
              children: <Widget>[
                Expanded(
                  child: Row(children: [
                    Icon(Icons.calendar_month, size: 20),
                    Text(formatDate(record.createdAt)),
                  ])
                ),
                Text(formatBalance(runningBalance ?? 0))
              ]
            ),
            Row(
              spacing: 10,
              children: <Widget>[
                CheckLabel(text: 'Receipt', isChecked: record.hasReceipt()),
                CheckLabel(text: 'Signature', isChecked: record.signature.isNotEmpty),
                CheckLabel(text: 'Synced', isChecked: record.isSynced)
              ]
            )
          ]
        ),
        trailing: PopupMenuButton(
            itemBuilder: (BuildContext context) => getPopupMenuItems(context)
        ),
        isThreeLine: true
      ),
    );
  }
}