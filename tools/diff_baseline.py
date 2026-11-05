# -*- coding: utf-8 -*-
"""
diff_baseline.py - So sanh ScriptLibrary BASELINE_9.81 vs APP_9.81_10.0.62.29.

CHI DOC:  ScriptLibrary/BASELINE_9.81/, ScriptLibrary/APP_9.81_10.0.62.29/
CHI GHI:  docs/DIFF_BASELINE.md
Khong bao gio ghi/xoa/di chuyen file trong ScriptLibrary/ hay Document/pdf/.

Phan loai:
  ONLY_APP      - chi co o APP            => them moi (tuy bien cua toi)
  MODIFIED      - co o ca hai, khac noi dung => da sua
  ONLY_BASELINE - chi co o BASELINE       => bi xoa/thieu trong export APP
  IDENTICAL     - giong het

Cach dung:
  python tools/diff_baseline.py
  python tools/diff_baseline.py --baseline <duong dan> --app <duong dan>
"""
import os, sys, hashlib, difflib, argparse, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEF_BASE = os.path.join(ROOT, "ScriptLibrary", "BASELINE_9.81")
DEF_APP  = os.path.join(ROOT, "ScriptLibrary", "APP_9.81_10.0.62.29")
OUT      = os.path.join(ROOT, "docs", "DIFF_BASELINE.md")


def collect(base):
    """Tra ve {duong_dan_tuong_doi_chuan_hoa: duong_dan_that}"""
    out = {}
    for dirpath, _dirs, files in os.walk(base):
        for f in files:
            full = os.path.join(dirpath, f)
            rel = os.path.relpath(full, base).replace("\\", "/")
            out[rel.lower()] = full
    return out


def read_bytes(p):
    with open(p, "rb") as fh:
        return fh.read()


def norm_lines(data):
    """Chuan hoa nhe: bo BOM, chuan hoa CRLF, bo khoang trang cuoi dong."""
    try:
        txt = data.decode("utf-8-sig")
    except UnicodeDecodeError:
        txt = data.decode("latin-1")
    return [l.rstrip() for l in txt.replace("\r\n", "\n").replace("\r", "\n").split("\n")]


