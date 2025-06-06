import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/screens/record_list/record_list.dart';
import 'package:mobile/services/record_offline_service.dart';
import 'package:mobile/services/server_service.dart';
import 'package:mobile/widgets/check_label.dart';

class RecordTile extends StatefulWidget {
  const RecordTile({
    required this.record, 
    this.runningBalance,
    super.key});

  final RecordModel record;
  final double? runningBalance;

  @override
  State<RecordTile> createState() => _RecordTileState();
}

class _RecordTileState extends State<RecordTile> {
  late RecordModel record;
  bool isLoadingReceipt = false;

  @override
  void initState() {
    super.initState();
    record = widget.record;
    if(record.receiptUrl != null) {
      setState(() {
        isLoadingReceipt = true;
      });
      loadImage();
    }
  }

  String formatDate(DateTime dateTime) {
    DateTime localTime = dateTime.toLocal();
    DateFormat dateFormat = DateFormat('yyyy-MM-dd h:mm a');
    return dateFormat.format(localTime);
  }

  String formatBalance(double balance) {
    return '${balance.toStringAsFixed(2)} Php';
  }

  void loadImage() async {
    final file = await ServerService().getImage(record.receiptUrl!);
    if (!mounted) return;

    setState(() {
      RecordOfflineService().updateReceiptImageDataOfOnlineRecord(record.guid, record.receiptUrl!, file.value);
      record.receipt = file.value;
      isLoadingReceipt = false;
    });
  }

  Image getImageFromBytes(Uint8List bytes) {
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
                if(record.isSynced) getImageFromBytes(record.receipt!) else getImageFromFile(record.receiptFile!),
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

    return list;
  }

  Widget? buildTrailing(BuildContext context) {
    var menuItems = getPopupMenuItems(context);
    return Visibility(
      visible: menuItems.isNotEmpty,
      maintainState: true,
      maintainAnimation: true,
      maintainSize: true,
      child: PopupMenuButton(itemBuilder: (context) => menuItems)
    );
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
                Text(formatBalance(record.runningBalance))
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
        trailing: isLoadingReceipt ? CircularProgressIndicator() : buildTrailing(context),
        isThreeLine: true
      ),
    );
  }
}