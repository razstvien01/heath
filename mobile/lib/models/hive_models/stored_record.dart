import 'dart:typed_data';

import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:uuid/uuid.dart';

part 'stored_record.g.dart';

@HiveType(typeId: 0)
class StoredRecord extends HiveObject {
  @HiveField(0)
  String guid;
  @HiveField(1)
  String reason;
  @HiveField(2)
  double amount;
  @HiveField(3)
  Uint8List? receipt;
  @HiveField(4)
  String? receiptFilePath;
  @HiveField(5)
  String signature;
  @HiveField(6)
  DateTime createdAt;
  @HiveField(7)
  bool isSynced;
  @HiveField(8)
  String? viewModelGuid;
  @HiveField(9)
  String? receiptUrl;

  StoredRecord({
    required this.guid,
    required this.reason,
    required this.amount,
    this.receipt,
    this.receiptFilePath,
    this.receiptUrl,
    this.viewModelGuid,
    required this.signature,
    required this.createdAt,
    required this.isSynced
  });

  factory StoredRecord.fromInput(RecordInputModel input) => StoredRecord(
    guid: input.guid, 
    reason: input.reason, 
    amount: double.parse(input.amount), 
    receiptFilePath: input.receipt?.path,
    signature: input.signature ?? "", 
    createdAt: input.createdAt,
    isSynced: false,
    viewModelGuid: Uuid().v4()
  );

  factory StoredRecord.fromRecord(String guid, RecordModel record) => StoredRecord(
    guid: guid,
    reason: record.reason,
    amount: record.amount,
    receipt: record.receipt,
    signature: record.signature,
    createdAt: record.createdAt,
    isSynced: true,
    viewModelGuid: record.viewModelGuid,
    receiptUrl: record.receiptUrl
  );
}