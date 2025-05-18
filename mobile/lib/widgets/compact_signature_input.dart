
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:signature/signature.dart';

class CompactSignatureInput extends StatefulWidget {
  const CompactSignatureInput({super.key, required this.onInput});

  final Function(String?) onInput;

  @override
  State<CompactSignatureInput> createState() => _CompactSignatureInputState();
}

class _CompactSignatureInputState extends State<CompactSignatureInput> {
  Uint8List? _signatureBytes;

  Future<void> _openSignatureDialog(Function(Uint8List?) onSignatureConfirmed) async {
    final controller = SignatureController(
      penStrokeWidth: 2,
      penColor: Colors.black,
      exportBackgroundColor: Colors.white,
    );

    Uint8List? result = await showDialog<Uint8List>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Sign Here"),
        content: SizedBox(
          width: double.maxFinite,
          height: 200,
          child: Signature(controller: controller, backgroundColor: Colors.grey[200]!),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(), // cancel
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              if (controller.isNotEmpty) {
                controller.toPngBytes().then((bytes) {
                  onSignatureConfirmed(bytes);
                });
              }
            },
            child: const Text("Save"),
          ),
        ],
      ),
    );

    if (result != null) {
      setState(() {
        _signatureBytes = result;
      });

      String base64Signature = _signatureBytes == null ? "" : base64Encode(_signatureBytes!);
      widget.onInput(base64Signature);
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _openSignatureDialog((bytes) => Navigator.of(context).pop(bytes)),
      child: Container(
        width: double.infinity,
        height: 100,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          borderRadius: BorderRadius.circular(8),
          color: Colors.grey[100],
        ),
        child: _signatureBytes != null
            ? Image.memory(_signatureBytes!, fit: BoxFit.cover)
            : const Center(child: Text("Tap to sign", style: TextStyle(color: Colors.grey))),
      ),
    );
  }
}