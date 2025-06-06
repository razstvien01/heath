import 'dart:io';
import 'dart:typed_data';

import 'package:mobile/models/hive_models/stored_record.dart';

class RecordModel {
  RecordModel({
    required this.createdAt, 
    required this.amount,
    required this.reason,
    this.receipt,
    required this.signature,
    this.receiptFile,
    this.viewModelGuid,
    required this.isSynced,
    this.receiptUrl,
    required this.guid,
    this.runningBalance = 0
  });

  final DateTime createdAt;
  final String reason;
  final double amount;
  Uint8List? receipt;
  final String? receiptUrl;
  final String signature;
  final File? receiptFile;
  final bool isSynced;
  final String? viewModelGuid;
  final String guid;
  double runningBalance;

  bool hasReceipt() {
    return (receiptUrl != null && receiptUrl!.isNotEmpty) || (receipt != null) || (receiptFile != null);
  }

  factory RecordModel.fromServer(String guid, Map<String, dynamic> json) {
    dynamic amountJson = json['amount'];
    double amountValue;
    if(amountJson is int) {
      amountValue = amountJson.toDouble();
    } else if(amountJson is double) {
      amountValue = amountJson;
    } else {
      amountValue = 0;
    }

    return RecordModel(
      createdAt: DateTime.parse(json['createdAt']),
      reason: json['reason'],
      amount: amountValue,
      signature: json['signature'],
      isSynced: true,
      receiptUrl: json['receiptUrl'],
      guid: guid
    );
  }

  factory RecordModel.fromLocal(StoredRecord record, bool isSynced) {
    return RecordModel(
      createdAt: record.createdAt,
      reason: record.reason,
      amount: record.amount,
      receiptFile: record.receiptFilePath == null ? null : File(record.receiptFilePath!),
      receipt: record.receipt,
      signature: record.signature,
      isSynced: isSynced,
      viewModelGuid: record.viewModelGuid,
      guid: record.guid
    );
  }
}