# photolab_hack

1. Install docker.
2. Pull last image version to your machine:
 ```
 docker pull gasparjan/photolab_hack:latest
 ```
3. Run docker:
 ```
 docker run --rm -it -p 80:8000 --ipc=host gasparjan/photolab_hack:latest
 ```
 or go to project folder and bash script:
 ```
 cd ~/photolab_hack
 ./run_docker.sh
 ```

4. Configure access to AWS S3:
 - go to .aws folder:
 ```
 cd ~/.aws
 ```
 - create config file and fill it with user name:
 ```
 [profile %USER_NAME%]
 ```
 - create credentials file and fill it with secret keys:
 ```
 [%USER_NAME%]
 
 aws_access_key_id = AAAAAAAAAAAAAAAAAAA
 aws_secret_access_key = RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
 ```
5. Go to project folder and run server:
 ```
 cd ~/photolab_hack
 ```
 ```
 gunicorn --bind=0.0.0.0:8000 --workers=2 -k gthread --thread=2  --timeout 90 --chdir /root/photolab_hack app:app --reload
 ```
 or 
 ```
 ./start.sh
 ```
 
