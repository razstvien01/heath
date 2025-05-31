import 'package:flutter/material.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/screens/record_list/record_tile.dart';

class RecordTileDismissible extends StatelessWidget {
  const RecordTileDismissible({
    required this.record, 
    required this.canSync,
    super.key});

  final RecordModel record;
  final bool canSync;

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(key), 
      direction: canSync ? DismissDirection.horizontal : DismissDirection.startToEnd,
      background: Container(
        alignment: Alignment.centerLeft,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Icon(Icons.delete_outlined, color: Colors.deepPurple),
      ),
      secondaryBackground: Container(
        alignment: Alignment.centerRight,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Icon(Icons.sync, color: Colors.deepPurple),
      ),
      child: RecordTile(record: record)
    );
  }
}