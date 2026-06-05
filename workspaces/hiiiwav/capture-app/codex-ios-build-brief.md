# Codex Build Brief — Director for Good (iOS app)

**You are Codex, running on the Mac Mini.** Your job is to scaffold and stand up a native iOS app and get it building. This document is self-contained — you are not expected to have access to the `directorforgood.org` web repo. Everything you need (API contract, build pipeline, credentials, conventions) is below.

> **App name (decided):** the app is **Director for Good** — same brand as the platform (branded house: the app *is* the product, like the Notion app is just "Notion"). Concretely:
> - **App Store name:** "Director for Good" · **home-screen label** (`CFBundleDisplayName`): **"Director"** (the full name is 17 chars and truncates under the icon; "Director" shows clean).
> - **Xcode target / product / scheme:** `Director` · **project:** `Director.xcodeproj`
> - **Bundle id:** `org.directorforgood.app` · **URL scheme:** `directorforgood://`
> - Inside the app, the **fundraising space is "Develop"** — a mode within Director (it maps to the Development Director), not a separate app or brand.

---

## 1. Mission & definition of done

Build the first version of **Director**: a native iOS chat + *artifact* assistant for capturing donor/meeting conversations and turning them into living documents (summaries, action items), plus a time clock. It is a client of an existing backend (see §6); the AI "brain" runs server-side, not on device.

**"Start the iOS build" = reach these gates, in order:**

1. **G1 — Builds & runs in the Simulator.** `make run` launches the app in an iOS Simulator. ✅ is a green build + app on screen.
2. **G2 — Talks to the backend.** From a Settings screen you can enter `API Base URL`, `API Key`, `Org Slug`; the app creates a conversation + message on the server and lists it back.
3. **G3 — Capture loop.** Type (and, if time allows, speak) a brain-dump → it persists locally (SwiftData) and syncs to the server; conversation detail shows messages + any artifacts.
4. **G4 — Time clock.** Start/stop a timer that writes to `/api/time-entries`.
5. **G5 — TestFlight (stretch).** `make beta` archives, exports, and uploads a build. Requires the App Store Connect app record + issuer id (see §8 / §11).

Stop and report after G1–G3 if you hit ambiguity; those are the core. G4/G5 are next.

---

## 2. Context (why this app exists)

- HiiiWAV is going AI-native: one **canonical source of truth** that humans and agents share. This app is the capture surface for it, and the first product toward "Director for Good."
- **The artifact model is the point.** In ChatGPT, when you ask for a summary it regenerates inline every turn and churns. Here, a **conversation** (the message stream) and an **artifact** (the document it produces) are *separate, versioned* objects. You say "change the first paragraph" in chat; the artifact updates in its own pane to a new version, with old versions kept. The app must present these as two distinct things.
- **Surfaces:** iOS (Maya, Miles, Bosko — capture + voice + time clock), web/desktop (Patricia — separate, not your concern), and API/agent access (OpenClaw). You are building the iOS client only.
- **Server-side brain:** generating/iterating artifacts is done by a server endpoint (forthcoming, see §6.4). The app *requests* generation and *displays* results; it does not run an LLM locally.

---

## 3. Prerequisites — verify on the Mac Mini first

Run these and fix anything missing before scaffolding:

```bash
xcodebuild -version            # Xcode present
xcrun simctl list runtimes     # at least one iOS runtime
which xcodegen || brew install xcodegen
swift --version
# For the TestFlight phase (G5) only:
ls ~/.appstoreconnect/private_keys/AuthKey_D6NXZNBW6Q.p8   # ASC API key present
```

If `xcodegen` or an iOS Simulator runtime is missing, install it. If Xcode itself is not installed, **stop and tell Bosko** — that's a manual App Store install.

---

## 4. Conventions — match Bosko's existing iOS apps

This setup has a proven pattern across ~5 SwiftUI apps. **Follow it; do not invent a new one.**

- **SwiftUI + SwiftData** (not CoreData), **iOS 17+**, Swift 5.9.
- **XcodeGen** — the `.xcodeproj` is generated from `project.yml`; never hand-edit the project file.
- **No third-party SPM dependencies** unless truly necessary. Use Foundation `URLSession`, Apple `Speech`/`AVFoundation` for voice.
- **Local-first + sync**: models persist locally; a sync client pushes to the server and records the remote id (mirrors the `MileageTracker` → `FOSAPIClient` pattern).
- **Secrets never in source**: API key/base URL live in Settings → Keychain/`UserDefaults`, entered by hand.
- **Makefile** drives build/run/ship.

