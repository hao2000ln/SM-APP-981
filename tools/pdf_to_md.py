# -*- coding: utf-8 -*-
"""Chuyen docs SM 9.81 (PDF) -> markdown, chia nho theo muc luc.

DOC  : Document/pdf/v981/<Name>.pdf  (qua pdftotext -layout)
GHI  : tools/_tmp/<Name>.txt (trung gian)  va  Document/md/v981/<Name>/*.md
       + Document/md/INDEX.md  (+ tools/_tmp/report_<Name>.txt)
Khong ghi/xoa gi trong Document/pdf/ hay ScriptLibrary/.

Dung: python -X utf8 tools/pdf_to_md.py [Develop Integrate ...]
Than van ban giu nguyen bo cuc pdftotext -layout, boc trong khoi code
(de bang/code khong bi markdown lam vo dinh dang).
"""
import os, re, subprocess, sys, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(ROOT, "Document", "pdf", "v981")
TMP = os.path.join(ROOT, "tools", "_tmp")
OUT = os.path.join(ROOT, "Document", "md", "v981")
MAXP = 40  # so trang toi da moi file md (gan dung)

DOCS = ["Develop", "Integrate", "Upgrade", "Release_notes", "Administer"]
RE_FOOT = re.compile(r"This PDF was generated on .* Page \d+ of \d+")
RE_HEAD = re.compile(r"^\s*Service Manager 9\.81\s*$")
RE_TOC = re.compile(r"^(\d+(?:\.\d+)*)\.\s+(.*\S)\s+(\d+)$")
RE_TOC_START = re.compile(r"^(\d+(?:\.\d+)*)\.\s+\S")


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def slug(s, n=45):
    s = re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_")
    return s[:n].strip("_") or "x"


