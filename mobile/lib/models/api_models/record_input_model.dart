import 'dart:io';

class RecordInputModel {
  const RecordInputModel({
    required this.guid,
    required this.amount,
    required this.reason,
    required this.receipt,
    required this.signature
  });

  final String guid;
  final String reason;
  final String amount;
  final File? receipt;
  final String? signature;
}