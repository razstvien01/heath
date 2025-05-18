import 'package:flutter/material.dart';
import 'package:mobile/screens/record_list/record_list.dart';

class HeathApp extends StatelessWidget {
  const HeathApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Records',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const RecordList(),
    );
  }
}