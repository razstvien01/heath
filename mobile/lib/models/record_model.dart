import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

class RecordModel {
  const RecordModel({
    required this.createdAt, 
    required this.amount,
    required this.reason,
    required this.receipt,
    required this.signature
  });

  final DateTime createdAt;
  final String reason;
  final double amount;
  final Map<String, dynamic> receipt;
  final String signature;

  bool hasReceipt() {
    dynamic receiptValue = receipt['data'];
    if(receiptValue is List) {
      return receiptValue.isNotEmpty;
    }
    return false;
  }

  factory RecordModel.fromJson(Map<String, dynamic> json) {
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
    );
  }
}