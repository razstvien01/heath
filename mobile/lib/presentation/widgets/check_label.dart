import 'package:flutter/material.dart';

class CheckLabel extends StatelessWidget {
  const CheckLabel({super.key, required this.text, required this.isChecked});

  final String text;
  final bool isChecked;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Text('$text: '),
        Icon(
          isChecked ? Icons.check_circle_outlined : Icons.circle_outlined, 
          color: isChecked ? Colors.green : Colors.red),
      ],
    );
  }
}