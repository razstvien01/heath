# 📱 Mobile App - Heath

## 🚀 Getting Started

These instructions will get your Flutter app up and running on your local machine for development and testing.

### ✅ Prerequisites

Make sure you have the following installed:

- [Flutter SDK](https://flutter.dev/docs/get-started/install)
- [Dart SDK](https://dart.dev/get-dart) (usually comes with Flutter)
- Android Studio / Xcode / VS Code
- A physical device or emulator

Verify your environment with:

```bash
flutter doctor
````

---

### 🛠️ Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd mobile
```

2. **Get the dependencies:**

```bash
flutter pub get
```

---

### ▶️ Running the App

To run the app on an emulator or connected device:

```bash
flutter run
```

To run on a specific platform:

```bash
flutter run -d android   # For Android
flutter run -d ios       # For iOS
```

---

### 🧪 Running Tests

To run all unit and widget tests:

```bash
flutter test
```

---

## 🗂️ Project Structure

```
lib/
├── main.dart         # Entry point of the app
├── screens/          # UI Screens
├── widgets/          # Reusable widgets
├── models/           # Data models
├── services/         # Backend/API services
└── utils/            # Utility functions and constants
```