def extract(name):
    os.makedirs(TMP, exist_ok=True)
    src = os.path.join(PDF_DIR, name + ".pdf")
    dst = os.path.join(TMP, name + ".txt")
    r = subprocess.run(["pdftotext", "-layout", "-enc", "UTF-8", src, dst],
                       capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError("pdftotext loi: " + r.stderr[:200])
    return open(dst, encoding="utf-8", errors="replace").read().split("\f")


def clean_page(txt):
    out = []
    for l in txt.splitlines():
        if RE_FOOT.search(l) or RE_HEAD.match(l):
            continue
        out.append(l.rstrip())
    return out


def parse_toc(pages, body_idx):
    """pages[0..body_idx-1] la bia+muc luc. Tra ve [(so, tieu de, trang in)]."""
    lines = []
    for p in pages[1:body_idx]:
        for l in p.splitlines():
            n = norm(l)
            if n and n != "Table of Contents":
                lines.append(n)
    entries, buf = [], ""
    for n in lines:
        buf = (buf + " " + n).strip() if buf else n
        m = RE_TOC.match(buf)
        if m:
            entries.append((m.group(1), m.group(2), int(m.group(3))))
            buf = ""
        elif not RE_TOC_START.match(buf):
            buf = ""  # dong rac, bo
        elif len(buf) > 300:
            buf = ""
    return entries


def find_body_start(pages):
    for i, p in enumerate(pages[:400]):
        if re.search(r"Page 1 of \d+", p):
            return i
    return None


def heading_line(lines, num, title):
    """chi so dong heading 'num. title' trong trang, hoac None."""
    key = num + "."
    t0 = norm(title)[:12]
    for i, l in enumerate(lines[:60]):
        n = norm(l)
        if n.startswith(key + " ") and norm(n[len(key):])[:12] == t0:
            return i
    return None


class Node:
    def __init__(s, num, title, page):
        s.num, s.title, s.page = num, title, page
        s.kids = []
        s.end = None  # trang in cuoi (bao gom)


def build_tree(entries):
    root = Node("0", "ROOT", 0)
    stack = [root]
    for num, title, page in entries:
        n = Node(num, title, page)
        d = num.count(".") + 1
        while len(stack) > 1 and stack[-1].num.count(".") + 1 >= d:
            stack.pop()
        stack[-1].kids.append(n)
        stack.append(n)
    return root


def flat(node, acc):
    for k in node.kids:
        acc.append(k)
        flat(k, acc)
    return acc


def split(node, last_page):
    """Tra ve list piece = dict(start=(trang, so, tieu de), items=[(so,tieu de)])."""
    # tinh span: node ket thuc truoc node ke tiep (trong danh sach phang)
    def span(n):
        return n.end - n.page + 1

    def rec(n):
        if not n.kids or span(n) <= MAXP:
            return [dict(first=n, items=[(n.num, n.title)], pages=span(n), start=n.page)]
        pieces = []
        if n.kids[0].page > n.page:  # phan mo dau truoc con dau tien
            pieces.append(dict(first=n, items=[(n.num, n.title)],
                               pages=n.kids[0].page - n.page + 1, start=n.page))
        else:
            pieces.append(dict(first=n, items=[(n.num, n.title)], pages=0, start=n.page))
        for k in n.kids:
            pieces += rec(k)
        # gop cac piece lien tiep neu tong <= MAXP
        merged = []
        for p in pieces:
            if merged and merged[-1]["pages"] + p["pages"] <= MAXP and p["pages"] > 0:
                merged[-1]["items"] += p["items"]
                merged[-1]["pages"] += p["pages"]
            else:
                merged.append(p)
        return merged

    return rec(node)


def assign_ends(root, last_page):
    nodes = flat(root, [])
    for i, n in enumerate(nodes):
        nxt = nodes[i + 1].page if i + 1 < len(nodes) else last_page + 1
        n.end = max(n.page, nxt)  # cho phep chia se trang
    # node cha ket thuc = end cua con cuoi
    def fix(n):
        for k in n.kids:
            fix(k)
        if n.kids:
            n.end = max(n.end, n.kids[-1].end)
    for k in root.kids:
        fix(k)
    return nodes


def convert(name, index_rows):
    pages_raw = extract(name)
    if not pages_raw[-1].strip():
        pages_raw = pages_raw[:-1]
    body = find_body_start(pages_raw)
    rep = ["== %s: %d trang PDF, body bat dau tai trang PDF %d" % (name, len(pages_raw), (body or -1) + 1)]
    if body is None:
        rep.append("LOI: khong tim thay trang bat dau than tai lieu"); return rep, False
    entries = parse_toc(pages_raw, body)
    rep.append("Muc luc: %d muc" % len(entries))
    if not entries:
        rep.append("LOI: khong doc duoc muc luc"); return rep, False
    offset = body - 1  # trang in p -> chi so pages_raw[p + offset]
    cleaned = {}

    def page_lines(p):
        i = p + offset
        if i < 0 or i >= len(pages_raw):
            return []
        if i not in cleaned:
            cleaned[i] = clean_page(pages_raw[i])
        return cleaned[i]

    # kiem tra anh xa; so trang in trong muc luc lech +-1..2 cuc bo -> tim quanh vi tri du kien
    ok = bad = 0
    miss = []
    delta = 0
    fixed = []
    for num, title, pg in entries:
        found = None
        for d in (0, -1, 1, -2, 2, -3, 3):
            if heading_line(page_lines(pg + delta + d), num, title) is not None:
                found = pg + delta + d
                delta += d
                break
        if found is None:
            bad += 1; miss.append((num, title, pg)); found = pg + delta
        else:
            ok += 1
        fixed.append((num, title, max(found, fixed[-1][2] if fixed else 0)))
    entries = fixed
    rep.append("Kiem tra heading: %d/%d tim thay, %d khong thay (dung trang du kien)" % (ok, len(entries), bad))
    for m in miss[:15]:
        rep.append("   khong thay: %s %s (trang in %d)" % m)
    if bad > 15:
        rep.append("   ... va %d muc nua" % (bad - 15))
    if ok < 0.8 * len(entries):
        rep.append("CANH BAO: ti le khop thap, dung lai (khong ghi md)"); return rep, False

    last_page = len(pages_raw) - 1 - offset
    root = build_tree(entries)
    assign_ends(root, last_page)
    pieces = []
    for top in root.kids:
        pieces += split(top, last_page)

    # cat noi dung: tu dong heading cua piece den dong heading cua piece ke tiep
    def locate(first):
        ls = page_lines(first.page)
        h = heading_line(ls, first.num, first.title)
        return first.page, (h if h is not None else 0)

    # dau trang dau tien (bia/phan khong thuoc muc nao) bo qua
    outdir = os.path.join(OUT, name)
    os.makedirs(outdir, exist_ok=True)
    for f in os.listdir(outdir):
        if f.endswith(".md"):
            os.remove(os.path.join(outdir, f))  # chi xoa file md do chinh script nay tao ra
    total_chars = 0
    tablike = 0
    for idx, pc in enumerate(pieces):
        sp, sl = locate(pc["first"])
        if idx + 1 < len(pieces):
            ep, el = locate(pieces[idx + 1]["first"])
        else:
            ep, el = last_page, 10 ** 9
        lines = []
        for p in range(sp, ep + 1):
            ls = page_lines(p)
            a = sl if p == sp else 0
            b = el if p == ep else len(ls)
            lines += ls[a:b]
        while lines and not lines[0].strip():
            lines.pop(0)
        while lines and not lines[-1].strip():
            lines.pop()
        text = "\n".join(lines)
        tablike += sum(1 for l in lines if len(re.findall(r"\S {3,}\S", l)) >= 2)
        fence = "````"
        first = pc["first"]
        fname = "%03d_%s_%s.md" % (idx + 1, first.num.replace(".", "-"), slug(first.title))
        titles = [t for _, t in pc["items"]]
        title_line = "%s %s" % (first.num, first.title)
        head = ["---", "source: Document/pdf/v981/%s.pdf" % name, "version: 9.81",
                "sections: %s .. %s" % (pc["items"][0][0], pc["items"][-1][0]),
                "printed_pages: %d-%d" % (sp, ep), "---", "",
                "# " + title_line, "",
                "> Chuyen tu PDF 9.81 bang pdftotext -layout; bang/code giu bo cuc goc trong khoi code.", "",
                fence + "text", text, fence, ""]
        with open(os.path.join(outdir, fname), "w", encoding="utf-8", newline="\n") as fh:
            fh.write("\n".join(head))
        total_chars += len(text)
        if len(pc["items"]) == 1:
            desc = "%s %s." % (first.num, first.title)
        else:
            shown = "; ".join(titles[:4]) + ("; ..." if len(titles) > 4 else "")
            desc = "Muc %s-%s: %s." % (pc["items"][0][0], pc["items"][-1][0], shown)
        index_rows.append((name, "Document/md/v981/%s/%s" % (name, fname),
                           "%s (trang in %d-%d)" % (desc, sp, ep), len(text)))
    rep.append("Da ghi %d file md, %d ky tu; dong giong bang/code: %d" % (len(pieces), total_chars, tablike))
    small = [r for r in index_rows if r[0] == name and r[3] < 200]
    if small:
        rep.append("File gan nhu rong (<200 ky tu): %d (kiem tra: heading co the bi cat sai)" % len(small))
        for r in small[:10]:
            rep.append("   " + r[1])
    return rep, True


def main():
    names = sys.argv[1:] or DOCS
    rows, full = [], []
    for n in names:
        try:
            rep, ok = convert(n, rows)
        except Exception as e:  # noqa
            rep, ok = ["== %s: LOI %r" % (n, e)], False
        full += rep + [""]
        print("\n".join(rep))
    # INDEX.md (chi gom nhung doc da chuyen; giu cac doc khac neu da co)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    state = os.path.join(TMP, "index_rows.json")
    allrows = {}
    if os.path.exists(state):
        allrows = json.load(open(state, encoding="utf-8"))
    for n in names:
        allrows[n] = [r for r in rows if r[0] == n]
    json.dump(allrows, open(state, "w", encoding="utf-8"), ensure_ascii=False)
    md = ["# Document/md INDEX (SM 9.81)", "",
          "Nguon: Document/pdf/v981/ (PDF 9.81, tao ngay May 23, 2026). Sinh boi tools/pdf_to_md.py.",
          "Moi dong: duong dan - mot cau mo ta. Chua chuyen: Get_Started, Home, Install, Troubleshoot, Use.", ""]
    for n in DOCS:
        if n in allrows and allrows[n]:
            md.append("## %s (%d file)" % (n, len(allrows[n])))
            md.append("")
            for _, path, desc, _c in allrows[n]:
                md.append("- `%s` - %s" % (path, desc))
            md.append("")
    with open(os.path.join(ROOT, "Document", "md", "INDEX.md"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(md))
    open(os.path.join(TMP, "report.txt"), "w", encoding="utf-8").write("\n".join(full))


if __name__ == "__main__":
    main()
