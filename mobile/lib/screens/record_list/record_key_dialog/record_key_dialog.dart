import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:mobile/models/dialog_results/record_key_dialog_result.dart';
import 'package:mobile/screens/record_list/record_key_dialog/record_key_tile.dart';
import 'package:mobile/utils/box_names.dart';

class RecordKeyDialog extends StatefulWidget {
  const RecordKeyDialog({super.key});

  @override
  State<RecordKeyDialog> createState() => RecordKeyDialogState();
}

class RecordKeyDialogState extends State<RecordKeyDialog> {
  final TextEditingController guidController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  bool shouldSave = false;
  bool selectKeys = false;

  Future<List<Widget>> getKeyPairs(Function(RecordKeyDialogResult?) onClickConfirmed, Function(RecordKeyDialogResult?) onDeleteConfirmed) async {
    var box = await Hive.openBox(BoxNames.keys);
    return box.toMap().entries.map((pair) => 
      RecordKeyTile(name: pair.key, value: pair.value, onClickConfirmed: onClickConfirmed, onDeleteConfirmed: onDeleteConfirmed)
    ).toList();
  }

  @override
  Widget build(BuildContext context) => 
    Dialog(
      child: Padding(
        padding: const EdgeInsets.all(10.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: guidController,
              decoration: InputDecoration(
                hintText: 'Input Records GUID here',
              ),
            ),
            Row(
              children: [
                Expanded(child: Text("Save")),
                Switch(value: shouldSave, onChanged: (val) => setState(() => shouldSave = val)),
              ]
            ),
            if(shouldSave) TextField(
              controller: nameController,
              decoration: InputDecoration(
                hintText: 'Input Name here',
              ),
            ),
            Row(
              children: [
                Expanded(child: Text("Select from saved keys")),
                Switch(value: selectKeys, onChanged: (val) => setState(() => selectKeys = val)),
              ]
            ),
            if(selectKeys) FutureBuilder<List<Widget>>(
                future: getKeyPairs((result) { 
                  if(result != null) {
                    Navigator.pop(context, result);
                  }
                }, (result) {
                  if(result != null) {
                    setState(() {
                      var keyBox = Hive.box(BoxNames.keys);
                      keyBox.delete(result.name);
                    });
                  }
                }),
                builder: (context, snapshot) { 
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return const Center(child: Text("No saved keys."));
                  }

                  return ListView(
                    shrinkWrap: true,
                    children: snapshot.data!
                  );
                }
            ),
            TextButton(
              onPressed: () {
                final result = RecordKeyDialogResult(key: guidController.text, name: shouldSave ? nameController.text : null);
                Navigator.pop(context, result);
              },
              child: const Text('Confirm')
            ),
          ],
        ),
      )
  );
}