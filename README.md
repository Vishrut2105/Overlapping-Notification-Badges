# Overlapping Notification Badges —  Edition

A minimalist, aesthetic, zero-dependency component showcase for **Overlapping Notification Badges** built with vanilla **HTML5**, **CSS3**, and **JavaScript**.

---


---

## 📐 The 10-Line CSS Cutout Secret

The core technique relies on positioning the badge over the corner and applying a background-matching border to create a cutout notch effect:

```css
/* 1. Host container must be relative */
.avatar-wrap {
  position: relative;
  display: inline-flex;
}

/* 2. Absolute badge with 35% corner offset */
.badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(35%, -35%);
  border-radius: 9999px;
  background: #ef4444;
  color: #ffffff;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 700;

  /* 3. Cutout notch trick: border matches parent container background */
  border: 2px solid var(--bg-card);
  box-sizing: content-box;
}
```

---

## 🕹️ Interactive Features

1. **Canvas Playground**:
   - Host selector: **Avatar**, **Bell**, **Chat**.
   - Stepper counter: `[-] [ 5 ] [+]`.
   - Corner positioning: **TR**, **TL**, **BR**, **BL**.
   - Color themes: Crimson, Violet, Emerald, Amber, Cyan.
   - Toggles: Cutout notch border, Radar ping wave, Online presence dot.
2. **4 Essential Patterns**:
   - **Dual Overlap Avatar** (unread badge + presence dot).
   - **Stacked Facepile** (overlapping social avatars with `+4` overflow).
   - **Alert Bell Dot** (numeric-less indicator with radar ping).
   - **Card with Overlap** (compact toast with embedded overlapping avatar).
3. **Copy-Ready Snippet**: One-click button to copy the exact CSS cutout code.
4. **Live Simulation & Theme Toggle**: Simulates incoming notifications with Web Audio chimes; supports instant light/dark switching.

---

## 🚀 Running the Project

Open [index.html](file:///d:/Personal/bansi%20WD%20project/index.html) in your browser. No build steps or package managers required.
