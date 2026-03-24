#!/usr/bin/env python3
"""
Assemble index.html from HTML fragments under src/.

  python3 build.py          # write ./index.html
  python3 build.py --check  # exit 1 if index.html is out of date (for CI)
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"


def load_fragment(relative: str) -> str:
    path = SRC / relative
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding="utf-8")
    if not text.endswith("\n"):
        text += "\n"
    return text


def read_section_order() -> list[str]:
    order_file = SRC / "sections" / "order.txt"
    names: list[str] = []
    for line in order_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        names.append(line)
    return names


# Short labels for the tab strip (keep in sync with src/sections/order.txt)
TAB_LABELS: dict[str, str] = {
    "about": "About",
    "objectives": "Objectives",
    "news": "News",
    "partners": "Partners",
    "timeline": "Timeline",
    "resources": "Resources",
}


def panel_id(filename: str) -> str:
    return Path(filename).stem


def tablist_html(order: list[str]) -> str:
    lines = [
        '    <div class="tabs" data-tabs-root>',
        '      <div class="tabs__bar">',
        '        <div class="tabs__list" role="tablist" aria-label="Page sections">',
    ]
    for i, fn in enumerate(order):
        sid = panel_id(fn)
        label = TAB_LABELS.get(sid, sid.replace("-", " ").title())
        tab_id = f"tab-{sid}"
        selected = "true" if i == 0 else "false"
        lines.append(
            f'          <button type="button" class="tabs__tab" role="tab" id="{tab_id}" '
            f'aria-selected="{selected}" aria-controls="{sid}">{label}</button>'
        )
    lines.extend(
        [
            "        </div>",
            "      </div>",
            '      <div class="tabs__panels">',
        ]
    )
    return "\n".join(lines) + "\n"


def tabpanels_close() -> str:
    return "      </div>\n    </div>\n"


def assemble() -> str:
    head = load_fragment("includes/head.html")
    top = load_fragment("includes/top.html")
    hero = load_fragment("includes/hero.html")
    footer = load_fragment("includes/footer.html")

    order = read_section_order()
    tabs = tablist_html(order)

    main_chunks: list[str] = []
    for name in order:
        main_chunks.append(load_fragment(f"sections/{name}"))

    main_body = "".join(main_chunks)
    panels_end = tabpanels_close()

    return f"""<!DOCTYPE html>
<html lang="en">
  <head>
{head}  </head>
  <body>
{top}
{hero}    <main id="main">
{tabs}{main_body}{panels_end}    </main>

{footer}  </body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Build NADIR static index.html from src fragments.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify index.html matches build output without writing.",
    )
    args = parser.parse_args()
    built = assemble()
    out_path = ROOT / "index.html"

    if args.check:
        current = out_path.read_text(encoding="utf-8") if out_path.is_file() else ""
        if current != built:
            print("index.html is out of date; run: python3 build.py", file=sys.stderr)
            sys.exit(1)
        return

    out_path.write_text(built, encoding="utf-8")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
