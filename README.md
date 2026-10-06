# Psalms Learning Suite 🕊️📖

[![Release](https://img.shields.io/github/v/release/gregvruggink/psalms-learning-suite?color=blue&label=Latest%20Release)](https://github.com/gregvruggink/psalms-learning-suite/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-informational)](https://github.com/gregvruggink/psalms-learning-suite/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, offline-ready desktop learning environment designed for biblical studies students, pastors, and scholars exploring the Book of Psalms, Hebrew poetic forms, and form-critical hermeneutics.

---

## 📥 Download & Install

Head over to the **[Latest GitHub Releases](https://github.com/gregvruggink/psalms-learning-suite/releases/latest)** to download the installer for your computer:

| Operating System | Download File | Installation Instructions |
| :--- | :--- | :--- |
| **Windows** | `Psalms-Learning-Suite-Setup-*.exe` | Run the installer and follow the setup wizard. Desktop and Start Menu shortcuts will be created automatically. |
| **macOS** | `Psalms-Learning-Suite-*-arm64.dmg` / `.zip` | Open the `.dmg` file and drag **Psalms Learning Suite** into your **Applications** folder. *(See note below for first launch)* |
| **Web & Brightspace / LMS** | `BIB523_Psalms_Interactive_Learning_Suite_All_In_One.html` | Single self-contained file with all 11 studios. Upload directly to Brightspace or open in any browser! |

> [!NOTE]
> **First-time launch on macOS:**
> Because this open-source application is distributed outside the Apple App Store, macOS Gatekeeper may display a prompt on first opening. Simply **Right-click (or Control-click)** the app icon in Applications and choose **Open**, or go to **System Settings > Privacy & Security** and click **Open Anyway**.

---

## ✨ Features & Included Interactive Studios

The suite connects seven dedicated learning environments into a unified desktop dashboard:

1. **Psalms Explorer & Form-Critical Atlas**:
   - Interactive database of all 150 psalms categorized by genre (Lament, Hymn of Praise, Thanksgiving, Kingship/Royal, Wisdom/Torah, Trust, Pilgrimage, Liturgical, Historical, Imprecatory).
   - Form-critical outlines, structural diagrams, and theological themes.
2. **Poetic Devices Tutor & Practice Gym**:
   - Master 10 key Hebrew poetic forms (Parallelism, Chiasm, Inclusio, Merism, Acrostic, etc.).
   - Interactive diagnostic drills with instant feedback, scoring, and mastery tracking.
3. **Lament Soul-Care Diagnostic Studio**:
   - Interactive anatomy of the 6-part lament structure (Address, Complaint, Confession of Trust, Petition, Assurance of Being Heard, Vow of Praise).
4. **Quadriga Four-Senses Hermeneutics Studio**:
   - Explore traditional and historical interpretation: Literal (*Historical*), Allegorical (*Christological*), Tropological (*Moral/Soul-Care*), and Anagogical (*Eschatological*).
5. **Psalm 119 Acrostic Synonyms Studio**:
   - In-depth study of the 8 Torah synonyms (Torah, Edot, Piqqudim, Mitsvot, Mishpatim, Chuqqim, Dabar, Imrah) across the 22 Hebrew alphabet strophes.
6. **Songs of Ascents Pilgrimage (Psalms 120–134)**:
   - Follow the topographical journey from the hostile borders of Meshech/Kedar up to the Temple Mount in Jerusalem.
7. **Hebrew Key Word Studies & Expository Sermon Studio**:
   - Deep-dive word studies on *B-R-K* (Bless), *Ḥesed* (Covenant Loyalty), and *Qodesh* (Holiness).
   - Hebrew transliteration quick reference guide (Academic SBL & Simplified).
   - Homiletical sermon outline editor with student note saving.

---

## 💾 State Persistence (Saved Progress)

All student progress, quiz scores, mastered poetic devices, theme settings (Light/Dark mode), transliteration toggles, and sermon notes are automatically saved to your local machine:
- **Windows**: `%APPDATA%\psalms-learning-suite`
- **macOS**: `~/Library/Application Support/psalms-learning-suite`

Your saved data is isolated from the application code and **will not be lost when updating to new versions** of the suite.

---

## 🔄 Automatic Updates Architecture

The app is equipped with automatic update detection powered by `electron-updater` connected directly to GitHub Releases:

1. **Automatic Detection**: Every time you launch the app with an active internet connection, it checks the GitHub Releases feed quietly in the background.
2. **Non-Intrusive Prompt**: When a new release is detected (e.g. `v1.0.1`), a modal will ask if you want to download the update in the background while continuing your study.
3. **Seamless Restart**: Once downloaded, the app offers to restart and apply the update.
4. **Manual Check**: You can manually check for updates at any time by selecting **Help > Check for Updates...** in the top menu bar.

---

## 🛠️ Developer & Instructor Guide (Pushing Updates)

As the course instructor, when you want to add new content, tweak interactive exercises, or push bug fixes:

### 1. Test Locally
Run the app in development mode on your machine:
```bash
cd psalms-learning-suite
npm install
npm start
```

### 2. Prepare an Update
1. Make your changes in `src/`.
2. Open `package.json` and increment the version number:
   ```json
   "version": "1.0.1"
   ```
3. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Add new exercises and improvements for v1.0.1"
   git push origin main
   ```

### 3. Trigger the Cloud Build & Release
Tag the new version and push the tag to GitHub:
```bash
git tag v1.0.1
git push origin v1.0.1
```

**That's it!** GitHub Actions will automatically:
1. Spin up Windows and macOS virtual runners.
2. Compile `Psalms.Learning.Suite.Setup.1.0.1.exe` and `Psalms.Learning.Suite-1.0.1.dmg`.
3. Create a public release on GitHub and publish the installers.
4. Existing installed apps across all student computers will immediately detect the update on next launch and prompt to install!

---

## 📄 License
This educational software is open-source and licensed under the [MIT License](LICENSE).
