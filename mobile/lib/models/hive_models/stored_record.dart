import 'dart:io';
import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/models/api_models/record_model.dart';

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
  Map<String, dynamic>? receipt;
  @HiveField(4)
  File? receiptFile;
  @HiveField(5)
  String signature;
  @HiveField(6)
  DateTime createdAt;
  @HiveField(7)
  bool isSynced;

  StoredRecord({
    required this.guid,
    required this.reason,
    required this.amount,
    this.receipt,
    this.receiptFile,
    required this.signature,
    required this.createdAt,
    required this.isSynced
  });

  factory StoredRecord.fromInput(RecordInputModel input) => StoredRecord(
    guid: input.guid, 
    reason: input.reason, 
    amount: double.parse(input.amount), 
    signature: input.signature ?? "", 
    createdAt: DateTime.now(),
    isSynced: false
  );

  factory StoredRecord.fromRecord(String guid, RecordModel record) => StoredRecord(
    guid: guid,
    reason: record.reason,
    amount: record.amount,
    receipt: record.receipt,
    signature: record.signature,
    createdAt: record.createdAt,
    isSynced: true,
  );
}