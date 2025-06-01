import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive/hive.dart';
import 'package:mobile/heath_app.dart';
import 'package:mobile/models/hive_models/stored_record.dart';
import 'package:path_provider/path_provider.dart';

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final dir = await getApplicationDocumentsDirectory();
  Hive.init(dir.path);
  Hive.registerAdapter(StoredRecordAdapter());
  await dotenv.load(fileName: ".env");
  runApp(const HeathApp());
}