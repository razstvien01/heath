import 'dart:io';
import 'package:hive/hive.dart';

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
}