// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'stored_record.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class StoredRecordAdapter extends TypeAdapter<StoredRecord> {
  @override
  final int typeId = 0;

  @override
  StoredRecord read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return StoredRecord(
      guid: fields[0] as String,
      reason: fields[1] as String,
      amount: fields[2] as double,
      receipt: (fields[3] as Map?)?.cast<String, dynamic>(),
      receiptFile: fields[4] as File?,
      signature: fields[5] as String,
      createdAt: fields[6] as DateTime,
      isSynced: fields[7] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, StoredRecord obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.guid)
      ..writeByte(1)
      ..write(obj.reason)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.receipt)
      ..writeByte(4)
      ..write(obj.receiptFile)
      ..writeByte(5)
      ..write(obj.signature)
      ..writeByte(6)
      ..write(obj.createdAt)
      ..writeByte(7)
      ..write(obj.isSynced);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is StoredRecordAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
