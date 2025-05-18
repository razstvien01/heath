import 'package:flutter/material.dart';
import 'package:mobile/models/dialog_results/record_key_dialog_result.dart';
import 'package:mobile/widgets/confirm_dialog.dart';

class RecordKeyTile extends StatelessWidget {
  final String name, value;
  final Function(RecordKeyDialogResult?) onClickConfirmed;
  final Function(RecordKeyDialogResult?) onDeleteConfirmed;

  const RecordKeyTile({super.key, required this.name, required this.value, required this.onClickConfirmed, required this.onDeleteConfirmed});

  @override
  Widget build(BuildContext context) {
    return Card(
        child: InkWell(
          onTap: () async {
            var confirmed = await showDialog<bool>(
              context: context, 
              builder: (context) => ConfirmDialog(title: "Confirm Select", text: "Do you want to select $value?")
            );

            if(confirmed != null) {
              final result = RecordKeyDialogResult(key: confirmed ? value : "", name: null);
              onClickConfirmed(confirmed ? result : null);
            }
          },
          child: ListTile(
            title: Text(name),
            subtitle: Text(value),
            trailing: IconButton(onPressed: () async {
              var confirmed = await showDialog<bool>(
                context: context, 
                builder: (context) => ConfirmDialog(title: "Confirm Delete", text: "Do you want to delete $value?")
              );

              if(confirmed != null) {
                final result = RecordKeyDialogResult(key: value, name: name);
                onDeleteConfirmed(confirmed ? result : null);
              }
            }, icon: Icon(Icons.delete)),
          )
        )
      );
  }
}