# Doc: Document/pdf/v981/<Name>.pdf -> ghi: tools/_tmp/<Name>.txt (pdftotext -layout, trang cach nhau bang \f)
# Chi DOC Document/pdf/v981/, chi GHI tools/_tmp/.
import subprocess, sys, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
names = sys.argv[1:] or ["Develop","Integrate","Upgrade","Release_notes","Administer"]
os.makedirs(os.path.join(root,"tools","_tmp"), exist_ok=True)
for n in names:
    src = os.path.join(root,"Document","pdf","v981",n+".pdf")
    dst = os.path.join(root,"tools","_tmp",n+".txt")
    r = subprocess.run(["pdftotext","-layout","-enc","UTF-8",src,dst],capture_output=True,text=True)
    t = open(dst,encoding="utf-8",errors="replace").read()
    print(n,"rc=",r.returncode,"pages=",t.count("\f"),"|"," ".join(t[:300].split())[:120],r.stderr.strip()[:150])
