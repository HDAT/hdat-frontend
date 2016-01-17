cd build
git init
git remote add origin git@github.com:HDAT/hdat-frontend.git
git add -A
git commit -m "deploy"
git checkout -B gh-pages
git push -u origin gh-pages -f