**Reference apps (if present on this machine under `~/GitHub`):** `Mileage-Tracker` (URL-scheme control + `FOSAPIClient` sync actor + Settings pattern) and `timebot` (the gold Makefile with App Store Connect API-key auth). If they exist locally, read them and copy patterns directly. If not, the templates in §5/§7 are sufficient.

---

## 5. Project layout to create

Create a **new git repo / directory** for the app (NOT inside any web repo):

```
~/GitHub/director-ios/
├── project.yml
├── Makefile
├── ExportOptions.plist
├── .asc-credentials            # gitignored — secrets
├── .gitignore
└── Sources/
    ├── DirectorApp.swift     # @main, ModelContainer, .onOpenURL
    ├── Info.plist                   # generated by XcodeGen from project.yml (see below)
    ├── Models/                      # SwiftData @Model types (see §7.1)
    ├── Services/
    │   ├── DirectorAPIClient.swift  # the sync client (see §7.2)
    │   ├── SyncService.swift        # pushes unsynced local rows
    │   ├── DeepLinkHandler.swift    # directorforgood:// (see §7.4)
    │   └── VoiceCapture.swift       # SFSpeechRecognizer (G3 stretch)
    ├── Views/
    │   ├── ConversationListView.swift
    │   ├── ConversationDetailView.swift   # split: messages + artifact pane
    │   ├── CaptureView.swift              # brain-dump (text + mic)
    │   ├── ArtifactView.swift             # current version + version scrubber
    │   ├── TimeClockView.swift
    │   └── SettingsView.swift             # baseURL, apiKey, orgSlug
    └── Utilities/
```

---

## 6. Backend API contract (this is what the app talks to)

Base URL: production is `https://directorforgood.org`. **Note:** the routes below are newly added; confirm with Bosko that the backend is deployed with them and the DB migration is applied before expecting live responses. For local dev you can point at a tunneled dev server (Tailscale or ngrok).

