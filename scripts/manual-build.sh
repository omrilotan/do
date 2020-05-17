rm -rf docs
git clone -b master --single-branch git@github.com:doowat/doowat.github.io.git docs
cd docs
ls -a | grep -v .git | egrep -vU "\.$" | xargs rm -rf
cd ../
npm run build
cd docs
# git checkout previews/*
git add .
git commit -m "$(curl -s whatthecommit.com/index.txt)"
git push origin master
