#### 30/10/2023

=====================================================================
# REFERENCES
=====================================================================

# ====== general === 

// Search: 'kind:NOT Folder'
// https://superuser.com/questions/1747320/windows_11-file-sort-command-to-view-all-files-within-subfolders

# ====== mysql === 

# bind mount
// https://stackoverflow.com/questions/70961409/how-to-create-docker-compose-file-with-mysql-image-to-save-all-data-inside-volum

# ====== frontend === 

# ezleague

// https://stackoverflow.com/questions/76487347/ts2552-cannot-find-name-pictureinpictureevent-did-you-mean-pictureinpicture

# ====== backend === 

// https://stackoverflow.com/questions/50888650/how-to-install-vendor-folder

=====================================================================
# DEPLOY TO HOST
=====================================================================

# setup and start
run view
run prune
run build all/backend/nginx/frontend
run upload all
run start

# migrate data for backend
// docker exec ezleague_backend_1 php artisan migrate:fresh
// docker exec ezleague_backend_1 php artisan db:seed
docker exec ezleague_backend_1 php artisan migrate --seed

# validate
run log
chrome://settings/privacy
frontend: `localhost:4200`
backend: `localhost:8000`
phpmyadmin: `localhost:7000`

# change source
frontend.src.app.home.home.page.html -> 'Old ATM' -> 'New ATM'
run deploy frontend

=====================================================================
# DEPLOY TO AWS EC2
=====================================================================

==============================
# ====== SETUP NEW PROJECT === 
==============================

# === push local source to GitHub
// https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-push-an-existing-project-to-GitHub
# . create
// https://github.com/pvhoang/ezleague.git
git init
git add .
git commit -m "Add existing project files to Git"
git remote add origin https://github.com/pvhoang/ezleague.git
git push -u -f origin master
# . update new files
. Open 'GitHub Desktop' -> Add 'Summary', 'Description' -> Menu 'Repository' -> 'Push' (Ctrl-P)

# === prepare DockerHub
// Docker Desktop -> Images -> Hub -> Sign in
// https://hub.docker.com/ hoang12345/phan12345
// create repository: ezleague_frontend, ezleague_backend, ezleague_nginx
run upload all
// validate upload in https://hub.docker.com/ hoang12345/phan12345

# === create EC2 instance
// www.aws.com -> My Account -> AWS Management Console -> EC2 -> EC2 Dashboard -> Launch Instance
// Launch an instance
//    Name and tags: ezleague
//    Create new key pair -> Key pair name: ezleague -> Create key pair (RSA, .pem)
//    Add new security Inbound Rules: 4200-TCP-0.0.0.0/0, 8000-TCP-0.0.0.0/0
// Launch instance -> View all instances -> Select box -> Connect -> Connect to instance -> SSH Client ->
//    ssh -i "ezleague.pem" ec2-user@ec2-52-62-18-8.ap-southeast-2.compute.amazonaws.com

# . change file mode 
// https://gist.github.com/jaskiratr/cfacb332bfdff2f63f535db7efb6df93
// chmod 400 ezleague.pem
icacls.exe ezleague.pem /reset
icacls.exe ezleague.pem /grant:r "hoang:(r)"
icacls.exe ezleague.pem /inheritance:r

# . install tools (composer, docker, git, docker-compose)
ssh -i "ezleague.pem" ec2-user@ec2-52-62-18-8.ap-southeast-2.compute.amazonaws.com
[ec2-user@ip-172-31-3-81 ~]$

login
// https://www.scaler.com/topics/super-user-in-linux/
// sudo passwd -l root
// sudo yum update -y
sudo yum install composer
sudo yum -y install docker
sudo yum install git
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
// https://stackoverflow.com/questions/71319730/error-loading-python-lib-tmp-meir5krcn-libpython3-7m-so-1-0-dlopen-libcryp
sudo yum install libxcrypt-compat
sudo usermod -a -G docker ec2-user
sudo service docker start
sudo systemctl enable docker
// https://stacktuts.com/got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket-at-unix-var-run-docker-sock-get-http-2fvar-2frun-2fdocker-sock-v1-24-version-dial-unix-var-run-docker-sock-connect-permission-denied
sudo chmod 666 /var/run/docker.sock
# . validate and setup 
docker-compose -v
docker version
docker ps
git clone https://github.com/pvhoang/ezleague.git
cd ezleague/backend
# . create backend/vendor
composer install --ignore-platform-reqs

==============================
# ====== DEPLOY PROJECT ======
==============================
ssh -i "ezleague.pem" ec2-user@ec2-52-62-18-8.ap-southeast-2.compute.amazonaws.com
[ec2-user@ip-172-31-3-81 ~]$
cd ezleague
git pull
bash run.sh download
bash run.sh start
# . migrate and seed db (if 1st time)
docker exec ezleague_backend_1 php artisan migrate --seed
# . test
Public IPv4 address: 52.62.18.8
frontend: `52.62.18.8:4200`
backend: `52.62.18.8:8000`
phpmyadmin: `52.62.18.8:7000`

==============================
# ====== DEBUG PROJECT =======
==============================

# . view and dump container and image data
// https://www.baeldung.com/ops/docker-container-filesystem
docker exec -it ezleague_backend_1 /bin/sh
/var/www/html $
ls
exit
docker export ezleague_backend_1 | tar t > ezleague_backend_1-files.txt
docker image save ezleague_backend > ezleague_backend.image.tar
docker image history ezleague_backend:latest