### 6.1 Auth — every request sends these headers
```
Authorization: Bearer <ENTITY_SERVICE_API_KEY>
X-Org-Slug: hiiiwav
Content-Type: application/json
```
The `ENTITY_SERVICE_API_KEY` value is a secret Bosko provides out-of-band (also set in the server's env). Never hardcode it; read from Settings/Keychain. `X-Org-Slug` selects the tenant (default `hiiiwav`).

### 6.2 Endpoints

| Method & path | Body | Returns |
|---|---|---|
| `POST /api/conversations` | `{ title?, source: "ios", partyId?, userId?, metadata? }` | `{ conversation }` |
| `GET /api/conversations?limit=50` | — | `{ conversations: [...] }` |
| `GET /api/conversations/:id` | — | `{ conversation: { ...fields, messages:[...], artifacts:[{...artifact, currentVersion}] } }` |
| `POST /api/conversations/:id/messages` | `{ role: "user"\|"assistant", content, metadata? }` | `{ message }` |
| `POST /api/artifacts` | `{ conversationId, kind, title, content, partyId?, changeSummary?, createdByMessageId? }` | `{ artifact }` |
| `GET /api/artifacts/:id` | — | `{ artifact: { ...fields, versions:[...], currentVersion } }` |
| `POST /api/artifacts/:id/versions` | `{ content, changeSummary?, createdByMessageId? }` | `{ version }` |
| `POST /api/artifacts/:id/restore` | `{ versionId }` | `{ version }` |
| `GET /api/time-entries?status=&userId=&limit=` | — | `{ timeEntries: [...] }` |
| `POST /api/time-entries` | `{ userId?, projectTag?, description?, partyId?, rateCents?, startedAt? }` | `{ timeEntry }` |
| `PATCH /api/time-entries/:id` | `{ endedAt?, description? }` | `{ timeEntry }` |

A `401` means the bearer key is missing/wrong. A `404` on messages/artifacts means the parent id isn't in this tenant.

### 6.3 Object shapes (server field names; decode with these)
- **conversation**: `id, orgSlug, userId, partyId, title, source, status, metadata, createdAt, updatedAt`
- **message**: `id, conversationId, role, content, metadata, createdAt`
- **artifact**: `id, orgSlug, conversationId, partyId, kind, title, currentVersionId, status, metadata, createdAt, updatedAt`
- **artifactVersion** (`currentVersion` / items in `versions`): `id, artifactId, versionNumber, content, changeSummary, createdByMessageId, createdAt`
- **timeEntry**: `id, orgSlug, userId, partyId, projectTag, description, startedAt, endedAt, durationSeconds, billable, rateCents, status, invoiceRef, metadata, createdAt, updatedAt`

`kind` values for artifacts: `summary | action_items | email | doc | note`. Timestamps are ISO‑8601 strings.

### 6.4 Forthcoming endpoint (do not build yet — stub the button)
A server AI endpoint (likely `POST /api/conversations/:id/generate`) will take the conversation and produce/iterate artifacts via tool-use, returning the new artifact/version. For now: the "Summarize / Action items" button should call a single method `generate(conversationId:, kind:)` that you leave as a TODO hitting that path, so wiring it up later is one place. Confirm the final path with Bosko before shipping G5.

---

## 7. App architecture

### 7.1 SwiftData models (mirror the server; add sync fields)
Define `@Model` classes with the server fields above, plus per-row sync metadata:
- `remoteId: Int?` (server id once synced), `isSynced: Bool`, `updatedLocallyAt: Date`.
- `Conversation` (has `messages: [Message]`, `artifacts: [Artifact]`), `Message`, `Artifact` (has `versions: [ArtifactVersion]`, `currentVersionNumber: Int`), `ArtifactVersion`, `TimeEntry`.
- Capture is **local-first**: write locally immediately, then `SyncService` pushes unsynced rows and stores `remoteId`. Never block the UI on the network.

### 7.2 `DirectorAPIClient` (the sync client — start here for G2)
A Swift `actor`, modeled on `MileageTracker`'s `FOSAPIClient`:

```swift
actor DirectorAPIClient {
    struct Config { var baseURL: URL; var apiKey: String; var orgSlug: String }
    enum APIError: Error { case http(Int, Data) }

    private let config: Config
    init(config: Config) { self.config = config }

    private func send(_ path: String, method: String = "GET", json: Encodable? = nil) async throws -> Data {
        var req = URLRequest(url: config.baseURL.appendingPathComponent(path))
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(config.apiKey)", forHTTPHeaderField: "Authorization")
        req.setValue(config.orgSlug, forHTTPHeaderField: "X-Org-Slug")
        if let json { req.httpBody = try JSONEncoder().encode(AnyEncodable(json)) }
        let (data, resp) = try await URLSession.shared.data(for: req)
        let code = (resp as? HTTPURLResponse)?.statusCode ?? -1
        guard (200..<300).contains(code) else { throw APIError.http(code, data) }
        return data
    }
    // Map each row in §6.2 to a method:
    //   createConversation, listConversations, getConversation,
    //   appendMessage, createArtifact, updateArtifact, restoreArtifact,
    //   listTimeEntries, startTimeEntry, stopTimeEntry
}
```
(Use a small `AnyEncodable` wrapper or per-call `Codable` request structs — your choice. Decode responses with `Codable` structs matching §6.3, using `.convertFromSnakeCase`? No — server keys are already camelCase, so default keys.)

### 7.3 Screens (minimum for G1–G4)
- **SettingsView** — `baseURL`, `apiKey` (SecureField), `orgSlug` (`@AppStorage` / Keychain). A "Test connection" button (`GET /api/conversations?limit=1`).
- **CaptureView** — big text field + mic button. "Save" creates a local Conversation + first Message, kicks off sync.
- **ConversationListView** — lists conversations (local, merged with server).
- **ConversationDetailView** — **split layout**: messages (instruction trail) on one side, an **artifact pane** on the other. This separation is the core UX — do not render artifacts inline in the message list.
- **ArtifactView** — shows `currentVersion.content` (render markdown), with a version picker (`versions` by `versionNumber`) and a "Restore" action → `POST /api/artifacts/:id/restore`.
- **TimeClockView** — Start/Stop. Show the running entry's elapsed time.

### 7.4 URL scheme control (mirror `mileagetracker://`)
Register `directorforgood://` and handle in `DeepLinkHandler` via `.onOpenURL`. Support at least:
- `directorforgood://new-capture?text=...&party=...`
- `directorforgood://clock-in?project=...` and `directorforgood://clock-out`
This lets OpenClaw/agents drive the app. Dispatch on `url.host()`, parse query items, perform the action. (Physical device: `open "directorforgood://..."`; Simulator: `xcrun simctl openurl booted "directorforgood://..."`.)

---

## 8. Build pipeline — templates

### `project.yml`
```yaml
name: Director
options:
  bundleIdPrefix: org.directorforgood
  deploymentTarget: { iOS: "17.0" }
  createIntermediateGroups: true
settings:
  base:
    MARKETING_VERSION: "0.1.0"
    CURRENT_PROJECT_VERSION: "1"
    DEVELOPMENT_TEAM: "3L66A32827"      # ElectroSpit Inc. (Bosko's team)
    CODE_SIGN_STYLE: Automatic
    SWIFT_VERSION: "5.9"
    GENERATE_INFOPLIST_FILE: NO
targets:
  Director:
    type: application
    platform: iOS
    sources: [Sources]
    settings:
      base:
        PRODUCT_BUNDLE_IDENTIFIER: org.directorforgood.app
        TARGETED_DEVICE_FAMILY: "1,2"
    info:
      path: Sources/Info.plist
      properties:
        CFBundleDisplayName: Director
        CFBundleShortVersionString: "$(MARKETING_VERSION)"
        CFBundleVersion: "$(CURRENT_PROJECT_VERSION)"
        UILaunchScreen: {}
        ITSAppUsesNonExemptEncryption: false
        NSMicrophoneUsageDescription: "Director records your voice to capture conversations and notes."
        NSSpeechRecognitionUsageDescription: "Director transcribes your voice so captures become searchable text."
        CFBundleURLTypes:
          - CFBundleURLName: org.directorforgood.app
            CFBundleURLSchemes: [directorforgood]
```

### `Makefile`
```make
-include .asc-credentials

SCHEME    = Director
PROJECT   = Director.xcodeproj
BUNDLE_ID ?= org.directorforgood.app
CONFIG    = Release
BUILD_DIR = build
ARCHIVE   = $(BUILD_DIR)/$(SCHEME).xcarchive
SIM_NAME ?= iPhone 16

.PHONY: generate build run archive export upload beta bump-build clean check-asc

generate:
	xcodegen generate

build: generate
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration Debug \
	  -destination 'generic/platform=iOS' -allowProvisioningUpdates build

run: generate
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration Debug \
	  -destination 'platform=iOS Simulator,name=$(SIM_NAME)' -derivedDataPath $(BUILD_DIR)/dd build
	xcrun simctl boot "$(SIM_NAME)" || true
	open -a Simulator
	xcrun simctl install booted "$(BUILD_DIR)/dd/Build/Products/Debug-iphonesimulator/$(SCHEME).app"
	xcrun simctl launch booted $(BUNDLE_ID)

check-asc:
	@test -n "$(ISSUER_ID)" || (echo "ISSUER_ID missing in .asc-credentials" && exit 1)
	@test -f "$(PRIVATE_KEY_PATH)" || (echo "ASC key missing at $(PRIVATE_KEY_PATH)" && exit 1)

archive: generate check-asc
	xcodebuild -project $(PROJECT) -scheme $(SCHEME) -configuration $(CONFIG) \
	  -destination 'generic/platform=iOS' -archivePath $(ARCHIVE) -allowProvisioningUpdates \
	  -authenticationKeyPath $(PRIVATE_KEY_PATH) -authenticationKeyID $(API_KEY) \
	  -authenticationKeyIssuerID $(ISSUER_ID) archive

export: check-asc
	xcodebuild -exportArchive -archivePath $(ARCHIVE) -exportPath $(BUILD_DIR)/export \
	  -exportOptionsPlist ExportOptions.plist -allowProvisioningUpdates \
	  -authenticationKeyPath $(PRIVATE_KEY_PATH) -authenticationKeyID $(API_KEY) \
	  -authenticationKeyIssuerID $(ISSUER_ID)

upload: check-asc
	xcrun altool --upload-app -f $(BUILD_DIR)/export/*.ipa -t ios \
	  --apiKey $(API_KEY) --apiIssuer $(ISSUER_ID)

bump-build:
	@/usr/bin/sed -i '' "s/CURRENT_PROJECT_VERSION: \"\([0-9]*\)\"/CURRENT_PROJECT_VERSION: \"$$(($(shell awk -F'\"' '/CURRENT_PROJECT_VERSION/{print $$2}' project.yml)+1))\"/" project.yml

beta: bump-build archive export upload

clean:
	rm -rf $(BUILD_DIR) $(PROJECT)
```

### `ExportOptions.plist`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>teamID</key><string>3L66A32827</string>
  <key>destination</key><string>upload</string>
  <key>signingStyle</key><string>automatic</string>
</dict></plist>
```

### `.asc-credentials` (gitignored — fill the issuer id)
```
ISSUER_ID=<<FILL: App Store Connect → Users and Access → Integrations → Issuer ID>>
API_KEY=D6NXZNBW6Q
PRIVATE_KEY_PATH=/Users/<you>/.appstoreconnect/private_keys/AuthKey_D6NXZNBW6Q.p8
TEAM_ID=3L66A32827
BUNDLE_ID=org.directorforgood.app
```

### `.gitignore`
```
build/
*.xcodeproj
*.xcarchive
DerivedData/
.asc-credentials
*.p8
AuthKey_*
.DS_Store
```

---

## 9. Execution plan (do these in order; verify each gate)

1. **Scaffold** §5 layout; write `project.yml`, `Makefile`, `ExportOptions.plist`, `.gitignore`; create a stub `@main` App with a "Hello" view. `make run` → **G1**. `git init` + first commit.
2. **Settings + API client** (§7.2, SettingsView). Implement `DirectorAPIClient` and a "Test connection" call. Create a conversation + message against the server and read it back → **G2**.
3. **Capture loop** (§7.3): SwiftData models, CaptureView, ConversationList/Detail with the **split messages/artifact panes**, SyncService. → **G3**.
4. **Time clock** (§7.3 TimeClockView, `/api/time-entries`). → **G4**.
5. **Voice** (`VoiceCapture` via `SFSpeechRecognizer` + `AVAudioEngine`); request mic + speech permission (Info.plist keys already set).
6. **URL scheme** (§7.4).
7. **TestFlight** (§8): only after the App Store Connect app record + `ISSUER_ID` exist. `make beta` → **G5**.

After each gate: run `make build` clean, commit, and note status. If a gate fails twice for the same reason, stop and report rather than thrashing.

---

## 10. Guardrails — do NOT

- ❌ Build the app inside a web repo. It is its own repo (`~/GitHub/director-ios`).
- ❌ Commit secrets. `.asc-credentials`, `*.p8`, and any API key must be gitignored and never pasted into source or this kind of doc.
- ❌ Hardcode `ENTITY_SERVICE_API_KEY` or base URL in Swift — they come from Settings/Keychain.
- ❌ Add SPM dependencies for things Foundation/Apple frameworks already do.
- ❌ Hand-edit `Director.xcodeproj` — regenerate from `project.yml`.
- ❌ Run an LLM on-device. Generation is server-side (§6.4).
- ❌ Render artifacts inline in the chat. Conversation and artifact are separate panes — that separation is the product.

---

## 11. Open questions — surface these to Bosko rather than guessing

1. **Final app name / bundle id / URL scheme** — confirm the working names in the header, or replace.
2. **`ENTITY_SERVICE_API_KEY`** value (for the app) — and confirm it's set in the backend's Vercel env so the server validates it.
3. **Backend status** — are the new routes deployed to `directorforgood.org` and the DB migration applied? If not, point the app at a dev URL (Tailscale/ngrok) for now.
4. **App Store Connect app record** — does the bundle id exist in App Store Connect, and what is the **Issuer ID** for `.asc-credentials`? (Needed only for G5.)
5. **The AI `generate` endpoint** path/shape (§6.4) — confirm before wiring the "Summarize" button for real.

---

*Generated as a handoff brief. The backend it targets (`conversations` / `artifacts` / `time-entries` API) was built in the `directorforgood.org` repo; this app is the iOS client of that canonical store.*
