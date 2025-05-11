import 'dart:io';

class RecordModel {
  const RecordModel({
    required this.dateEntered, 
    required this.balance,
    required this.reason,
    required this.receipt,
    required this.signature
  });

  final DateTime dateEntered;
  final String reason;
  final double balance;
  final File? receipt;
  final File? signature;
}