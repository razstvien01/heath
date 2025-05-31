import 'dart:io';

import 'package:mobile/models/hive_models/stored_record.dart';

class RecordModel {
  const RecordModel({
    required this.createdAt, 
    required this.amount,
    required this.reason,
    this.receipt,
    required this.signature,
    this.receiptFile,
    required this.isSynced
  });

  final DateTime createdAt;
  final String reason;
  final double amount;
  final Map<String, dynamic>? receipt;
  final String signature;
  final File? receiptFile;
  final bool isSynced;

  bool hasReceipt() {
    if(receipt == null) return false;

    dynamic receiptValue = receipt!['data'];
    if(receiptValue is List) {
      return receiptValue.isNotEmpty;
    }
    return false;
  }

  factory RecordModel.fromServer(Map<String, dynamic> json) {
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
      receipt: json['receipt'],
      signature: json['signature'],
      isSynced: true
    );
  }

  factory RecordModel.fromLocal(StoredRecord record, bool isSynced) {
    return RecordModel(
      createdAt: record.createdAt,
      reason: record.reason,
      amount: record.amount,
      receiptFile: record.receiptFile,
      receipt: record.receipt,
      signature: record.signature,
      isSynced: isSynced
    );
  }
}