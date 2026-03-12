# PlantUML Diagrams — Stock Management System

This folder contains the same diagrams as in the project docs, in **PlantUML** format (`.puml`).

## Files

| File | Diagram |
|------|---------|
| `use-case.puml` | Use case diagram (actors and use cases) |
| `class-diagram.puml` | Class diagram (User, Product, Supplier, StockTransaction) |
| `data-flow-level0.puml` | Data flow diagram Level 0 (User ↔ System ↔ MongoDB) |
| `data-flow.puml` | Data flow diagram Level 1 (Frontend, Backend, MongoDB) |
| `sequence-login-view-stock.puml` | Sequence diagram (login and view stock) |

## How to view or export

### Option 1: PlantUML online (no install)

1. Go to **https://www.plantuml.com/plantuml/uml**
2. Open a `.puml` file from this folder and copy all its text.
3. Paste into the PlantUML editor.
4. The diagram appears; use the menu to **export as PNG or SVG**.
5. Insert the image into PowerPoint or your document.

### Option 2: VS Code / Cursor extension

1. Install the **PlantUML** extension (by jebbs).
2. Open a `.puml` file.
3. Press **Alt+D** (or right‑click → “Preview Current Diagram”) to see the diagram.
4. Right‑click in the preview → **Export Current Diagram** → choose PNG or SVG.

### Option 3: Command-line (Java required)

1. Install PlantUML: download `plantuml.jar` from https://plantuml.com/download
2. Run:
   ```bash
   java -jar plantuml.jar docs/plantuml/*.puml
   ```
   PNG files are created next to each `.puml` file.

### Option 4: PlantText (online)

1. Go to **https://www.planttext.com**
2. Copy the contents of a `.puml` file and paste into the editor.
3. Export or copy the image.

---

## Quick copy-paste

- **Use case:** open `use-case.puml`, copy from `@startuml` to `@enduml`.
- **Class:** open `class-diagram.puml`, copy full file.
- **Data flow:** open `data-flow.puml`, copy full file.
- **Sequence:** open `sequence-login-view-stock.puml`, copy full file.

Paste into any PlantUML editor (e.g. plantuml.com/plantuml/uml) to render and export.
