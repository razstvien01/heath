import 'package:flutter/material.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/screens/record_list/record_tile.dart';
import 'package:mobile/services/record_offline_service.dart';

class RecordTileDismissible extends StatelessWidget {
  RecordTileDismissible({
    required this.guid,
    required this.record, 
    required this.canSync,
    super.key});

  final String guid;
  final RecordModel record;
  final bool canSync;

  final RecordOfflineService recordOfflineService = RecordOfflineService();

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
      child: RecordTile(record: record),
      onDismissed: (direction) {
        if (direction == DismissDirection.startToEnd) {
          recordOfflineService.removeOfflineRecord(guid, record.viewModelGuid!);
        } else if (direction == DismissDirection.endToStart) {
        }
      },
    );
  }
}