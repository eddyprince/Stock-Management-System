# PowerPoint: Stock Management System Description

## Option 1: Generate .pptx with Python (recommended)

1. Install the library (if needed):
   ```bash
   pip install python-pptx
   ```
   If you get "file in use", close other Python/IDE windows and try again.

2. From the project root or from `docs`:
   ```bash
   cd docs
   python create_presentation.py
   ```

3. Open **`docs/StockManagementSystem_Description.pptx`** in PowerPoint.

The deck includes:
- **Title slide** – Stock Management Control System
- **System description** – purpose, flow, roles, tech
- **Use case diagram** – actors and use cases (summary)
- **Class diagram** – User, Product, Supplier, StockTransaction (summary)
- **Data flow diagram** – Level 0 & Level 1 (summary)
- **Sequence diagram** – login and view stock (summary)
- **Reference** – links to `docs/DIAGRAMS.md` and `docs/SYSTEM_OVERVIEW.md`

---

## Option 2: Copy outline into PowerPoint manually

Create a new presentation and add one slide per section below. For diagram slides, you can paste the Mermaid from `docs/DIAGRAMS.md` into [Mermaid Live](https://mermaid.live), export as PNG, then insert the image into the slide.

### Slide 1 – Title
- **Title:** Stock Management Control System  
- **Subtitle:** System description, use case, class, data flow & sequence diagrams  

### Slide 2 – System description
- Purpose; roles; high-level flow (SPA, login, RBAC, stock data, reports); tech stack  

### Slide 3 – Use case diagram
- Actors and use cases (see **docs/DIAGRAMS.md** or **docs/SYSTEM_OVERVIEW.md** for Mermaid).  
- Or insert an image exported from Mermaid.  

### Slide 4 – Class diagram
- User, Product, Supplier, StockTransaction and relationships (see **docs/DIAGRAMS.md**).  
- Or insert an image exported from Mermaid.  

### Slide 5 – Data flow diagram
- Level 0 and Level 1 (see **docs/DIAGRAMS.md**).  
- Or insert an image exported from Mermaid.  

### Slide 6 – Sequence diagram
- Login and view stock steps (see **docs/DIAGRAMS.md**).  
- Or insert an image exported from Mermaid.  

### Slide 7 – Reference
- docs/SYSTEM_OVERVIEW.md  
- docs/DIAGRAMS.md  

---

## Diagram images from Mermaid

1. Open **docs/DIAGRAMS.md** and copy the Mermaid code for the diagram you want.  
2. Go to [Mermaid Live Editor](https://mermaid.live).  
3. Paste the code and export as PNG (or SVG).  
4. Insert the image into the corresponding slide in PowerPoint.