def stats(a_lines, b_lines):
    """So dong them/bo giua hai phien ban."""
    added = removed = 0
    for line in difflib.unified_diff(a_lines, b_lines, lineterm="", n=0):
        if line.startswith("+") and not line.startswith("+++"):
            added += 1
        elif line.startswith("-") and not line.startswith("---"):
            removed += 1
    return added, removed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", default=DEF_BASE)
    ap.add_argument("--app", default=DEF_APP)
    ap.add_argument("--out", default=OUT)
    args = ap.parse_args()

    for p in (args.baseline, args.app):
        if not os.path.isdir(p):
            sys.stderr.write("THIEU THU MUC: %s\n" % p)
            sys.exit(2)

    b = collect(args.baseline)
    a = collect(args.app)

    only_app      = sorted(set(a) - set(b))
    only_baseline = sorted(set(b) - set(a))
    common        = sorted(set(a) & set(b))

    modified, identical = [], []
    for rel in common:
        db, da = read_bytes(b[rel]), read_bytes(a[rel])
        if hashlib.sha256(db).hexdigest() == hashlib.sha256(da).hexdigest():
            identical.append(rel)
            continue
        lb, la = norm_lines(db), norm_lines(da)
        if lb == la:
            # chi khac dinh dang (BOM / line-ending / khoang trang cuoi dong)
            identical.append(rel)
            continue
        add, rem = stats(lb, la)
        modified.append((rel, add, rem, len(lb), len(la)))

    # sap xep: sua nhieu nhat truoc
    modified.sort(key=lambda t: -(t[1] + t[2]))

    def name(rel, d):
        return os.path.relpath(d[rel], ROOT).replace("\\", "/")

    L = []
    w = L.append
    w("# DIFF BASELINE_9.81 vs APP_9.81_10.0.62.29")
    w("")
    w("> Sinh tu dong boi `tools/diff_baseline.py` - khong sua tay.")
    w("> Ngay sinh: %s" % datetime.date.today().isoformat())
    w("")
    w("## Gioi han pham vi (doc truoc khi dung file nay)")
    w("")
    w("- File nay CHI bao phu **ScriptLibrary** (export dang tung file `.js`).")
    w("- Cac phan tuy bien khac **CHUA duoc export**, nen KHONG co trong diff nay:")
    w("  Format, Process, Trigger, dbdict, Display option, Link, wizard, Format Control,")
    w("  Validity, Macro, Menu, RAD, Data Policy...")
    w("- Khac biet o day co the gom ca khac biet cua hang (khac build/patch giua")
    w("  baseline va he thong dang chay), khong chi tuy bien cua nguoi dung.")
    w("- Ket luan \"la tuy bien cua toi\" chi chac chan khi doi chieu them prefix `ESD_`")
    w("  va noi dung thuc te cua file (buoc 2b/2c).")
    w("")
    w("## Tong hop")
    w("")
    w("| Loai | So file |")
    w("|---|---|")
    w("| Chi co o APP (them moi) | %d |" % len(only_app))
    w("| Khac noi dung (da sua) | %d |" % len(modified))
    w("| Chi co o BASELINE (thieu/xoa o APP) | %d |" % len(only_baseline))
    w("| Giong het | %d |" % len(identical))
    w("| **Tong BASELINE** | **%d** |" % len(b))
    w("| **Tong APP** | **%d** |" % len(a))
    w("")

    w("## 1. Chi co o APP - them moi (%d)" % len(only_app))
    w("")
    w("| # | File | Co prefix ESD_ |")
    w("|---|---|---|")
    for i, rel in enumerate(only_app, 1):
        f = name(rel, a)
        esd = "x" if os.path.basename(rel).upper().startswith("ESD_") else ""
        w("| %d | `%s` | %s |" % (i, f, esd))
    w("")
    n_esd = sum(1 for r in only_app if os.path.basename(r).upper().startswith("ESD_"))
    w("File them moi co prefix `ESD_`: **%d / %d**. "
      "So con lai khong co `ESD_` can kiem tra: co the la script hang bo sung "
      "o build/patch moi hon, hoac tuy biet dat sai ten." % (n_esd, len(only_app)))
    w("")

    w("## 2. Khac noi dung - da sua (%d)" % len(modified))
    w("")
    w("Sap xep theo muc do khac biet giam dan. `+`/`-` = so dong them/bo (da chuan hoa")
    w("line-ending, BOM va khoang trang cuoi dong, nen khac biet thuan dinh dang khong tinh).")
    w("")
    w("| # | File | +dong | -dong | Dong BASELINE | Dong APP | ESD_ trong ten |")
    w("|---|---|---|---|---|---|---|")
    for i, (rel, add, rem, nb, na) in enumerate(modified, 1):
        esd = "x" if os.path.basename(rel).upper().startswith("ESD_") else ""
        w("| %d | `%s` | %d | %d | %d | %d | %s |" % (i, name(rel, a), add, rem, nb, na, esd))
    w("")

    w("## 3. Chi co o BASELINE - thieu trong export APP (%d)" % len(only_baseline))
    w("")
    if only_baseline:
        w("| # | File |")
        w("|---|---|")
        for i, rel in enumerate(only_baseline, 1):
            w("| %d | `%s` |" % (i, name(rel, b)))
    else:
        w("Khong co.")
    w("")
    w("Luu y: file \"thieu\" co the do pham vi export cua ban khac nhau, "
      "khong nhat thiet la bi xoa trong he thong.")
    w("")

    w("## 4. Giong het (%d)" % len(identical))
    w("")
    w("Danh sach day du de o cuoi file cho de tra; day la thanh phan goc khong doi.")
    w("")
    w("<details><summary>Mo danh sach</summary>")
    w("")
    for rel in sorted(identical):
        w("- `%s`" % name(rel, a))
    w("")
    w("</details>")
    w("")

    outdir = os.path.dirname(args.out)
    if not os.path.isdir(outdir):
        os.makedirs(outdir)
    with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(L))

    sys.stdout.write(
        "Doc : %s (%d file)\n      %s (%d file)\n"
        "Ghi : %s\n"
        "ONLY_APP=%d  MODIFIED=%d  ONLY_BASELINE=%d  IDENTICAL=%d\n"
        % (args.baseline, len(b), args.app, len(a), args.out,
           len(only_app), len(modified), len(only_baseline), len(identical)))


if __name__ == "__main__":
    main()
