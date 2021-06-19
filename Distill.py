# I know "dist" doesn't stand for
# "distillation", it just sounds cool

import os

def main():

  htmlFiles = list(filter(lambda fileName: fileName.endswith(".html"), os.listdir(".")))

  if len(htmlFiles) == 0:
    print("======== Error ========\ncould not find any .html files.")
    return

  htmlFile = htmlFiles[0]
  
  if len(htmlFiles) > 1:
    print("======== Error ========\nplease move any .html files,\nother than your main file\ninto another directory\nproceeding with file '" + htmlFile + "'")
  
  with open(htmlFile) as htmlFileHandle:
    content = htmlFileHandle.read()
    import re
    jsSources = list(map(lambda s: s, re.findall('<script src=".*">', content)))
    print("Sources found:")
    for src in jsSources:
      srcName = src[len('<script src="'):-2]
      print("-", src)
      with open(srcName) as srcFileHandle:
        content = content.replace(src, "<script>" + srcFileHandle.read())
    with open("./Dist/Index.html", 'w') as target:
      target.write(content)
    with open("./Dist/Index.html", 'r') as target:
      print(target.read())

main()