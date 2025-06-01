import 'dart:collection';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/services/record_offline_service.dart';
import 'package:mobile/widgets/compact_image_input.dart';
import 'package:mobile/widgets/compact_signature_input.dart';

class RecordAdd extends StatefulWidget {
  const RecordAdd({super.key, required this.recordGuid});

  final String recordGuid;

  @override
  State<RecordAdd> createState() => _RecordAddState();
}

class _RecordAddState extends State<RecordAdd> {
  final TextEditingController amountController = TextEditingController();
  final TextEditingController reasonController = TextEditingController();
  File? fileInput;
  String? signatureInput;

  @override
  void initState() {
    super.initState();
    fileInput = null;
    signatureInput = null;
  }

  void onSubmit(Function(Queue<Exception>) onErrors, Function() onSuccess) async {
    await RecordOfflineService().addOfflineRecord(RecordInputModel(
      guid: widget.recordGuid, 
      amount: amountController.text, 
      reason: reasonController.text, 
      receipt: fileInput, 
      signature: signatureInput,
      createdAt: DateTime.now()));

    if(!context.mounted) return;
    onSuccess();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text('Record Add')
      ),
      body: Column(
        spacing: 10,
        children: [
          TextField(
            controller: amountController,
            keyboardType: TextInputType.number,
            inputFormatters: <TextInputFormatter>[
              FilteringTextInputFormatter.digitsOnly
            ],
            decoration: InputDecoration(
              labelText: "Amount",
              hintText: "Enter amount"
            )
          ),
          TextField(
            controller: reasonController,
            decoration: InputDecoration(
              labelText: "Reason",
              hintText: "Enter reason"
            )
          ),
          Align(alignment: Alignment.centerLeft, child: Text("Receipt", style: TextStyle(fontSize: 16))),
          CompactImageInput(onInput: (input) => fileInput = input),
          Align(alignment: Alignment.centerLeft, child: Text("Signature", style: TextStyle(fontSize: 16))),
          CompactSignatureInput(onInput: (input) => signatureInput = input),
          SizedBox(
            width: double.maxFinite,
            child: ElevatedButton(
              onPressed: () => onSubmit((exceptions) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text("An error occurred: ${exceptions.first}"),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              () {
                Navigator.pop(context, true);
              }), 
              child: Text("Save")
            ),
          )
        ]
      )
    );
  }
}