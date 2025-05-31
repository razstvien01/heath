import 'package:flutter/material.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/screens/record_list/record_tile.dart';
import 'package:mobile/services/record_offline_service.dart';

class RecordTileDismissible extends StatelessWidget {
  RecordTileDismissible({
    required this.guid,
    required this.record, 
    required this.canSync,
    required this.onSync,
    super.key});

  final String guid;
  final RecordModel record;
  final bool canSync;
  final Function onSync;

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
      confirmDismiss: (direction) {
        if (direction == DismissDirection.startToEnd) {
          return Future.value(true);
        } else if (direction == DismissDirection.endToStart) {
          onSync();
        }
        return Future.value(false);
      },
      onDismissed: (direction) {
        recordOfflineService.removeOfflineRecord(guid, record.viewModelGuid!);
      },
    );
  }
}