# -*- coding: utf-8 -*-
"""
diff_baseline.py - Lap docs/DIFF_BASELINE.md cho ScriptLibrary.

CHI DOC:  ScriptLibrary/BASELINE_9.81/, ScriptLibrary/Personal/
          (va --clean <thu muc> neu co export 9.81 sach)
CHI GHI:  docs/DIFF_BASELINE.md
Khong bao gio ghi/xoa/di chuyen file trong ScriptLibrary/ hay Document/pdf/.

Che do 1 (mac dinh, hien tai):
  BASELINE_9.81 = script SM tu he thong dang chay; Personal = script ESD_/HPT_.
  -> Liet ke script tuy bien, kiem tra prefix nam sai thu muc, trung ten.
Che do 2 (--clean <dir>): khi co export ScriptLibrary 9.81 SACH:
  so (BASELINE_9.81 + Personal) voi ban sach:
  them moi / da sua / thieu / giong het.

Cach dung:
  python tools/diff_baseline.py
  python tools/diff_baseline.py --clean <duong dan export 9.81 sach>
"""
import os, sys, re, difflib, argparse, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEF_BASE = os.path.join(ROOT, "ScriptLibrary", "BASELINE_9.81")
DEF_PERS = os.path.join(ROOT, "ScriptLibrary", "Personal")
OUT = os.path.join(ROOT, "docs", "DIFF_BASELINE.md")
PREFIX_RE = re.compile(r"^(ESD|HPT)_", re.I)


def collect(base):
    out = {}
    for dirpath, _d, files in os.walk(base):
        for f in files:
            full = os.path.join(dirpath, f)
            out[os.path.relpath(full, base).replace("\\", "/").lower()] = full
    return out


def prefix(rel):
    m = PREFIX_RE.match(os.path.basename(rel))
    return m.group(1).upper() + "_" if m else ""


def norm_lines(data):
    try:
        t = data.decode("utf-8-sig")
    except UnicodeDecodeError:
        t = data.decode("latin-1")
    return [l.rstrip() for l in t.replace("\r\n", "\n").replace("\r", "\n").split("\n")]


def read(p):
    with open(p, "rb") as fh:
        return fh.read()


def nlines(p):
    return len(norm_lines(read(p)))


def rp(p):
    return os.path.relpath(p, ROOT).replace("\\", "/")


def header(w, mode):
    w("# DIFF_BASELINE - ScriptLibrary")
    w("")
    w("> Sinh tu dong boi `tools/diff_baseline.py` - khong sua tay.")
    w("> Ngay sinh: %s. Che do: %s." % (datetime.date.today().isoformat(), mode))
    w("")
    w("## Gioi han pham vi (doc truoc khi dung file nay)")
    w("")
    w("- CHI bao phu **ScriptLibrary** (export dang tung file `.js`, 1 file = 1 record).")
    w("- Format, Process, Trigger, dbdict, Display option, Link, wizard, Format Control,")
    w("  Menu, RAD... **CHUA duoc export** -> khong co trong phan tich nay: chua co du lieu.")
    w("- `ScriptLibrary/BASELINE_9.81/` KHONG phai export tu instance 9.81 sach: la script SM")
    w("  lay tu tang app dang chay (10.0.62.29), da tach rieng script `ESD_`/`HPT_` sang")
    w("  `ScriptLibrary/Personal/`. Vi vay **cho sua truc tiep script goc (neu co) KHONG phat")
    w("  hien duoc**; tuy bien hien chi xac dinh qua prefix `ESD_`/`HPT_`.")
    w("- Ap dung: SM 9.81, tang app 10.0.62.29. Build/patch cu the: chua co du lieu.")
    w("")


