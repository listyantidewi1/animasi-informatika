import json, urllib.request, sys, nbformat as nbf
B = "http://localhost:8888/api"
for s in json.load(urllib.request.urlopen(B + "/sessions")):
    urllib.request.urlopen(urllib.request.Request(B + "/sessions/" + s["id"], method="DELETE"))
for path in sys.argv[1:]:
    nb = nbf.v4.new_notebook(); nb.cells = [nbf.v4.new_code_cell("")]
    nb.metadata = {"kernelspec": {"name": "python3", "display_name": "Python 3", "language": "python"}}
    nbf.write(nb, path)
