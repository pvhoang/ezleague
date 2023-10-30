# --- REFERENCES ---

# mysql bind mount
// https://stackoverflow.com/questions/70961409/how-to-create-docker-compose-file-with-mysql-image-to-save-all-data-inside-volum

# frontend - EZLEAGUE
// https://stackoverflow.com/questions/76487347/ts2552-cannot-find-name-pictureinpictureevent-did-you-mean-pictureinpicture

# backend /vendor - EZLEAGUE
https://stackoverflow.com/questions/50888650/how-to-install-vendor-folder
# backend /sort file in Explorer - EZLEAGUE
Search: 'kind:NOT Folder'
// https://superuser.com/questions/1747320/windows-11-file-sort-command-to-view-all-files-within-subfolders


# --- DEPLOY TO HOST ---

# 1 - Setup and exec
run view
run prune
run build all/backend/nginx/frontend
run exec

# 2 - Migrate data for backend
<!-- docker exec ezleague-backend-1 php artisan migrate:fresh -->
<!-- docker exec ezleague-backend-1 php artisan db:seed -->
docker exec ezleague-backend-1 php artisan migrate --seed

# 3 - Validate
run log
chrome://settings/privacy
frontend: `localhost:4200`
backend: `localhost:8000`
phpmyadmin: `localhost:7000`

# 4 - Change source
frontend.src.app.home.home.page.html -> 'Old ATM' -> 'New ATM'
run deploy frontend


# --- DEPLOY TO AWS EC2 ---

# 1 - Prepare GitHub
// https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-push-an-existing-project-to-GitHub
#     Create
// https://github.com/pvhoang/ezleague.git
git init
git add .
git commit -m "Add existing project files to Git"
git remote add origin https://github.com/pvhoang/ezleague.git
git push -u -f origin master
#     Update
. Open 'GitHub Desktop' -> Add 'Summary', 'Description' -> Menu 'Repository' -> 'Push' (Ctrl-P)
git pull

# 2 - Prepare DockerHub

// Docker Desktop -> Images -> Hub -> Sign in
// https://hub.docker.com/ hoang12345/phan12345
// create repository: ezleague-frontend, ezleague-backend, ezleague-nginx
run upload all

# 3 - Work with EC2

#     Create instance
// www.aws.com -> My Account -> AWS Management Console -> EC2 -> EC2 Dashboard -> Launch Instance
// Launch an instance
//    Name and tags: ezleague
//    Create new key pair -> Key pair name: ezleague -> Create key pair (RSA, .pem)
//    Add new security Inbound Rules: 4200-TCP-0.0.0.0/0, 8000-TCP-0.0.0.0/0
// Launch instance -> View all instances -> Select box -> Connect -> Connect to instance -> SSH Client ->
//    ssh -i "ezleague.pem" ec2-user@ec2-52-62-18-8.ap-southeast-2.compute.amazonaws.com

#     Change file mode 
// https://gist.github.com/jaskiratr/cfacb332bfdff2f63f535db7efb6df93
// chmod 400 ezleague.pem
icacls.exe ezleague.pem /reset
icacls.exe ezleague.pem /grant:r "hoang:(r)"
icacls.exe ezleague.pem /inheritance:r

#     Install Docker (docker, git, docker-compose) on EC2
ssh -i "ezleague.pem" ec2-user@ec2-52-62-18-8.ap-southeast-2.compute.amazonaws.com

[ec2-user@ip-172-31-14-154 ~]$
login
// https://www.scaler.com/topics/super-user-in-linux/
sudo passwd -l root
sudo yum update -y
sudo yum -y install docker
sudo yum install git
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
// https://stackoverflow.com/questions/71319730/error-loading-python-lib-tmp-meir5krcn-libpython3-7m-so-1-0-dlopen-libcryp
sudo yum install libxcrypt-compat
docker-compose -v
#     Setup
sudo usermod -a -G docker ec2-user
sudo service docker start
sudo systemctl enable docker
docker version
<!-- https://stacktuts.com/got-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket-at-unix-var-run-docker-sock-get-http-2fvar-2frun-2fdocker-sock-v1-24-version-dial-unix-var-run-docker-sock-connect-permission-denied -->
sudo chmod 666 /var/run/docker.sock
docker version
docker ps

# -- Deploy
git clone https://github.com/pvhoang/ezleague.git
cd ezleague
docker-compose -f docker-compose-ec2.yaml up -d


