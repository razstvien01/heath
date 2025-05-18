import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class CompactImageInput extends StatefulWidget {
  const CompactImageInput({super.key, required this.onInput});

  final Function(File?) onInput;

  @override
  State<CompactImageInput> createState() => _CompactImageInputState();
}

class _CompactImageInputState extends State<CompactImageInput> {
  File? _imageFile;

  Future<void> _pickImage(ImageSource source, Function() onImagePicked) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: source);
    
    if (picked != null) {
      setState(() => _imageFile = File(picked.path));
      widget.onInput(_imageFile);
    }
  }

  void _showImageOptions() {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: Wrap(
          children: [
            if (_imageFile != null)
              ListTile(
                leading: const Icon(Icons.fullscreen),
                title: const Text("Preview Image"),
                onTap: () {
                  Navigator.pop(context);
                  showDialog(
                    context: context,
                    builder: (_) => Dialog(
                      child: Image.file(_imageFile!),
                    ),
                  );
                },
              ),
            ListTile(
              leading: const Icon(Icons.photo),
              title: const Text("Choose from Gallery"),
              onTap: () => _pickImage(ImageSource.gallery, () => Navigator.pop(context))
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text("Take Photo"),
              onTap: () => _pickImage(ImageSource.camera, () => Navigator.pop(context))
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _showImageOptions,
      child: Container(
        width: double.maxFinite,
        height: 80,
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey),
          image: _imageFile != null
              ? DecorationImage(image: FileImage(_imageFile!), fit: BoxFit.cover)
              : null,
        ),
        child: _imageFile == null
            ? const Center(child: Icon(Icons.add_a_photo))
            : null,
      ),
    );
  }
}