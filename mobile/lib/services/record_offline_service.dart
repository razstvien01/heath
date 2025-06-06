import 'dart:typed_data';

import 'package:hive/hive.dart';
import 'package:mobile/models/api_models/record_input_model.dart';
import 'package:mobile/models/api_models/record_model.dart';
import 'package:mobile/models/hive_models/stored_record.dart';
import 'package:mobile/models/service_results/result.dart';
import 'package:mobile/utils/box_names.dart';

class RecordOfflineService {
  Future<Result<List<RecordModel>>> fetchLastOnlineRecords(String guid) async {
    List<RecordModel> onlineRecords = [];
    if (await isGuidStored(guid)) {
      final onlineKey = getOnlineBoxKey(guid);
      final boxExists = await Hive.boxExists(onlineKey);
      if (boxExists) {
        final box = await Hive.openBox(onlineKey);
        onlineRecords = box.values
            .map((val) => RecordModel.fromLocal(val, true))
            .toList();
      }
    }
    var result = Result(onlineRecords);
    return result;
  }

  Future<void> storeLastOnlineData(String guid, Result<List<RecordModel>> result) async {
    final box = await Hive.openBox(getOnlineBoxKey(guid));
    await box.clear();
    await box.addAll(result.value.map((record) => StoredRecord.fromRecord(guid, record)));
    await box.close();
  }

  Future<List<RecordModel>> fetchOfflineRecords(String guid) async {
    List<RecordModel> offlineRecords = [];
    if (await isGuidStored(guid)) {
      final boxExists = await Hive.boxExists(getOfflineBoxKey(guid));
      if (boxExists) {
        final box = await Hive.openBox(getOfflineBoxKey(guid));
        offlineRecords = box.values
            .map((val) => RecordModel.fromLocal(val, false))
            .toList();
      }
    }
    return offlineRecords;
  }

  Future updateReceiptImageDataOfOnlineRecord(String guid, String imageUrl, Uint8List imageData) async {
    if (await isGuidStored(guid)) {
      final boxExists = await Hive.boxExists(getOnlineBoxKey(guid));
      if (boxExists) {
        final box = await Hive.openBox<StoredRecord>(getOnlineBoxKey(guid));
        final onlineModel = box.values.firstWhere((onlineData) => onlineData.receiptUrl == imageUrl);
        onlineModel.receipt = imageData;
        onlineModel.save();
        box.close();
        return;
      }
      throw Exception("Online box ${getOnlineBoxKey(guid)} is not found");
    }
  }

  Future<List<StoredRecord>> removeAllOfflineRecords(String guid) async {
    List<StoredRecord> offlineRecords = [];
    if (await isGuidStored(guid)) {
      final boxExists = await Hive.boxExists(getOfflineBoxKey(guid));
      if (boxExists) {
        final box = await Hive.openBox(getOfflineBoxKey(guid));

        for (var key in box.keys) {
          final item = box.get(key);
          if (item != null) {
            offlineRecords.add(item);
          }
        }

        await box.clear();
      }
    }

    return offlineRecords;
  }

  Future<void> addOfflineRecord(RecordInputModel inputModel) async {
    var guid = inputModel.guid;
    if (await isGuidStored(guid)) {
      final box = await Hive.openBox(getOfflineBoxKey(guid));
      box.add(StoredRecord.fromInput(inputModel));
    }
  }

  Future<StoredRecord> removeOfflineRecord(String guid, String viewModelGuid) async {
    if (await isGuidStored(guid)) {
      final box = await Hive.openBox(getOfflineBoxKey(guid));
      final toDeleteItem = box.values.firstWhere((item) {
        if(item is StoredRecord) {
          return item.viewModelGuid == viewModelGuid;
        }
        return false;
      });
      box.delete(toDeleteItem.key);
      return toDeleteItem;
    }
    throw Exception("Guid is not stored");
  }
  
  String getOfflineBoxKey(String guid) => "${guid}_offline";
  String getOnlineBoxKey(String guid) => "${guid}_online";

  Future<bool> isGuidStored(String guid) async {
    var keyBox = await Hive.openBox(BoxNames.keys);
    return keyBox.values.any((key) => key == guid);
  }
}