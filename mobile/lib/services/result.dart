import 'dart:collection';

class Result<T> {
  late T value;
  Queue<Exception> exceptions = Queue();

  Result(this.value);
}