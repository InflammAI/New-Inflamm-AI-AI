@echo off
set PATH=c:\Users\Best\Downloads\inflamm-ai-ai\flutter\bin;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Windows\System32;%PATH%
set FLUTTER_ROOT=c:\Users\Best\Downloads\inflamm-ai-ai\flutter
cd /d "c:\Users\Best\Downloads\inflamm-ai-ai\inflamm-ai\Health_Tracker"
echo Flutter environment setup complete
echo Running: flutter %*
flutter %*
