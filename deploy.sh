#!/bin/bash
set -euo pipefail

error_handler() {
  line="*** SITE WAS NOT DEPLOYED ***"
  echo -e "\e[01;31m$line\e[0m" 1>&2
}

trap error_handler ERR

curr_branch=${CI_COMMIT_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}

if [[ "${1:-}" != "--skip-git-checks" ]]; then
  if [[ -n "$(git status --porcelain)" ]]; then
    line="*** git status unclean ***"
    echo -e "\e[01;31m$line\e[0m" 1>&2
    false
  fi

  if [[ "$(git ls-remote --head --exit-code origin "$curr_branch" | cut -f 1)" != "$(git rev-parse "$curr_branch")" ]]; then
    line="*** git not in sync ***"
    echo -e "\e[01;31m$line\e[0m" 1>&2
    false
  fi
fi
rails test

case $curr_branch in
master)
  dir=railscharts/
  ;;
*)
  echo -e "\e[01;31mWRONG BRANCH, only master, develop and rails6 are currently supported\e[0m" 1>&2
  exit 1
  ;;
esac
echo "The dir is $dir"
rails assets:clean
rails assets:precompile
chmod -R g+w .
rsync -ruvz --delete \
  --exclude={.env.production,.git/,tmp/,log/,storage/,coverage/,config/credentials.yml.enc,config/master.key,db/production.sqlite3} \
  --filter=':- .gitignore' \
  ./ pan.ron.gr:/home/ruby/"$dir"
rsync -ruvz --delete public/ pan.ron.gr:/home/ruby/"$dir"/public/
ssh pan.ron.gr sudo -u ruby /home/ruby/pre-server-restart.sh /home/ruby/"$dir"
