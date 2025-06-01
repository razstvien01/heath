import 'dart:io';

import 'package:mobile/models/hive_models/stored_record.dart';

class RecordInputModel {
  const RecordInputModel({
    required this.guid,
    required this.amount,
    required this.reason,
    required this.receipt,
    required this.signature,
    required this.createdAt
  });

  final String guid;
  final String reason;
  final String amount;
  final File? receipt;
  final String? signature;
  final DateTime createdAt;

  factory RecordInputModel.fromStorage(String guid, StoredRecord record) => RecordInputModel(
      guid: guid, 
      amount: record.amount.toString(), 
      reason: record.reason, 
      receipt: record.receiptFilePath == null ? null : File(record.receiptFilePath!), 
      createdAt: record.createdAt,
      signature: record.signature);
}
