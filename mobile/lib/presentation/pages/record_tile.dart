import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/domain/models/record_model.dart';
import 'package:mobile/presentation/pages/record_list.dart';
import 'package:mobile/presentation/widgets/check_label.dart';

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
                  Icon(Icons.calendar_month, size: 20),
                  Text(formatDate(record.dateEntered)),
                ]
              )
            ),
            Text(formatBalance(record.balance))
          ]
        ),
        subtitle: Column(
          children: <Row>[
            Row(
              children: <Widget>[
                Expanded(child: Text(record.reason)),
                Text(formatBalance(runningBalance ?? 0))
              ]
            ),
            Row(
              spacing: 10,
              children: <Widget>[
                CheckLabel(text: 'Receipt', isChecked: record.receipt != null),
                CheckLabel(text: 'Signature', isChecked: record.signature != null)
              ]
            )
          ]
        ),
        trailing: PopupMenuButton(
            itemBuilder: (BuildContext context) => <PopupMenuEntry<RecordActions>>[
            const PopupMenuItem(
              value: RecordActions.showReceipt,
              child: Text("Show Receipt")
            ),
            const PopupMenuItem(
              value: RecordActions.showSignature,
              child: Text("Show Signature")
            ),
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
            ),
          ],
        ),
        isThreeLine: true
      ),
    );
  }
}