def mode_split(b, p, w):
    pers = sorted(p)
    bad_in_base = sorted(r for r in b if prefix(r))
    noprefix_in_pers = sorted(r for r in pers if not prefix(r))
    both = sorted(set(b) & set(p))
    stems = {}
    for r in pers:
        s = PREFIX_RE.sub("", os.path.basename(r)).lower()
        stems.setdefault(s, []).append(os.path.basename(p[r]))
    dup = sorted((s, v) for s, v in stems.items() if len(v) > 1)
    esd = [r for r in pers if prefix(r) == "ESD_"]
    hpt = [r for r in pers if prefix(r) == "HPT_"]

    w("## Tong hop")
    w("")
    w("| Muc | So file |")
    w("|---|---|")
    w("| BASELINE_9.81 (script he thong) | %d |" % len(b))
    w("| Personal (tuy bien) | %d |" % len(p))
    w("| - prefix `ESD_` | %d |" % len(esd))
    w("| - prefix `HPT_` | %d |" % len(hpt))
    w("| **Tong** | **%d** |" % (len(b) + len(p)))
    w("| Da sua script goc (can ban 9.81 sach) | chua co du lieu |")
    w("| Thieu so voi ban sach | chua co du lieu |")
    w("")
    w("## Kiem tra tinh nhat quan")
    w("")
    w("| Kiem tra | Ket qua |")
    w("|---|---|")
    w("| File `ESD_`/`HPT_` con nam trong BASELINE_9.81 | %d |" % len(bad_in_base))
    w("| File khong prefix nam trong Personal | %d |" % len(noprefix_in_pers))
    w("| Ten file co o ca hai thu muc | %d |" % len(both))
    w("| Cung ten sau khi bo prefix (ESD_x vs HPT_x) | %d |" % len(dup))
    w("")
    for title, items in (("File ESD_/HPT_ trong BASELINE_9.81", [rp(b[r]) for r in bad_in_base]),
                         ("File khong prefix trong Personal", [rp(p[r]) for r in noprefix_in_pers]),
                         ("Trung ten o ca hai thu muc", [rp(p[r]) for r in both]),
                         ("Cung ten sau khi bo prefix", ["%s: %s" % (s, ", ".join(v)) for s, v in dup])):
        if items:
            w("**%s:**" % title)
            w("")
            for i in items:
                w("- `%s`" % i)
            w("")

    for label, group in (("ESD_", esd), ("HPT_", hpt)):
        w("## Script tuy bien prefix `%s` (%d)" % (label, len(group)))
        w("")
        w("| # | File | So dong |")
        w("|---|---|---|")
        for i, r in enumerate(group, 1):
            w("| %d | `%s` | %d |" % (i, rp(p[r]), nlines(p[r])))
        w("")
    return ("ESD_=%d HPT_=%d baseline=%d | bat thuong: prefix_trong_baseline=%d "
            "khong_prefix_trong_personal=%d trung_ten=%d cung_ten_bo_prefix=%d") % (
        len(esd), len(hpt), len(b), len(bad_in_base), len(noprefix_in_pers), len(both), len(dup))


def mode_clean(b, p, c, w):
    a = dict(b)
    a.update(p)
    only_app = sorted(set(a) - set(c))
    only_clean = sorted(set(c) - set(a))
    modified, identical = [], []
    for r in sorted(set(a) & set(c)):
        la, lc = norm_lines(read(a[r])), norm_lines(read(c[r]))
        if la == lc:
            identical.append(r)
            continue
        add = rem = 0
        for l in difflib.unified_diff(lc, la, lineterm="", n=0):
            if l.startswith("+") and not l.startswith("+++"):
                add += 1
            elif l.startswith("-") and not l.startswith("---"):
                rem += 1
        modified.append((r, add, rem))
    modified.sort(key=lambda t: -(t[1] + t[2]))
    w("## Tong hop")
    w("")
    w("| Loai | So file |")
    w("|---|---|")
    w("| Chi co o he thong (them moi) | %d |" % len(only_app))
    w("| Khac noi dung (da sua) | %d |" % len(modified))
    w("| - trong do KHONG co prefix ESD_/HPT_ (sua goc, can bao) | %d |"
      % sum(1 for m in modified if not prefix(m[0])))
    w("| Chi co o ban sach (thieu) | %d |" % len(only_clean))
    w("| Giong het | %d |" % len(identical))
    w("")
    w("## Them moi (%d)" % len(only_app))
    w("")
    for r in only_app:
        w("- `%s`%s" % (rp(a[r]), "" if prefix(r) else " **(khong prefix)**"))
    w("")
    w("## Da sua (%d)" % len(modified))
    w("")
    w("| # | File | +dong | -dong | Prefix |")
    w("|---|---|---|---|---|")
    for i, (r, ad, rm) in enumerate(modified, 1):
        w("| %d | `%s` | %d | %d | %s |" % (i, rp(a[r]), ad, rm, prefix(r) or "**khong**"))
    w("")
    w("## Thieu so voi ban sach (%d)" % len(only_clean))
    w("")
    for r in only_clean:
        w("- `%s`" % rp(c[r]))
    w("")
    return "THEM_MOI=%d DA_SUA=%d THIEU=%d GIONG=%d" % (
        len(only_app), len(modified), len(only_clean), len(identical))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baseline", default=DEF_BASE)
    ap.add_argument("--personal", default=DEF_PERS)
    ap.add_argument("--clean", help="thu muc export ScriptLibrary 9.81 sach")
    ap.add_argument("--out", default=OUT)
    args = ap.parse_args()
    dirs = [args.baseline, args.personal] + ([args.clean] if args.clean else [])
    for d in dirs:
        if not os.path.isdir(d):
            sys.stderr.write("THIEU THU MUC: %s\n" % d)
            sys.exit(2)
    b, p = collect(args.baseline), collect(args.personal)
    L = []
    if args.clean:
        header(L.append, "so voi export 9.81 sach (%s)" % rp(args.clean))
        summary = mode_clean(b, p, collect(args.clean), L.append)
    else:
        header(L.append, "tach theo prefix (chua co ban 9.81 sach)")
        summary = mode_split(b, p, L.append)
    with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(L))
    sys.stdout.write("Doc : %s\nGhi : %s\n%s\n" % (", ".join(rp(d) for d in dirs), rp(args.out), summary))


if __name__ == "__main__":
    main()
